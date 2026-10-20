from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from models import WeatherEvent
from weather_service import get_weather
from routers.events import router as events_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Mausam Intelligence API",
    description="National Weather Big Data Analytics Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events_router)


@app.get("/")
def home():
    return {
        "message": "Mausam Intelligence API is running!",
        "status": "success"
    }

@app.get("/weather-multiple")
def weather_multiple():
    cities = [
        "Visakhapatnam",
        "Itanagar",
        "Guwahati",
        "Patna",
        "Raipur",
        "Panaji",
        "Shimla",
        "Ahmedabad",
        "Gurugram",
        "Ranchi",
        "Thiruvananthapuram",
        "Indore",
        "Imphal",
        "Shillong",
        "Aizawl",
        "Kohima",
        "Bhubaneswar",
        "Ludhuana",
        "Jaipur",
        "Gangtok",
        "Hyderabad",
        "Chennai",
        "Agartala",
        "Lucknow",
        "Dehradun",
        "Bengaluru",
        "Mumbai",
        "Delhi",
        "Kolkata",
        "Kochi",
        "Bhopal",
        "Srinagar",
        "Leh",
        "Pondicherry",
    ]


    results = []

    for city in cities:
        weather_data = get_weather(city)

        if "error" not in weather_data:
            results.append(weather_data)

    return results
@app.get("/weather/{city}")
def weather(city: str):
    return get_weather(city)