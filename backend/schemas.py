from pydantic import BaseModel
from typing import Optional
from datetime import datetime 


class WeatherEventCreate(BaseModel):
    event_type: str
    description: Optional[str] = None

    city: str
    state: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    photo_url: Optional[str] = None
    video_url: Optional[str] = None

    severity: str
    confidence: Optional[float] = None
    source: str

    event_date: Optional[datetime] = None

# AI <-> Backend

class AnalysisResult(BaseModel):
    report_text: str
    event_type: str

    city: str
    state: Optional[str] = None

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    photo_url: Optional[str] = None
    video_url: Optional[str] = None

    severity: str
    confidence: float
    source: str = "AI"

    event_date: Optional[datetime] = None




class EventStatusUpdate(BaseModel):
      status: str


class TextReportCreate(BaseModel):
    text: str
    