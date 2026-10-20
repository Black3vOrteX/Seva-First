import { useEffect, useState } from "react";
import { CheckCircle, RefreshCw, ShieldAlert } from "lucide-react";

function Admin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/events/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching admin reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateStatus = async (eventId, status) => {
    try {
      setUpdating(eventId);

      const response = await fetch(
        `http://localhost:8000/events/${eventId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchEvents();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const pendingEvents = events.filter(
    (event) =>
      event.status?.toLowerCase() === "pending"
  );

  return (
    <div className="admin-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN CONTROL CENTER</span>

          <h1>Report Verification</h1>

          <p>
            Review citizen reports and verify weather incidents.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchEvents}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <ShieldAlert size={24} />
          <div>
            <span>Pending Reports</span>
            <strong>{pendingEvents.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <CheckCircle size={24} />
          <div>
            <span>Total Reports</span>
            <strong>{events.length}</strong>
          </div>
        </div>
      </div>

      <div className="admin-reports">
        <div className="admin-section-header">
          <h2>Pending Reports</h2>
          <span>{pendingEvents.length} awaiting review</span>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : pendingEvents.length === 0 ? (
          <div className="admin-empty">
            <CheckCircle size={40} />
            <h3>No pending reports</h3>
            <p>All citizen reports have been reviewed.</p>
          </div>
        ) : (
          pendingEvents.map((event) => (
            <div className="admin-report-card" key={event.id}>
              <div className="admin-report-main">
                <div>
                  <span className="admin-report-type">
                    {event.event_type || "Weather Event"}
                  </span>

                  <h3>
                    {event.description ||
                      "No description provided."}
                  </h3>

                  <div className="admin-report-info">
                    <span>
                      📍 {event.city || "Unknown location"}
                    </span>

                    <span>
                      ⚠️ Severity:{" "}
                      {event.severity || "Unknown"}
                    </span>

                    <span>
                      👤 Source:{" "}
                      {event.source || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="admin-report-actions">
                  <button
                    className="verify-btn"
                    disabled={updating === event.id}
                    onClick={() =>
                      updateStatus(event.id, "VERIFIED")
                    }
                  >
                    <CheckCircle size={17} />
                    Verify
                  </button>

                  <button
                    className="resolve-btn"
                    disabled={updating === event.id}
                    onClick={() =>
                      updateStatus(event.id, "RESOLVED")
                    }
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;