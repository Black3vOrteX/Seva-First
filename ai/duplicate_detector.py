import re
from datetime import timedelta

TIME_WINDOW_MINUTES = 60
SIMILARITY_THRESHOLD = 0.45


def text_similarity(text_a, text_b):
    """Return a 0-1 similarity score based on shared words between two texts."""
    words_a = set(re.findall(r"\w+", text_a.lower()))
    words_b = set(re.findall(r"\w+", text_b.lower()))
    if not words_a or not words_b:
        return 0.0
    shared = words_a & words_b
    total = words_a | words_b
    return len(shared) / len(total)


def is_duplicate(new_report, candidates, time_window_minutes=TIME_WINDOW_MINUTES,
                  similarity_threshold=SIMILARITY_THRESHOLD):
    """
    Check whether new_report duplicates any report in candidates.

    new_report: dict with at least "event_type", "location", "text", "created_at"
    candidates: list of dicts/objects with the same fields, e.g. recent reports
                for the same city already fetched from the DB by the caller.

    Returns the matching candidate if a duplicate is found, else None.
    """
    for candidate in candidates:
        if candidate["event_type"] != new_report["event_type"]:
            continue
        if candidate["city"] != new_report["city"]:
            continue

        time_diff = abs(new_report["created_at"] - candidate["created_at"])
        if time_diff > timedelta(minutes=time_window_minutes):
            continue

        similarity = text_similarity(new_report["text"], candidate["text"])
        if similarity >= similarity_threshold:
            return candidate

    return None


if __name__ == "__main__":
    from datetime import datetime

    base_time = datetime(2026, 9, 19, 10, 0, 0)

    existing_reports = [
        {
            "event_type": "flood",
            "city": "Mumbai",
            "text": "Heavy flooding in Mumbai, water entering homes.",
            "created_at": base_time,
        },
        {
            "event_type": "heatwave",
            "city": "Delhi",
            "text": "Extreme heat recorded in Delhi today.",
            "created_at": base_time,
        },
    ]

    tests = [
        {
            "event_type": "flood",
            "city": "Mumbai",
            "text": "Flooding reported in Mumbai, homes flooded with water.",
            "created_at": base_time + timedelta(minutes=20),
        },
        {
            "event_type": "flood",
            "city": "Mumbai",
            "text": "Flooding reported in Mumbai, homes flooded with water.",
            "created_at": base_time + timedelta(minutes=90),
        },
        {
            "event_type": "heatwave",
            "city": "Chennai",
            "text": "Scorching heat in Chennai this afternoon.",
            "created_at": base_time,
        },
    ]

    for report in tests:
        match = is_duplicate(report, existing_reports)
        print("DUPLICATE" if match else "UNIQUE", "|", report["text"])