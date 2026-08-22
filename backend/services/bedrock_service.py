import boto3
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Create the Bedrock Runtime client
# boto3 automatically authenticates using AWS_BEARER_TOKEN_BEDROCK or ~/.aws/credentials
client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2")
)

def generate_itinerary(destination: str, days: int, budget: float, travel_style: str) -> str:
    """Generate an AI itinerary using Amazon Bedrock Converse API."""
    
    # Session 5 & 6: Enhance prompt for richer AI output & Markdown format
    prompt = f"""
    You are an experienced travel planner.
    Create a {days}-day itinerary for {destination}.
    Budget: USD {budget}
    Travel Style: {travel_style}
    
    Please provide a structured response including:
    - Daily itinerary cards (one card per day)
    - Travel tips section
    - Local food recommendations
    - Estimated budget breakdown

    For each daily itinerary, you must strictly follow these requirements:
    - Morning activities: Provide exactly 2-3 specific morning activities.
    - Afternoon activities: Include recommendations for cultural sites and local experiences.
    - Evening activities: Suggest specific dinner spots and nightlife entertainment.
    
    Format your response as Markdown with headers (##) and bullet lists (-).
    """
    
    try:
        model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
        
        response = client.converse(
            modelId=model_id,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        )
        
        # Extract the AI response
        ai_response = response["output"]["message"]["content"][0]["text"]
        return ai_response
    except Exception as e:
        print(f"Error calling Amazon Bedrock: {str(e)}")
        # Fallback message if Bedrock fails or credentials not set
        return "Unable to generate itinerary at this time. Please make sure Bedrock credentials are correct."
