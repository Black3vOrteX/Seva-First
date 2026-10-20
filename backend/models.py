from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from database import Base


class WeatherEvent(Base):
    __tablename__ = "weather_events"

    id = Column(Integer, primary_key=True, index=True)

    # Event information
    event_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Location
    city = Column(String, nullable=False)
    state = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Evidence
    photo_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)

    # Analysis
    severity = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)

    # Source and verification
    source = Column(String, nullable=False)
    status = Column(String, nullable=False, default="PENDING")

    # Time
    event_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)