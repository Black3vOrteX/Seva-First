import os
import requests
from dotenv import load_dotenv

from analyzer import analyze
from duplicate_detector import is_duplicate
from classifier import load_keywords, load_severity_words
from location import load_cities
from send_report import fetch_existing_reports, build_payload, ANALYZE_URL

from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")
API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

CITIES = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Jaipur", "Bengaluru", "Hyderabad", "Lucknow"]

def get_live_weather(city):
    """Fetch current real weather for a city from OpenWeatherMap."""
    params = {"q": city, "appid": API_KEY, "units": "metric"}
    response = requests.get(WEATHER_URL, params=params)
    if response.status_code != 200:
        print(f"  → API error for {city}: {response.status_code} {response.text}")
        return None
    data = response.json()
    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"],
    }


def weather_to_report_text(weather):
    """Turn a real live weather reading into a citizen-report-style sentence."""
    city = weather["city"]
    temp = weather["temperature"]
    condition = weather["condition"].lower()
    description = weather["description"]
    wind = weather["wind_speed"]

    if temp >= 40:
        return f"Extreme heat in {city}, temperature crossed {temp:.0f} degrees, sweltering conditions."
    if "rain" in condition:
        return f"Heavy rain reported in {city}, {description}, roads getting wet."
    if "thunderstorm" in condition:
        return f"Thunderstorm over {city}, {description}, lightning seen in the sky."
    if "fog" in condition or "mist" in condition or "haze" in condition:
        return f"Dense fog in {city}, {description}, low visibility on the roads."
    if wind >= 10:
        return f"Strong winds in {city}, wind speed around {wind:.0f} m/s, {description}."
    return f"Weather update for {city}: {description}, temperature {temp:.0f} degrees."


def run_live_feed():
    keywords = load_keywords()
    severity_words = load_severity_words()
    cities = load_cities()

    for city in CITIES:
        weather = get_live_weather(city)
        if weather is None:
            print(f"Skipped {city} — could not fetch live weather.")
            continue

        text = weather_to_report_text(weather)
        result = analyze(text, keywords, severity_words, cities)

        new_report = {
            "event_type": result["event_type"],
            "city": result["city"],
            "text": result["text"],
        }
        from datetime import datetime, timezone
        new_report["created_at"] = datetime.now(timezone.utc).replace(tzinfo=None)

        existing_reports = fetch_existing_reports()
        match = is_duplicate(new_report, existing_reports)

        if match:
            print(f"Skipped {city} — duplicate of an existing report.")
            continue

        payload = build_payload(result)
        response = requests.post(ANALYZE_URL, json=payload)
        print(city, "|", response.status_code, "|", text)


if __name__ == "__main__":
    run_live_feed()