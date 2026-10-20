from classifier import load_keywords, load_severity_words, classify
from location import load_cities, find_location


def analyze(text, keywords, severity_words, cities):
    """Run the full pipeline on one report: event, location, severity, confidence."""
    event_result = classify(text, keywords, severity_words)
    location_result = find_location(text, cities)
    return {
        "text": text,
        "event_type": event_result["event_type"],
        "confidence": event_result["confidence"],
        "severity": event_result["severity"],
        "location": location_result["matched_name"],
        "location_type": location_result["type"],
        "city": location_result["city"],
        "state": location_result["state"],
        "lat": location_result["lat"],
        "lon": location_result["lon"],
    }


if __name__ == "__main__":
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    tests = [
        "Heavy flooding reported in Andheri, Mumbai is badly hit, water entering homes.",
        "Vizag hit by cyclonic winds today, trees uprooted and power cut.",
        "Light drizzle in Pune this morning, traffic normal.",
        "Very heavy rainfall in Kochi, orange alert issued by IMD.",
        "Random report with no known location mentioned.",
    ]
    for text in tests:
        result = analyze(text, keywords, severity_words, cities)
        print(
            result["event_type"], "|",
            result["severity"], "|",
            result["confidence"], "|",
            result["location"], result["city"], result["state"], "|",
            result["text"],
        )