import { Bell, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

function Topbar() {
  const [currentLocation, setCurrentLocation] = useState("Detecting location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentLocation("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          const address = data.address || {};

          const locationName =
            address.city ||
            address.town ||
            address.village ||
            address.suburb ||
            "Location detected";

          setCurrentLocation(locationName);
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setCurrentLocation(
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
        }
      },
      (error) => {
        console.error("Location detection failed:", error);
        setCurrentLocation("Location unavailable");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return (
    <header className="topbar">
      <div className="location-info">
        <MapPin size={18} />

        <div>
          <span>Current Location</span>
          <strong>{currentLocation}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">
          <div className="avatar">C</div>

          <div className="profile-text">
            <strong>Citizen</strong>
            <span>Public User</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;