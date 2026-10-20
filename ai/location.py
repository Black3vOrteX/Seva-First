import csv
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


def load_cities():
    """Read cities.csv and return it as a list of location records."""
    cities = []
    with open(DATA_DIR / "cities.csv", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            aliases = [a.strip() for a in row["aliases"].split(";") if a.strip()]
            cities.append({
                "name": row["name"].strip(),
                "type": row["type"].strip(),
                "city": row["city"].strip(),
                "state": row["state"].strip(),
                "lat": float(row["lat"]),
                "lon": float(row["lon"]),
                "aliases": aliases,
            })
    return cities


def find_word(text, word):
    """Return the start index of word as a whole word in text, or -1 if absent."""
    match = re.search(r"\b" + re.escape(word.lower()) + r"\b", text)
    return match.start() if match else -1


def find_location(text, cities):
    """
    Find the location mentioned in text.

    Areas always win over cities, even if the city name appears earlier
    in the text. Within the same type, the earliest match in the text wins.
    """
    text = text.lower()
    area_matches = []
    city_matches = []

    for record in cities:
        variants = [record["name"]] + record["aliases"]
        best_position = -1
        for variant in variants:
            position = find_word(text, variant)
            if position != -1 and (best_position == -1 or position < best_position):
                best_position = position
        if best_position == -1:
            continue
        match_info = {**record, "position": best_position}
        if record["type"] == "area":
            area_matches.append(match_info)
        else:
            city_matches.append(match_info)

    if area_matches:
        best = min(area_matches, key=lambda m: m["position"])
    elif city_matches:
        best = min(city_matches, key=lambda m: m["position"])
    else:
        return {
            "matched_name": None,
            "type": "unknown",
            "city": None,
            "state": None,
            "lat": None,
            "lon": None,
        }

    return {
        "matched_name": best["name"],
        "type": best["type"],
        "city": best["city"],
        "state": best["state"],
        "lat": best["lat"],
        "lon": best["lon"],
    }


if __name__ == "__main__":
    cities = load_cities()
    tests = [
        "Heavy flooding reported in Andheri, Mumbai is badly hit.",
        "Vizag hit by cyclonic winds today.",
        "New Delhi records extreme heat this week.",
        "Bombay traffic disrupted due to waterlogging.",
        "Random report with no known location mentioned.",
    ]
    
    for text in tests:
        result = find_location(text, cities)
        print(result["matched_name"], "|", result["city"], result["state"], "|", text)