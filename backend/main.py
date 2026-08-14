from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import calculate_daily_budget, get_trip_category

app = FastAPI()

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float

@app.get("/")
def read_root():
    return {"message": "Welcome to KelanaAI"}

@app.get("/health")
def health_check():
    return {"status": "OK"}

@app.post("/api/v1/trips")
def create_trip(trip_request: TripRequest):
    daily_budget = calculate_daily_budget(trip_request.budget, trip_request.days)
    category = get_trip_category(trip_request.budget)
    
    return {
        "destination": trip_request.destination,
        "days": trip_request.days,
        "budget": trip_request.budget,
        "daily_budget": daily_budget,
        "category": category
    }
