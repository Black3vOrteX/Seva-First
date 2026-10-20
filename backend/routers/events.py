from unittest import result

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import WeatherEvent
from schemas import TextReportCreate, WeatherEventCreate, AnalysisResult, EventStatusUpdate 

from datetime import datetime

import sys
from pathlib import Path

AI_PATH = Path(__file__).resolve().parents[2] / "ai"
sys.path.append(str(AI_PATH))

from analyzer import analyze
from classifier import load_keywords, load_severity_words
from location import load_cities

from duplicate_detector import is_duplicate


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("/")
def create_event(
    event: WeatherEventCreate,
    db: Session = Depends(get_db)
):
    new_event = WeatherEvent(
        event_type=event.event_type,
        description=event.description,
        city=event.city,
        state=event.state,

        latitude=event.latitude,
        longitude=event.longitude,

        photo_url=event.photo_url,
        video_url=event.video_url,

        severity=event.severity,
        confidence=event.confidence,
        source=event.source,
        event_date=event.event_date
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


# Event Status Update

@router.put("/{event_id}/status")
def update_event_status(
    event_id: int,
    status_update: EventStatusUpdate,
    db: Session = Depends(get_db)
):
    event = db.query(WeatherEvent).filter(
        WeatherEvent.id == event_id
    ).first()

    if not event:
        return {"error": "Event not found"}

    event.status = status_update.status.upper()

    db.commit()
    db.refresh(event)

    return {
        "message": "Event status updated successfully",
        "event": event
    }


# @router.get("/")
# def get_events(db: Session = Depends(get_db)):
#     events = db.query(WeatherEvent).all()
#     return events



# S6. Event Filtering

@router.get("/")
def get_events(
    event_type: str = None,
    severity: str = None,
    city: str = None,
    state: str = None,
    status: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    query = db.query(WeatherEvent)

    if event_type:
        query = query.filter(
            WeatherEvent.event_type.ilike(event_type)
        )

    if severity:
        query = query.filter(
            WeatherEvent.severity.ilike(severity)
        )

    if city:
        query = query.filter(
            WeatherEvent.city.ilike(f"%{city}%")
        )

    if state:
        query = query.filter(
            WeatherEvent.state.ilike(f"%{state}%")
        )

    if status:
        query = query.filter(
            WeatherEvent.status.ilike(status)
        )

    if start_date:
        query = query.filter(
            WeatherEvent.event_date >= start_date
        )

    if end_date:
        query = query.filter(
            WeatherEvent.event_date <= end_date
        )

    return query.all()


#Statistics API

@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db)):
    events = db.query(WeatherEvent).all()

    total_events = len(events)

    floods = sum(
        1 for event in events
        if event.event_type.lower() == "flood"
    )

    heavy_rain = sum(
        1 for event in events
        if event.event_type.lower() in ["heavy rain", "rainfall", "rain"]
    )

    heatwaves = sum(
        1 for event in events
        if event.event_type.lower() == "heatwave"
    )

    high_severity = sum(
        1 for event in events
        if event.severity.lower() == "high"
    )

    verified = sum(
    1 for event in events
    if event.status.lower() == "verified"
    )

    active = sum(
    1 for event in events
    if event.status.lower() in ["pending", "verified", "active"]
    )

    pending = sum(
    1
    for event in events
    if event.status.lower() == "pending"
    )

    resolved = sum(
    1 for event in events
    if event.status.lower() == "resolved"
    )

    return {
        "total_events": total_events,
        "floods": floods,
        "heavy_rain": heavy_rain,
        "heatwaves": heatwaves,
        "high_severity": high_severity,
        "active": active,
        "pending": pending,
        "resolved": resolved
}


# Backend <-> Ai integration

@router.post("/analyze-result")
def save_analysis_result(
    result: AnalysisResult,
    db: Session = Depends(get_db)
):
    new_event = WeatherEvent(
    event_type=result.event_type,
    description=result.report_text,

    city=result.city,
    state=result.state,

    latitude=result.latitude,
    longitude=result.longitude,

    photo_url=result.photo_url,
    video_url=result.video_url,

    severity=result.severity,
    confidence=result.confidence,
    source=result.source,

    event_date=result.event_date
    )
    

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "AI analysis saved successfully",
        "event": new_event
    }


#End point - (Submitted successfully)

@router.post("/report")
def submit_report(
    event: WeatherEventCreate,
    db: Session = Depends(get_db)
):
    new_event = WeatherEvent(
        event_type=event.event_type,
        description=event.description,

        city=event.city,
        state=event.state,

        latitude=event.latitude,
        longitude=event.longitude,

        photo_url=event.photo_url,
        video_url=event.video_url,

        severity=event.severity,
        confidence=event.confidence,
        source=event.source,

        event_date=event.event_date
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "Weather report submitted successfully",
        "event": new_event
    }


# Backend endpoint to add text only

@router.post("/submit-text")
def submit_text_report(
    report: TextReportCreate,
    db: Session = Depends(get_db)
):
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    # AI analysis
    result = analyze(
        report.text,
        keywords,
        severity_words,
        cities
    )

    # Reject reports that cannot be confidently classified
    if result["event_type"] == "other" and result["confidence"] <= 0.2:
        return {
            "message": "Could not confidently classify this report",
            "duplicate": False
        }

    # Prepare report for duplicate checking
    new_report = {
        "event_type": result["event_type"],
        "city": result["city"],
        "text": result["text"],
        "created_at": datetime.utcnow()
    }

    # Get existing reports
    existing_events = db.query(WeatherEvent).all()

    candidates = []

    for event in existing_events:
        candidates.append({
            "event_type": event.event_type,
            "city": event.city,
            "text": event.description,
            "created_at": event.created_at
        })

    # Check duplicate
    duplicate = is_duplicate(
        new_report,
        candidates
    )

    if duplicate:
        return {
            "message": "Duplicate report detected",
            "duplicate": True
        }

    # IMPORTANT:
    # This endpoint only analyzes the report.
    # It does NOT save anything to the database.

    return {
        "message": "Report analyzed successfully",
        "duplicate": False,
        "analysis": {
            "event_type": result["event_type"],
            "description": result["text"],
            "city": result["city"],
            "state": result["state"],
            "latitude": result["lat"],
            "longitude": result["lon"],
            "severity": result["severity"],
            "confidence": result["confidence"]
        }
    }



# Event retrieval by ID

@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(WeatherEvent).filter(
        WeatherEvent.id == event_id
    ).first()

    if not event:
        return {
            "error": "Event not found"
        }

    return event