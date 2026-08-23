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

def generate_itinerary(destination: str, days: int, budget: float, travel_style: str, language: str = "English", currency: str = "USD") -> str:
    """Generate an AI itinerary using Amazon Bedrock Converse API."""
    
    # Session 5 & 6: Enhance prompt for richer AI output & Markdown format
    prompt = f"""
    You are an elite, highly experienced local travel expert and concierge.
    I need a highly detailed, extremely accurate, and realistic {days}-day itinerary for {destination}.
    My Budget: {currency} {budget} (please ensure recommendations align with this budget)
    My Travel Style: {travel_style}
    
    CRITICAL INSTRUCTION 1: You MUST write your entire response in the {language} language.
    CRITICAL INSTRUCTION 2: For EVERY SINGLE tourist attraction, hotel, and restaurant you recommend, you MUST provide its full address and a clickable Google Maps link. Format the link strictly like this: [📍 Google Maps](https://www.google.com/maps/search/?api=1&query=Insert+Location+Name+Here).
    CRITICAL INSTRUCTION 3: DO NOT write in short, robotic bullet points like "Tempat Makan: X". Write engaging, descriptive paragraphs for each activity. Tell a story about what makes the place special, what to order, and what to see. Make sure there is a line break before and after the Google Maps link so it is easy to read.
    
    Provide a deeply comprehensive and structured response formatted beautifully in Markdown. Your response must include:
    
    1. 📝 **Trip Overview**: A brief, inspiring summary of what to expect based on the {travel_style} style in {destination}.
    
    2. 🗓️ **Detailed Daily Itinerary**: For EACH day, break down the schedule thoroughly into beautifully written paragraphs:
       - **Morning**, **Afternoon**, and **Evening**. 
       - Instead of just listing a name, describe the experience vividly. What will they see? What should they order? Why is it amazing? Include realistic timings.
       - Include the exact address and the Google Maps link on a new line right below the name of the place.
       *Important: Make sure the pacing is realistic and geographically logical.*
       
    3. 🍜 **Culinary Guide**: Top local dishes to try and specific, highly-rated restaurants or street food stalls to find them in {destination}. Write descriptive paragraphs for each dish/restaurant. Include addresses and Google Maps links.
    
    4. 💡 **Essential Travel Tips**:
       - Cultural etiquette & local customs
       - Best ways to get around (public transit, apps, etc.)
       - Safety tips and tourist traps to avoid
       
    5. 💰 **Budget Breakdown**: A realistic breakdown of the {currency} {budget} covering Food, Transport, and Activities.
    
    Tone: Professional, highly descriptive, inspiring, and incredibly knowledgeable. Use Markdown headers (##, ###), bold text for emphasis, and emojis to make it engaging and easy to read.
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
