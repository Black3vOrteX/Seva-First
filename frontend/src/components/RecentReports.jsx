import { useEffect, useState } from "react";
import { MapPin, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/events/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReports(data.reverse().slice(0, 5));
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchReports();

  const interval = setInterval(fetchReports, 30000);

  return () => clearInterval(interval);
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
    const value = status?.toLowerCase() || "";

    if (value === "resolved") return "resolved-status";
    if (value === "verified") return "active-status";

    return "monitoring-status";
  };

  if (loading) {
    return (
      <div className="reports-card">
        <div className="section-header">
          <div>
            <h3>Recent Community Reports</h3>
            <p>Latest incidents reported by citizens</p>
          </div>
        </div>

        <div className="reports-loading">
          <Loader2 className="loading-spinner" size={22} />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-card">
      <div className="section-header">
        <div>
          <h3>Recent Community Reports</h3>
          <p>Latest incidents reported by citizens</p>
        </div>

        <button
          className="view-all"
          onClick={() => navigate("/incidents")}
        >
          View all
        </button>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div className="reports-empty">
            No community reports yet.
          </div>
        ) : (
          reports.map((report) => (
            <div
              className="report-row"
              key={report.id}
              onClick={() => navigate(`/event/${report.id}`)}
              style={{ cursor: "pointer" }}
            >

              <div className="report-info">
                <strong>{report.event_type}</strong>

                <span>
                  <MapPin size={13} />
                  {report.city || "Unknown location"}
                </span>
              </div>

              <div className="report-time">
                <Clock size={13} />
                {report.event_date
                  ? new Date(report.event_date).toLocaleString()
                  : "Recently"}
              </div>

              <span
                className={`status-badge ${getStatusClass(
                  report.status
                )}`}
              >
                {report.status || "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentReports;