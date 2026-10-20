import random
from datetime import datetime, timezone

from analyzer import analyze
from duplicate_detector import is_duplicate
from classifier import load_keywords, load_severity_words
from location import load_cities
from send_report import fetch_existing_reports, build_payload, ANALYZE_URL
import requests

CITY_HASHTAGS = {
    "Mumbai": "#MumbaiRains",
    "Delhi": "#DelhiWeather",
    "Chennai": "#ChennaiRains",
    "Kolkata": "#KolkataWeather",
    "Hyderabad": "#HyderabadRains",
    "Bengaluru": "#BengaluruWeather",
    "Jaipur": "#JaipurWeather",
    "Lucknow": "#LucknowWeather",
    "Visakhapatnam": "#VizagWeather",
}

TEMPLATES = {
    "flood": [
        "Streets flooded near {city} again 😩 roads submerged, please avoid the area {tag} #IMD",
        "Water entering homes in {city}, families stranded {tag} #IMD #FloodAlert",
    ],
    "rainfall": [
        "Heavy rain non-stop in {city} since morning ☔ {tag} #IMD",
        "{city} getting drenched right now, traffic slow {tag} #IMD",
    ],
    "thunderstorm": [
        "Lightning and thunder lighting up the sky over {city} ⚡ {tag} #IMD",
        "Loud thunderstorm just hit {city}, stay safe everyone {tag} #IMD",
    ],
    "heatwave": [
        "Can't survive this heat in {city} 🥵 unbearable, stay hydrated {tag} #IMD #Heatwave",
        "{city} sweltering today, extreme heat warning issued {tag} #IMD",
    ],
    "fog": [
        "Zero visibility in {city} this morning, cars crawling {tag} #IMD #Fog",
        "Dense fog over {city}, flights delayed at the airport {tag} #IMD",
    ],
    "dust_storm": [
        "Dust storm rolling into {city}, sky turned orange 😷 {tag} #IMD",
        "Visibility low due to dust in {city}, close your windows {tag} #IMD",
    ],
    "strong_wind": [
        "Strong winds knocking things over in {city}, trees uprooted {tag} #IMD",
        "Gusty winds in {city} right now, hoardings blown off {tag} #IMD",
    ],
}


def generate_post(city, event_type):
    tag = CITY_HASHTAGS.get(city, f"#{city.replace(' ', '')}Weather")
    template = random.choice(TEMPLATES[event_type])
    return template.format(city=city, tag=tag)


def run_simulation():
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    posts_to_generate = [
        ("Mumbai", "flood"),
        ("Delhi", "heatwave"),
        ("Chennai", "rainfall"),
        ("Kolkata", "thunderstorm"),
        ("Jaipur", "dust_storm"),
        ("Lucknow", "fog"),
        ("Bengaluru", "strong_wind"),
        ("Visakhapatnam", "strong_wind"),
    ]

    for city, event_type in posts_to_generate:
        text = generate_post(city, event_type)
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
            print(f"Skipped ({city}) — duplicate of an existing report.")
            continue

        payload = build_payload(result)
        payload["source"] = "Simulated-Social"
        response = requests.post(ANALYZE_URL, json=payload)
        print(f"{city} | {response.status_code} | {text}")


if __name__ == "__main__":
    run_simulation()