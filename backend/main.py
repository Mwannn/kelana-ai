from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import init_db, get_db
from models.trip import Trip
from schemas.trip_schema import TripCreate, TripResponse, TripGenerateRequest
from services.trip_service import calculate_daily_budget, get_trip_category
from services.bedrock_service import generate_itinerary

app = FastAPI(title="KelanaAI API")

# Initialize database tables
init_db()

# Configure CORS for Next.js frontend (Session 6)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to KelanaAI Stateful API"}

@app.get("/health")
def health_check():
    return {"status": "OK"}

# --------------------------------------------------------
# CRUD Endpoints (Session 4)
# --------------------------------------------------------

@app.post("/api/v1/trips", response_model=TripResponse)
def create_trip(trip_request: TripCreate, db: Session = Depends(get_db)):
    # reuse Session 2 business logic
    daily_budget = calculate_daily_budget(trip_request.budget, trip_request.days)
    category = get_trip_category(trip_request.budget, trip_request.currency)
    
    # create a Trip ORM object
    trip = Trip(
        destination=trip_request.destination,
        days=trip_request.days,
        budget=trip_request.budget,
        currency=trip_request.currency,
        category=category,
        daily_budget=daily_budget,
    )
    
    # save to PostgreSQL
    db.add(trip)
    db.commit()
    db.refresh(trip) # get the auto-generated id
    return trip

@app.get("/api/v1/trips", response_model=List[TripResponse])
def list_trips(db: Session = Depends(get_db)):
    trips = db.query(Trip).all()
    return trips

@app.get("/api/v1/trips/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
    return trip

@app.put("/api/v1/trips/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: int, trip_update: TripCreate, db: Session = Depends(get_db)):
    """Update budget and recalculate category + daily_budget before saving."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
        
    # Recalculate
    daily_budget = calculate_daily_budget(trip_update.budget, trip_update.days)
    category = get_trip_category(trip_update.budget, trip_update.currency)
    
    # Update fields
    trip.destination = trip_update.destination
    trip.days = trip_update.days
    trip.budget = trip_update.budget
    trip.currency = trip_update.currency
    trip.category = category
    trip.daily_budget = daily_budget
    
    db.commit()
    db.refresh(trip)
    return trip

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Remove a trip by ID. Return 404 if not found."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
        
    db.delete(trip)
    db.commit()
    return {"message": f"Trip {trip_id} successfully deleted"}

# --------------------------------------------------------
# AI Generation Endpoint (Session 5)
# --------------------------------------------------------

@app.post("/api/v1/trips/{trip_id}/generate", response_model=TripResponse)
def generate_trip_recommendation(trip_id: int, req: TripGenerateRequest, db: Session = Depends(get_db)):
    """Triggers AI generation for an existing trip."""
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")
        
    # Generate Prompt & Call Bedrock
    ai_response = generate_itinerary(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        travel_style=req.travel_style,
        language=req.language,
        currency=trip.currency
    )
    
    # Save Recommendation
    trip.ai_recommendation = ai_response
    db.commit()
    db.refresh(trip)
    
    return trip
