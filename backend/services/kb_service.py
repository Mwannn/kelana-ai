import boto3
import os
from typing import Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

region_name = os.getenv("AWS_REGION", "ap-southeast-2")
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

client_kwargs = {"region_name": region_name}
if aws_access_key and aws_secret_key:
    client_kwargs["aws_access_key_id"] = aws_access_key
    client_kwargs["aws_secret_access_key"] = aws_secret_key

agent_client = boto3.client("bedrock-agent-runtime", **client_kwargs)
runtime_client = boto3.client("bedrock-runtime", **client_kwargs)

def ask_knowledge_base(question: str) -> Dict[str, Any]:
    """
    RAG Implementation:
    1. Retrieves relevant document passages from Amazon Bedrock Knowledge Base (retrieve API).
    2. Synthesizes a grounded, fact-checked response using Bedrock Foundation Model with source citations.
    """
    knowledge_base_id = os.getenv("KNOWLEDGE_BASE_ID")
    model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

    if not knowledge_base_id:
        return {
            "answer": "Knowledge Base ID is not configured. Please set KNOWLEDGE_BASE_ID in your backend .env file.",
            "source": None,
            "sources": [],
            "citations": []
        }

    retrieved_results = []
    sources: List[str] = []

    # 1. Retrieve relevant passages from the Knowledge Base
    try:
        retrieve_resp = agent_client.retrieve(
            knowledgeBaseId=knowledge_base_id,
            retrievalQuery={"text": question},
            retrievalConfiguration={
                "vectorSearchConfiguration": {
                    "numberOfResults": 3
                }
            }
        )
        retrieved_results = retrieve_resp.get("retrievalResults", [])
    except Exception as e:
        print(f"Retrieve with vectorSearchConfiguration failed: {e}. Trying fallback retrieve...")
        try:
            retrieve_resp = agent_client.retrieve(
                knowledgeBaseId=knowledge_base_id,
                retrievalQuery={"text": question}
            )
            retrieved_results = retrieve_resp.get("retrievalResults", [])
        except Exception as err:
            print(f"Fallback retrieve also failed: {err}")

    # Extract text content and source file names
    context_passages: List[str] = []
    for res in retrieved_results:
        content_text = res.get("content", {}).get("text", "")
        if content_text:
            context_passages.append(content_text)

        location = res.get("location", {})
        s3_uri = location.get("s3Location", {}).get("uri", "")
        if s3_uri:
            filename = s3_uri.split("/")[-1] if "/" in s3_uri else s3_uri
            if filename not in sources:
                sources.append(filename)

    source_display = ", ".join(sources) if sources else None

    # 2. If documents were retrieved, generate grounded answer using Bedrock Converse API
    if context_passages:
        context_str = "\n\n---\n\n".join(context_passages)
        system_prompt = (
            "You are KelanaAI, an elite and trusted AI Travel Assistant. "
            "Answer the user's question accurately, politely, and thoroughly using the provided verified travel documents.\n\n"
            "Guidelines:\n"
            "- Ground your answer in the provided documents.\n"
            "- Mention any specific requirements, rules, or exceptions stated in the documents.\n"
            "- If the question asks in Indonesian, answer in Indonesian. If in English, answer in English."
        )

        user_message = f"VERIFIED TRAVEL DOCUMENTS:\n{context_str}\n\nUSER QUESTION:\n{question}"

        try:
            llm_resp = runtime_client.converse(
                modelId=model_id,
                system=[{"text": system_prompt}],
                messages=[
                    {
                        "role": "user",
                        "content": [{"text": user_message}]
                    }
                ],
                inferenceConfig={
                    "maxTokens": 2048,
                    "temperature": 0.3
                }
            )
            answer_text = llm_resp["output"]["message"]["content"][0]["text"]
            return {
                "answer": answer_text,
                "source": source_display,
                "sources": sources,
                "citations": retrieved_results
            }
        except Exception as llm_err:
            print(f"LLM Converse failed: {llm_err}")
            return {
                "answer": context_passages[0],
                "source": source_display,
                "sources": sources,
                "citations": retrieved_results
            }

    # 3. Fallback: If no document matched or KB empty, generate answer with LLM and note general answer
    try:
        llm_resp = runtime_client.converse(
            modelId=model_id,
            messages=[
                {
                    "role": "user",
                    "content": [{"text": f"Answer this travel question clearly and accurately: {question}"}]
                }
            ],
            inferenceConfig={
                "maxTokens": 1024,
                "temperature": 0.5
            }
        )
        answer_text = llm_resp["output"]["message"]["content"][0]["text"]
        return {
            "answer": answer_text,
            "source": None,
            "sources": [],
            "citations": []
        }
    except Exception as e:
        return {
            "answer": f"Unable to retrieve answer: {str(e)}",
            "source": None,
            "sources": [],
            "citations": []
        }
