import {
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/weather/Visakhapatnam"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch weather");
        }

        const data = await response.json();

        setWeather(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="weather-card weather-loading">
        <Loader2 className="loading-spinner" size={28} />

        <span>Loading live weather...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card weather-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="weather-card">

      <div className="weather-location">
        <MapPin size={16} />

        <span>
          {weather.city}, Andhra Pradesh
        </span>
      </div>

      <div className="weather-main">

        <div className="weather-icon">
          <CloudRain size={58} />
        </div>

        <div>
          <div className="temperature">
            {Math.round(weather.temperature)}°
          </div>

          <div className="weather-condition">
            {weather.condition}
          </div>

          <div className="weather-feels">
            {weather.description}
            {" • "}
            Feels like {Math.round(weather.feels_like)}°C
          </div>
        </div>

      </div>

      <div className="weather-details">

        <div className="weather-stat">
          <Droplets size={18} />

          <div>
            <span>Humidity</span>
            <strong>{weather.humidity}%</strong>
          </div>
        </div>

        <div className="weather-stat">
          <Wind size={18} />

          <div>
            <span>Wind</span>
            <strong>{weather.wind_speed} m/s</strong>
          </div>
        </div>

        <div className="weather-stat">
          <Thermometer size={18} />

          <div>
            <span>Pressure</span>
            <strong>{weather.pressure} hPa</strong>
          </div>
        </div>

      </div>

    </div>
  );
}

export default WeatherCard;