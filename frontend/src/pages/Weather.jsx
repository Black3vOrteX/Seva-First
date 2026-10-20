import WeatherCard from "../components/WeatherCard";

function Weather() {
  return (
    <div className="weather-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WEATHER INTELLIGENCE</span>
          <h1>Weather Forecast</h1>
          <p>
            Current weather conditions for your area.
          </p>
        </div>
      </div>

      <WeatherCard />

      <div className="weather-info-grid">
        <div className="weather-info-card">
          <h3>🌧️ Precipitation</h3>
          <p>
            Weather conditions are continuously monitored for
            potential rainfall and extreme-weather events.
          </p>
        </div>

        <div className="weather-info-card">
          <h3>💨 Wind Conditions</h3>
          <p>
            Wind speed and atmospheric pressure are included
            in the current weather analysis.
          </p>
        </div>

        <div className="weather-info-card">
          <h3>⚠️ Disaster Awareness</h3>
          <p>
            Community reports and weather information work
            together to support local situational awareness.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Weather;