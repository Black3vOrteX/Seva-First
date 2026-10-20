import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  Loader2,
  Navigation,
  User,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/events/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data);

      } catch (error) {
        console.error(
          "Error fetching event:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);


  if (loading) {
    return (
      <div className="event-details-loading">
        <Loader2
          className="loading-spinner"
          size={28}
        />
        <span>
          Loading incident details...
        </span>
      </div>
    );
  }


  if (!event) {
    return (
      <div className="event-details-empty">
        <AlertTriangle size={40} />

        <h2>Event not found</h2>

        <p>
          The requested incident could not be found.
        </p>

        <button
          onClick={() => navigate("/incidents")}
        >
          Back to Incidents
        </button>
      </div>
    );
  }


  const status =
    event.status?.toLowerCase() ||
    "pending";

  const severity =
    event.severity?.toLowerCase() ||
    "medium";

  const source =
    event.source?.toLowerCase() ||
    "unknown";


  return (
    <div className="event-details-page">

      {/* BACK */}

      <button
        className="back-button"
        onClick={() => navigate("/incidents")}
      >
        <ArrowLeft size={18} />
        Back to Incidents
      </button>


      {/* HEADER */}

      <div className="event-details-header">

        <div>

          <span className="eyebrow">
            COMMUNITY INCIDENT
          </span>

          <h1>
            {event.event_type ||
              "Weather Event"}
          </h1>

          <p>
            Detailed information about this
            reported weather event
          </p>

        </div>


        <span
          className={`event-status ${status}`}
        >
          {status === "verified" && (
            <ShieldCheck size={16} />
          )}

          {status.toUpperCase()}
        </span>

      </div>


      {/* MAIN GRID */}

      <div className="event-details-grid">


        {/* EVENT INFORMATION */}

        <div className="event-info-card">

          <div className="event-card-heading">

            <div className="event-heading-icon">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h3>Event Information</h3>

              <span>
                Incident metadata
              </span>
            </div>

          </div>


          <div className="event-info-row">

            <MapPin size={20} />

            <div>
              <span>Location</span>

              <strong>
                {event.city ||
                  "Unknown location"}

                {event.state
                  ? `, ${event.state}`
                  : ""}
              </strong>
            </div>

          </div>


          <div className="event-info-row">

            <Clock size={20} />

            <div>
              <span>Reported</span>

              <strong>
                {event.event_date
                  ? new Date(
                      event.event_date
                    ).toLocaleString()
                  : "Unknown"}
              </strong>
            </div>

          </div>


          <div className="event-info-row">

            <AlertTriangle size={20} />

            <div>
              <span>Severity</span>

              <strong
                className={`severity-text ${severity}`}
              >
                {event.severity ||
                  "Unknown"}
              </strong>
            </div>

          </div>

        </div>


        {/* DESCRIPTION */}

        <div className="event-description-card">

          <div className="event-card-heading">

            <div className="event-heading-icon">
              📝
            </div>

            <div>
              <h3>Report Description</h3>

              <span>
                Information submitted with the report
              </span>
            </div>

          </div>


          <div className="event-description">

            {event.description ||
              "No description provided."}

          </div>


          <div className="event-meta">

            <div>

              <span>
                <User size={14} />
                Source
              </span>

              <strong>
                {source === "citizen"
                  ? "Citizen Report"
                  : source === "ai"
                  ? "AI / System"
                  : event.source ||
                    "Unknown"}
              </strong>

            </div>


            <div>

              <span>
                Confidence
              </span>

              <strong>
                {event.confidence !== null &&
                event.confidence !== undefined
                  ? `${Math.round(
                      event.confidence * 100
                    )}%`
                  : "N/A"}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* GPS */}

      <div className="event-location-card">

        <div className="event-location-header">

          <div>

            <div className="event-card-heading">

              <div className="event-heading-icon">
                <Navigation size={19} />
              </div>

              <div>

                <h3>Location Intelligence</h3>

                <span>
                  Geographic information for this incident
                </span>

              </div>

            </div>

          </div>


          {event.latitude !== null &&
            event.longitude !== null && (

              <button
                className="event-map-button"
                onClick={() =>
                  navigate("/map")
                }
              >
                <Navigation size={16} />
                View on Map
              </button>

            )}

        </div>


        <div className="gps-grid">

          <div>
            <span>Latitude</span>

            <strong>
              {event.latitude ??
                "Not available"}
            </strong>
          </div>


          <div>
            <span>Longitude</span>

            <strong>
              {event.longitude ??
                "Not available"}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}


export default EventDetails;