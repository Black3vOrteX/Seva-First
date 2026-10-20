import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

NEGATORS = {"no", "not", "without"}

# Tie-break order, highest priority first
PRIORITY = ["flood", "thunderstorm", "strong_wind", "dust_storm", "fog", "heatwave", "rainfall"]


def load_keywords():
    """Read event_keywords.json and return it as a dictionary."""
    with open(DATA_DIR / "event_keywords.json", encoding="utf-8") as f:
        return json.load(f)


def load_severity_words():
    """Read severity_words.json and return it as a dictionary."""
    with open(DATA_DIR / "severity_words.json", encoding="utf-8") as f:
        return json.load(f)


def is_negated(text, word):
    """True if the word is directly preceded by no / not / without."""
    position = text.find(word)
    words_before = text[:position].split()
    return bool(words_before) and words_before[-1] in NEGATORS


def count_matches(text, keywords):
    """Count how many keywords from each event appear in the text."""
    text = text.lower()
    scores = {}
    for event, words in keywords.items():
        scores[event] = sum(
            1 for word in words if word in text and not is_negated(text, word)
        )
    return scores


def pick_event(scores):
    """Return the winning event type, or 'other' if nothing matched."""
    best = max(scores.values())
    if best == 0:
        return "other"
    tied = [event for event, score in scores.items() if score == best]
    for event in PRIORITY:
        if event in tied:
            return event
    return tied[0]


def calculate_confidence(scores):
    """How sure we are, from 0 to 1, based on the evidence."""
    best = max(scores.values())
    if best == 0:
        return 0.2
    if best == 1:
        confidence = 0.55
    elif best == 2:
        confidence = 0.75
    else:
        confidence = 0.9
    tied_count = sum(1 for score in scores.values() if score == best)
    if tied_count > 1:
        confidence -= 0.15
    return round(confidence, 2)


def has_word(text, word):
    """True if the word appears as a whole word and is not negated."""
    match = re.search(r"\b" + re.escape(word) + r"\b", text)
    if not match:
        return False
    words_before = text[:match.start()].split()
    return not (words_before and words_before[-1] in NEGATORS)


def calculate_severity(text, severity_words):
    """Return 'high', 'low' or the default ('medium')."""
    text = text.lower()
    if any(has_word(text, word) for word in severity_words["high"]):
        return "high"
    if any(has_word(text, word) for word in severity_words["low"]):
        return "low"
    return severity_words["default"]


def classify(text, keywords, severity_words):
    """Return event type, confidence and severity for one report."""
    scores = count_matches(text, keywords)
    return {
        "event_type": pick_event(scores),
        "confidence": calculate_confidence(scores),
        "severity": calculate_severity(text, severity_words),
    }


if __name__ == "__main__":
    keywords = load_keywords()
    severity_words = load_severity_words()
    tests = [
        ("Very heavy rainfall in Kochi, orange alert issued by IMD.", "high"),
        ("Light drizzle in Pune this morning, traffic normal.", "low"),
        ("Heavy rain in Chennai since morning, schools declared holiday.", "medium"),
        ("Thunderstorm lashed Indore last night, lightning struck near the railway station.", "medium"),
        ("Gale-force winds in Visakhapatnam, trees uprooted and power cut.", "high"),
        ("Strong winds in Ludhiana this evening, minor branch damage.", "low"),
    ]
    for text, expected in tests:
        result = classify(text, keywords, severity_words)
        mark = "OK" if result["severity"] == expected else "WRONG"
        print(mark, result["event_type"], result["confidence"], result["severity"], "|", text)