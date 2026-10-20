import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
const createSeverityIcon = (severity) => {
  const level = severity?.toLowerCase() || "medium";

  let color = "#f59e0b";

  if (level === "high") {
    color = "#ef4444";
  } else if (level === "low") {
    color = "#22c55e";
  }

  return L.divIcon({
    className: "severity-marker",
    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        "
      ></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
};
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function IncidentMap() {
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/events/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        const data = await response.json();

        setEvents(
          data.filter(
            (event) =>
              event.latitude !== null &&
              event.longitude !== null
          )
        );
      } catch (error) {
        console.error("Error fetching map incidents:", error);
      } finally {
        setLoading(false);
      }
    };

        fetchEvents();

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/weather-multiple"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }

        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching map weather:", error);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="map-loading">
        <Loader2 className="loading-spinner" size={28} />
        <span>Loading incident map...</span>
      </div>
    );
  }

  return (
    <div className="incident-map-page">

      <div className="page-heading">
        <div>
          <span className="eyebrow">GEOSPATIAL INTELLIGENCE</span>
          <h1>Incident Map</h1>
          <p>
            View reported weather incidents using their GPS locations.
          </p>
        </div>
      </div>

      <div className="map-card">

        <MapContainer
          center={[17.6868, 83.2185]}
          zoom={11}
          scrollWheelZoom={true}
          className="incident-map"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


{Array.isArray(weather) &&
  weather.map((item) => (
    <Marker
      key={`weather-${item.city}`}
      position={[item.latitude, item.longitude]}
      icon={L.divIcon({
        className: "",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-size: 17px;
          ">☁️</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      })}
    >
      <Popup>
        <div className="map-popup">
          <h3>🌦️ Live Weather</h3>

          <div className="map-popup-info">
            <span>📍 {item.city}</span>
            <span>🌡️ Temperature: {Math.round(item.temperature)}°C</span>
            <span>💧 Humidity: {item.humidity}%</span>
            <span>💨 Wind: {item.wind_speed} m/s</span>
            <span>🌧️ Condition: {item.description}</span>
            <span>🔵 Source: WEATHER API</span>
          </div>
        </div>
      </Popup>
    </Marker>
  ))}
          {events.map((event) => (
            <Marker
              key={event.id}
              position={[
                event.latitude,
                event.longitude,
          ]}
  icon={createSeverityIcon(event.severity)}
>
              <Popup>
                  <div className="map-popup">
                    <h3>{event.event_type}</h3>

                <p>
                  {event.description || "No description provided."}
                </p>

                <div className="map-popup-info">
                 <span>
                    📍 {event.city || "Unknown location"}
                  </span>

                  <span>
                    ⚠️ Severity: {event.severity || "Unknown"}
                  </span>

              <span>
                   🟠 Status: {event.status || "Pending"}
                  </span>

                  <span>
                    🤖 Source: {event.source || "Unknown"}
                  </span>
                </div>
              </div>
            </Popup>

            </Marker>
          ))}

        </MapContainer>


        <div className="map-legend">
          <strong>Severity</strong>

          <span>
            <i className="legend-dot high"></i>
            High
          </span>

          <span>
            <i className="legend-dot medium"></i>
            Medium
          </span>

          <span>
            <i className="legend-dot low"></i>
            Low
          </span>
        </div>

      </div>

    </div>
  );
}

export default IncidentMap;