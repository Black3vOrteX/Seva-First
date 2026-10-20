import requests
from datetime import datetime, timezone
from analyzer import analyze
from duplicate_detector import is_duplicate
from classifier import load_keywords, load_severity_words
from location import load_cities

BASE_URL = "http://127.0.0.1:8000"
EVENTS_URL = f"{BASE_URL}/events/"
ANALYZE_URL = f"{BASE_URL}/events/analyze-result"


def fetch_existing_reports():
    """Get all stored events and reshape them to match what is_duplicate expects."""
    response = requests.get(EVENTS_URL)
    response.raise_for_status()
    events = response.json()

    reshaped = []
    for event in events:
        reshaped.append({
            "event_type": event["event_type"],
            "city": event["city"],
            "text": event["description"],
            "created_at": datetime.fromisoformat(event["created_at"]),
        })
    return reshaped


def build_payload(result):
    """Translate analyzer.py's output into the shape AnalysisResult expects."""
    return {
        "report_text": result["text"],
        "event_type": result["event_type"],
        "city": result["city"],
        "state": result["state"],
        "latitude": result["lat"],
        "longitude": result["lon"],
        "photo_url": None,
        "video_url": None,
        "severity": result["severity"].capitalize(),
        "confidence": round(result["confidence"] * 100),
        "source": "AI",
    }


def send_report(text, keywords, severity_words, cities):
    """Run the pipeline, check for duplicates, and send only if it's new."""
    result = analyze(text, keywords, severity_words, cities)

    new_report = {
        "event_type": result["event_type"],
        "city": result["city"],
        "text": result["text"],
        "created_at": datetime.now(timezone.utc).replace(tzinfo=None),
    }

    existing_reports = fetch_existing_reports()
    match = is_duplicate(new_report, existing_reports)

    if match:
        print("Skipped — duplicate of an existing report.")
        return None

    payload = build_payload(result)
    response = requests.post(ANALYZE_URL, json=payload)
    return response


if __name__ == "__main__":
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    test_text = "Dense fog reported in Lucknow this morning, flights delayed due to low visibility."
    response = send_report(test_text, keywords, severity_words, cities)

    if response is not None:
        print(response.status_code)
        print(response.json())