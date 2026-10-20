import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/MainSidebar";
import Topbar from "./components/Topbar";

import WeatherCard from "./components/WeatherCard";
import StatCard from "./components/StatCard";
import RecentReports from "./components/RecentReports";

import ReportEvent from "./pages/ReportEvent";

import EventDetails from "./pages/EventDetails";

import Incidents from "./pages/Incidents";

import IncidentMap from "./pages/IncidentMap";

import Weather from "./pages/Weather";

import Settings from "./pages/Settings";

import Admin from "./pages/Admin"; 

import "./App.css";

function Dashboard() {
  const [stats, setStats] = React.useState({
    total_events: 0,
    verified: 0,
    high_severity: 0,
  });

  const [currentTime, setCurrentTime] = React.useState(new Date());

React.useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000);

  return () => clearInterval(timer);
}, []);

const hour = currentTime.getHours();

const greeting =
  hour < 12
    ? "Good morning"
    : hour < 17
    ? "Good afternoon"
    : hour < 21
    ? "Good evening"
    : "Good night";

const formattedDate = currentTime.toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formattedTime = currentTime.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
});

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/events/statistics"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
      }

        const data = await response.json();
         setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
    }
  };

  fetchStats();

  const interval = setInterval(fetchStats, 30000);

  return () => clearInterval(interval);
    }, []);

  return (
    <>  
      <div className="page-heading">
        <div>
          <span className="eyebrow">WEATHER INTELLIGENCE</span>
          <h1>{greeting} 👋</h1>
          <p>Stay informed. Stay prepared. Help your community stay safe.</p>
        </div>

        <p className="dashboard-date">
          {formattedDate} • {formattedTime}
        </p>

        <a href="/report" className="report-button">
          + Report an Event
        </a>
      </div>

      

      <WeatherCard />

      <div className="stats-grid">
        <StatCard
          number={stats.total_events}
          label="Total Reports"
          description="Community reports"
          type="reports"
        />

        <StatCard
          number={stats.active}
          label="Active Incidents"
          description="Currently monitoring"
          type="active"
        />

        <StatCard
          number={stats.high_severity}
          label="Critical Alerts"
          description="Requires attention"
          type="critical"
        />
      </div>

      <RecentReports />
    </>
  );
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportEvent />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/map" element={<IncidentMap />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;