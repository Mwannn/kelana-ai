from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    daily_budget = Column(Float, nullable=False)
    
    # Session 5: store the AI-generated recommendation
    ai_recommendation = Column(Text, nullable=True)
    
    # Session 4 Bonus: automatically save created_at on every new trip
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
