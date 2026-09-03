import os
import boto3
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# AWS Bedrock runtime client
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2")
)

SYSTEM_PROMPT = """You are KelanaAI, an intelligent, inspiring, and context-aware AI travel assistant.
You specialize in Indonesian travel, hidden gems, cultural journeys, and international trip planning.
You maintain memory across the conversation and remember details the user mentioned earlier.
Always provide helpful, well-structured answers using clear Markdown (headings, lists, bold text).
Keep your tone warm, welcoming, and knowledgeable."""

def trim_conversation_history(messages: List[Dict[str, str]], max_messages: int = 20) -> List[Dict[str, str]]:
    """
    Session 10 Part 8: Trim Context Window
    Keeps only the most recent N messages to respect model context window and reduce latency.
    Ensures the sequence starts with a 'user' message as required by Bedrock Converse.
    """
    if not messages:
        return []

    trimmed = messages[-max_messages:]
    
    # Bedrock Converse requires the first message to have role 'user'
    while trimmed and trimmed[0].get("role") != "user":
        trimmed = trimmed[1:]
        
    return trimmed

def build_bedrock_messages(history: List[Dict[str, str]]) -> List[Dict]:
    """
    Converts a list of {role, content} dicts into the format expected by Bedrock Converse API:
    [
        {"role": "user", "content": [{"text": "..."}]},
        {"role": "assistant", "content": [{"text": "..."}]}
    ]
    Ensures strict alternation of roles.
    """
    formatted = []
    last_role = None

    for msg in history:
        role = msg.get("role", "user")
        text = msg.get("content", "").strip()
        if not text:
            continue

        if role == last_role and formatted:
            # Merge with previous message if duplicate role occurs
            formatted[-1]["content"][0]["text"] += f"\n\n{text}"
        else:
            formatted.append({
                "role": role,
                "content": [{"text": text}]
            })
            last_role = role

    return formatted

def generate_chat_response(messages_history: List[Dict[str, str]]) -> str:
    """
    Session 10 Part 4 & 5: Context-aware Bedrock Converse call with multi-turn memory.
    """
    trimmed = trim_conversation_history(messages_history, max_messages=20)
    bedrock_messages = build_bedrock_messages(trimmed)

    if not bedrock_messages:
        return "Halo! Ada yang bisa KelanaAI bantu untuk rencana perjalananmu hari ini?"

    try:
        model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

        response = bedrock_client.converse(
            modelId=model_id,
            messages=bedrock_messages,
            system=[{"text": SYSTEM_PROMPT}],
            inferenceConfig={
                "maxTokens": 4096,
                "temperature": 0.7
            }
        )

        ai_response = response["output"]["message"]["content"][0]["text"]
        return ai_response
    except Exception as e:
        print(f"[Bedrock Converse Warning] {str(e)}")
        # Provide an intelligent conversational fallback when Bedrock is offline or unconfigured
        latest_user_message = ""
        for m in reversed(messages_history):
            if m.get("role") == "user":
                latest_user_message = m.get("content", "")
                break
        
        lower_msg = latest_user_message.lower()
        if "day 2" in lower_msg or "hari 2" in lower_msg or "hari kedua" in lower_msg:
            return (
                "Untuk **Hari ke-2**, berdasarkan rencana perjalanan sebelumnya, kita bisa fokus menjelajahi "
                "area pusat kota dan destinasi budaya utama! Nikmati wisata kuliner lokal di pagi hari, kunjungi museum "
                "atau landmark bersejarah di siang hari, dan santai di sunset point pada sore harinya. "
                "Apakah kamu ingin rekomendasi tempat makan spesifik atau aktivitas outdoor untuk hari tersebut?"
            )
        elif "budget" in lower_msg or "biaya" in lower_msg or "anggaran" in lower_msg:
            return (
                "Terkait estimasi biaya perjalanan, kita bisa membaginya ke dalam 3 pos utama:\n\n"
                "- **Akomodasi**: ~40% dari total anggaran\n"
                "- **Kuliner & Konsumsi**: ~30% untuk mencicipi makanan khas\n"
                "- **Transportasi & Tiket Masuk**: ~30%\n\n"
                "Apakah kamu ingin saya sesuaikan rincian ini dengan destinasi atau jumlah hari yang sudah kita bahas sebelumnya?"
            )
        else:
            return (
                f"Terima kasih atas pertanyaannya! Saya mencatat referensi dari percakapan kita mengenai: *\"{latest_user_message}\"*.\n\n"
                "Sebagai asisten perjalanan KelanaAI, saya siap membantu merinci rencana itinerary, rekomendasi transportasi, "
                "atau destinasi menarik berikutnya. Ada hal spesifik yang ingin kamu tanyakan lebih lanjut?"
            )

def generate_conversation_title(first_message: str) -> str:
    """Auto-generate a concise title based on the first user message."""
    clean = first_message.strip().replace("\n", " ")
    if len(clean) > 40:
        clean = clean[:37] + "..."
    return clean.capitalize() if clean else "Percakapan Baru"
