import {
  CloudRain,
  Waves,
  Wind,
  Zap,
  TreePine,
  Construction,
  Camera,
  MapPin,
  Upload,
  Navigation,
} from "lucide-react";

import { useState } from "react";

const categories = [
  {
    id: "heavy-rain",
    name: "Heavy Rain",
    icon: CloudRain,
  },
  {
    id: "flooding",
    name: "Flooding",
    icon: Waves,
  },
  {
    id: "storm",
    name: "Storm / Cyclone",
    icon: Wind,
  },
  {
    id: "lightning",
    name: "Lightning",
    icon: Zap,
  },
  {
    id: "fallen-tree",
    name: "Fallen Tree",
    icon: TreePine,
  },
  {
    id: "road-blockage",
    name: "Road Blockage",
    icon: Construction,
  },
];

function ReportEvent() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
      },
      () => {
        alert(
          "Unable to detect your location. Please allow location permission."
        );

        setLocationLoading(false);
      }
    );
  };

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files || []);
    setMedia(files);
  };


  const handleAIAnalysis = async () => {
  if (!description.trim()) {
    alert("Please describe the event first.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8000/events/submit-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: description.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI error:", data);
      alert("Unable to analyze the report.");
      return;
    }

    console.log("AI analysis:", data);

    if (data.duplicate) {
      alert("⚠️ Possible duplicate report detected.");
      return;
    }

    if (data.event) {
        setAiResult(data.event);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("AI connection error:", error);
    alert("Unable to connect to the AI service.");
  }
};

  
const handleSubmit = async (event) => {
  event.preventDefault();

  if (!selectedCategory) {
    alert("Please select an event category.");
    return;
  }

  if (!description.trim()) {
    alert("Please describe what is happening.");
    return;
  }

  const reportData = {
    event_type: selectedCategory,
    description: description.trim(),

    // Prototype location
    city: incidentLocation.trim() || null,
    state: "Andhra Pradesh",

    // Real GPS coordinates from the user's device
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,

    // Media upload will be connected separately
    photo_url: null,
    video_url: null,

    severity: "medium",
    confidence: 0.9,
    source: "CITIZEN",

    event_date: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      "http://localhost:8000/events/report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend error:", data);
      alert("Unable to submit the report.");
      return;
    }

    console.log("Report submitted:", data);

    alert("✅ Report submitted successfully!");

    // Clear the form
    setSelectedCategory("");
    setDescription("");
    setIncidentLocation("");
    setLocation(null);
    setMedia([]);
    

  } catch (error) {
    console.error("Connection error:", error);

    alert(
      "Unable to connect to the Mausam Intelligence server."
    );
  }
};

  return (
    <div className="report-page">

      <div className="report-page-header">
        <div>
          <span className="eyebrow">CITIZEN REPORTING</span>

          <h1>Report an Event</h1>

          <p>
            Help authorities understand what's happening in your area.
          </p>
        </div>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>

        {/* EVENT CATEGORY */}

        <section className="form-section">

          <div className="form-section-title">
            <span className="step-number">1</span>

            <div>
              <h2>What is happening?</h2>
              <p>Select the event that best describes the situation.</p>
            </div>
          </div>

          <div className="category-grid">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card ${
                    selectedCategory === category.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={24} />

                  <span>{category.name}</span>
                </button>
              );
            })}

          </div>

        </section>


        {/* DESCRIPTION */}

        <section className="form-section">

          <div className="form-section-title">
            <span className="step-number">2</span>

            <div>
              <h2>Describe the situation</h2>
              <p>Tell us briefly what you are observing.</p>
            </div>
          </div>

          <textarea
            className="description-input"
            placeholder="Example: Water level is rising rapidly near the main road..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />

          <button
              type="button"
              className="ai-analyze-button"
              onClick={handleAIAnalysis}
            >
             🤖 Analyze with AI
            </button>

            {aiResult && (
  <div className="ai-result-card">
    <div className="ai-result-header">
      <span>🤖</span>
      <div>
        <h3>AI Analysis Complete</h3>
        <p>Mausam Intelligence analysis</p>
      </div>
    </div>

    <div className="ai-result-grid">
      <div>
        <span>Detected Event</span>
        <strong>{aiResult.event_type}</strong>
      </div>

      <div>
        <span>Severity</span>
        <strong>{aiResult.severity}</strong>
      </div>

      <div>
        <span>Confidence</span>
        <strong>
          {Math.round((aiResult.confidence || 0) * 100)}%
        </strong>
      </div>

      <div>
        <span>Location</span>
        <strong>{aiResult.city || "Unknown"}</strong>
      </div>
    </div>
  </div>
)}

          <span className="character-count">
            {description.length}/500
          </span>

        </section>


        {/* LOCATION */}

        <section className="form-section">

          <div className="form-section-title">
            <span className="step-number">3</span>

            <div>
              <h2>Incident Location</h2>
              <p>
                Detect your location if the incident is happening where you are.
              </p>
            </div>
          </div>

          <input
              type="text"
              className="description-input"
              placeholder="Example: Gajuwaka, MVP Colony, Madhurawada..."
              value={incidentLocation}
              onChange={(event) => setIncidentLocation(event.target.value)}
            />

          <div className="location-box">

            <div className="location-icon">
              <MapPin size={24} />
            </div>

            <div className="location-content">

              {location ? (
                <>
                  <strong>Location detected</strong>

                  <span>
                    Latitude: {location?.latitude?.toFixed(6)}
                    {" • "}
                    Longitude: {location?.longitude?.toFixed(6)}
                  </span>
                </>
              ) : (
                <>
                  <strong>Location not detected</strong>

                  <span>
                    We use your device location. You don't need to type it.
                  </span>
                </>
              )}

            </div>

            <button
              type="button"
              className="location-button"
              onClick={detectLocation}
              disabled={locationLoading}
            >
              <Navigation size={16} />

              {locationLoading
                ? "Detecting..."
                : location
                ? "Update Location"
                : "Detect My Location"}
            </button>

          </div>

        </section>


        {/* MEDIA */}

        <section className="form-section">

          <div className="form-section-title">
            <span className="step-number">4</span>

            <div>
              <h2>Add evidence <span>(Optional)</span></h2>

              <p>
                Photos or videos can help authorities understand the situation.
              </p>
            </div>
          </div>

          <label className="upload-box">

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              hidden
            />

            <div className="upload-icon">
              <Camera size={25} />
            </div>

            <strong>
              Add photos or videos
            </strong>

            <span>
              Tap to browse your device
            </span>

            <small>
              Optional • Images and videos
            </small>

          </label>

          {media.length > 0 && (
            <div className="selected-files">
              <Upload size={15} />

              {media.length} file{media.length > 1 ? "s" : ""} selected
            </div>
          )}

        </section>


        {/* SUBMIT */}

        <div className="submit-area">

          <p>
            By submitting this report, you are helping improve local
            situational awareness.
          </p>

          <button className="submit-report" type="submit">
            Submit Report
          </button>

        </div>

      </form>

    </div>
  );
}

export default ReportEvent;