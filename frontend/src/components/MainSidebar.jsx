import {
  LayoutDashboard,
  TriangleAlert,
  CloudSun,
  Map,
  Settings,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import { NavLink, Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <CloudSun size={25} />
        </div>

        <div>
          <h2>Mausam</h2>
          <span>Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN</p>

        <NavLink
         to="/"
         end
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
         to="/report"
         end
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <TriangleAlert size={20} />
          <span>Report Event</span>
        </NavLink>

        <NavLink
         to="/weather"
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <CloudSun size={20} />
          <span>Weather</span>
        </NavLink>

        <NavLink
         to="/incidents"
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <Map size={20} />
          <span>Incidents</span>
        </NavLink>

        <NavLink
         to="/map"
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <MapPinned size={20} />
          <span>Incident Map</span>
        </NavLink>


        <p className="nav-label">ADMIN</p>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <ShieldCheck size={20} />
          <span>Admin Panel</span>
        </NavLink>



        <p className="nav-label settings-label">SYSTEM</p>

        <NavLink
         to="/settings"
         end
         className={({ isActive }) =>
           `nav-item ${isActive ? "active" : ""}`
         }>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="status-dot"></div>

        <div>
          <strong>System Online</strong>
          <span>All services operational</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;