import { useEffect, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Loader2,
  Eye,
  Search,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Incidents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");

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
          [...data].sort(
            (a, b) =>
              new Date(b.event_date || 0) -
              new Date(a.event_date || 0)
          )
        );
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getIcon = (eventType) => {
    const type = eventType?.toLowerCase() || "";

    if (type.includes("rain")) return "🌧️";
    if (type.includes("flood")) return "🌊";
    if (type.includes("storm")) return "⛈️";
    if (type.includes("lightning")) return "⚡";
    if (type.includes("tree")) return "🌳";
    if (type.includes("road")) return "🚧";

    return "⚠️";
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase() || "pending";

    if (value === "verified") return "verified";
    if (value === "resolved") return "resolved";

    return "pending";
  };

  const filteredEvents = events.filter((event) => {
    const type = event.event_type?.toLowerCase() || "";
    const severity = event.severity?.toLowerCase() || "";
    const status = event.status?.toLowerCase() || "pending";
    const source = event.source?.toLowerCase() || "";

    const matchesType =
      filter === "all"
        ? true
        : filter === "other"
        ? ![
            "flood",
            "heavy rain",
            "storm",
            "lightning",
          ].some((item) => type.includes(item))
        : type.includes(filter);

    const matchesSeverity =
      severityFilter === "all" ||
      severity === severityFilter;

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter;

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "citizen" && source === "citizen") ||
      (sourceFilter === "ai" && source === "ai");

    const searchText = `
      ${event.event_type || ""}
      ${event.description || ""}
      ${event.city || ""}
      ${event.state || ""}
    `.toLowerCase();

    const matchesSearch =
      search.trim() === "" ||
      searchText.includes(search.toLowerCase());

    return (
      matchesType &&
      matchesSeverity &&
      matchesStatus &&
      matchesSource &&
      matchesSearch
    );
  });

  const total = events.length;

  const active = events.filter(
    (event) =>
      event.status?.toLowerCase() !== "resolved"
  ).length;

  const verified = events.filter(
    (event) =>
      event.status?.toLowerCase() === "verified"
  ).length;

  const highRisk = events.filter(
    (event) =>
      event.severity?.toLowerCase() === "high"
  ).length;

  if (loading) {
    return (
      <div className="incidents-loading">
        <Loader2 className="loading-spinner" size={28} />
        <span>Loading incident intelligence...</span>
      </div>
    );
  }

  return (
    <div className="incidents-page">

      {/* HEADER */}

      <div className="page-heading">
        <div>
          <span className="eyebrow">
            INCIDENT INTELLIGENCE
          </span>

          <h1>Weather Incidents</h1>

          <p>
            Monitor, investigate and track weather and
            disaster reports.
          </p>
        </div>
      </div>


      {/* SUMMARY CARDS */}

      <div className="incident-summary">

        <div className="incident-stat">
          <span className="incident-stat-icon">📊</span>

          <div>
            <strong>{total}</strong>
            <span>Total Incidents</span>
          </div>
        </div>

        <div className="incident-stat">
          <span className="incident-stat-icon">🚨</span>

          <div>
            <strong>{active}</strong>
            <span>Active</span>
          </div>
        </div>

        <div className="incident-stat">
          <span className="incident-stat-icon">✓</span>

          <div>
            <strong>{verified}</strong>
            <span>Verified</span>
          </div>
        </div>

        <div className="incident-stat high-risk">
          <span className="incident-stat-icon">⚠️</span>

          <div>
            <strong>{highRisk}</strong>
            <span>High Risk</span>
          </div>
        </div>

      </div>


      {/* SEARCH */}

      <div className="incident-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search incidents, locations or descriptions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>


      {/* EVENT TYPE FILTERS */}

      <div className="incident-filter-section">

        <div className="incident-filters">
          {[
            "all",
            "flood",
            "heavy rain",
            "storm",
            "lightning",
            "other",
          ].map((item) => (
            <button
              key={item}
              className={`incident-filter ${
                filter === item ? "selected" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item === "all"
                ? "All"
                : item.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
            </button>
          ))}
        </div>


        {/* DROPDOWN FILTERS */}

        <div className="incident-dropdowns">

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>


          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
          </select>


          <select
            value={sourceFilter}
            onChange={(e) =>
              setSourceFilter(e.target.value)
            }
          >
            <option value="all">All Sources</option>
            <option value="citizen">Citizen</option>
            <option value="ai">AI / System</option>
          </select>

        </div>

      </div>


      {/* RESULT COUNT */}

      <div className="incident-results-header">
        <strong>
          {filteredEvents.length} incident
          {filteredEvents.length !== 1 ? "s" : ""}
        </strong>

        <span>
          Showing filtered intelligence
        </span>
      </div>


      {/* INCIDENT LIST */}

      <div className="incidents-list">

        {filteredEvents.length === 0 ? (

          <div className="incidents-empty">
            <AlertTriangle size={34} />

            <h3>No incidents found</h3>

            <p>
              Try changing your search or filters.
            </p>
          </div>

        ) : (

          filteredEvents.map((event) => (

            <div
              className="incident-card"
              key={event.id}
            >

              {/* ICON */}

              <div className="incident-icon">
                {getIcon(event.event_type)}
              </div>


              {/* MAIN CONTENT */}

              <div className="incident-main">

                <div className="incident-title-row">

                  <div>
                    <span className="incident-type">
                      {event.event_type || "Weather Event"}
                    </span>

                    <h3>
                      {event.description ||
                        "No description provided."}
                    </h3>
                  </div>

                  <span
                    className={`incident-severity ${
                      event.severity?.toLowerCase() ||
                      "medium"
                    }`}
                  >
                    {event.severity || "Medium"}
                  </span>

                </div>


                <div className="incident-meta">

                  <span>
                    <MapPin size={14} />

                    {event.city ||
                      "Unknown location"}
                  </span>


                  <span>
                    <Clock size={14} />

                    {event.event_date
                      ? new Date(
                          event.event_date
                        ).toLocaleString()
                      : "Recently"}
                  </span>


                  <span
                    className={`incident-status ${getStatusClass(
                      event.status
                    )}`}
                  >
                    {event.status || "Pending"}
                  </span>


                  <span className="incident-source">

                    {event.source?.toLowerCase() ===
                    "citizen"
                      ? "👤 Citizen Report"
                      : "🤖 AI / System"}

                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="incident-actions">

                <button
                  className="incident-view-button"
                  onClick={() =>
                    navigate(`/event/${event.id}`)
                  }
                >
                  <Eye size={16} />
                  View
                </button>

                {event.latitude !== null &&
                  event.longitude !== null && (
                    <button
                      className="incident-map-button"
                      onClick={() =>
                        navigate("/map")
                      }
                    >
                      <Navigation size={16} />
                      Map
                    </button>
                  )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Incidents;