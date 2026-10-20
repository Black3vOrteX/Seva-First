# Seva-First: Weather Intelligence & Incident Reporting Platform

## 🌙 Design System
**Theme:** AuthKit Midnight Cathedral Aesthetic
- Dark frosted glass design with luminous text
- Blueprint grid atmosphere
- Violet (#663af3) for primary CTAs, Blue (#2563eb) for navigation
- Smooth glass-morphism effects throughout

## 📋 Project Overview

**Seva-First** is a comprehensive weather intelligence and incident reporting platform designed to help communities stay informed and prepared during weather-related emergencies.

### Key Features
- 🌤️ **Real-time weather data** - Live weather information for Indian cities
- 📍 **Incident mapping** - Visualize weather incidents on an interactive map
- 📝 **Community reporting** - Citizens can report weather events and incidents
- 🔍 **Incident intelligence** - Track, verify, and resolve reported incidents
- 👨‍💼 **Admin dashboard** - Monitor and manage all reports and incidents
- ⚙️ **Settings** - System configuration and user preferences

## 🏗️ Project Structure

```
Seva-First/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── MainSidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── WeatherCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── RecentReports.jsx
│   │   │   └── ReportForm.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard (/)
│   │   │   ├── ReportEvent (/report)
│   │   │   ├── EventDetails (/event/:id)
│   │   │   ├── Incidents (/incidents)
│   │   │   ├── IncidentMap (/map)
│   │   │   ├── Weather (/weather)
│   │   │   ├── Settings (/settings)
│   │   │   └── Admin (/admin)
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # All styling (AuthKit theme)
│   │   ├── index.css        # Base styles
│   │   ├── tokens.css       # Design tokens
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI app & routes
│   ├── database.py         # SQLAlchemy setup
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── weather_service.py  # OpenWeather API integration
│   ├── routers/
│   │   └── events.py       # Event/incident endpoints
│   ├── mausam.db           # SQLite database
│   └── .env               # Environment variables
│
├── data/                   # Data files
├── docs/                   # Documentation
└── ai/                     # AI/ML components
```

## 🚀 Getting Started

### Prerequisites
- **Frontend:** Node.js 18+, npm
- **Backend:** Python 3.9+, pip

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install fastapi uvicorn python-dotenv requests sqlalchemy
   ```

2. **Ensure `.env` file exists with:**
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

3. **Start backend server:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Runs at `http://localhost:8000`

## 🎨 Design System (AuthKit Theme)

### Color Palette

| Name | Color | Usage |
|------|-------|-------|
| Canvas | `#0a0e27` | Page background |
| Text (Primary) | `#ffffff` | Headlines |
| Text (Secondary) | `#ccdaf5` | Body text |
| Text (Muted) | `#8fa5c8` | Helper text |
| Primary CTA | `#663af3` | Buttons (Report, Submit) |
| Secondary | `#2563eb` | Navigation, info |
| Success | `#16a34a` | Resolved status |
| Warning | `#f59e0b` | Pending status |
| Critical | `#e46d4c` | High severity |

### Key Design Features
- **Frosted glass cards** - `rgba(255,255,255,0.07)` with `backdrop-filter: blur(20px)`
- **Blueprint grid** - Subtle repeating grid pattern in background
- **Ambient spotlight** - Radial gradient glow at top of page
- **Inset borders** - `1px solid rgba(186, 215, 247, 0.18)` instead of hard lines
- **No shadows** - Elevation created through glass layers only

## 📱 Pages & Routes

### Dashboard (`/`)
- Welcome greeting with time
- Real-time weather card
- Statistics: Total Reports, Active Incidents, Critical Alerts
- Recent community reports list

### Report Event (`/report`)
- Multi-step form to report weather incidents
- Category selection (flood, storm, heatwave, etc.)
- Description input with AI analysis option
- Location picker with map
- File uploads for evidence
- Submit with verification

### Event Details (`/event/:id`)
- Full incident information
- Status (Pending, Verified, Resolved)
- GPS coordinates & location details
- Description & metadata
- Event history

### Incidents (`/incidents`)
- Searchable list of all incidents
- Filter by type, status, severity
- Statistics summary
- Quick view and map buttons

### Incident Map (`/map`)
- Interactive Leaflet map
- Color-coded incident markers (red/orange/green)
- Clickable popups with incident details
- Legend

### Weather (`/weather`)
- Detailed weather information
- Multi-city weather comparison
- Weather alerts & advisories

### Settings (`/settings`)
- User preferences
- System configuration
- Notification settings
- Theme toggle

### Admin (`/admin`)
- Dashboard for administrators
- Pending reports to verify
- Verify/Resolve actions
- System stats & monitoring

## 🔗 API Endpoints

### Weather
- `GET /weather/{city}` - Get weather for a city
- `GET /weather-multiple` - Get weather for all cities

### Events
- `GET /events/` - List all events
- `POST /events/` - Create new event
- `GET /events/{id}` - Get event details
- `PUT /events/{id}` - Update event
- `PATCH /events/{id}/status` - Change event status
- `GET /events/statistics` - Get event statistics

## 💾 Database Schema

### WeatherEvent Table
- `id` - Primary key
- `title` - Event title
- `category` - Type of incident
- `description` - Full description
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `location_name` - Address/location
- `severity` - high/medium/low
- `status` - pending/verified/resolved
- `evidence_urls` - JSON array of file URLs
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `verified_by` - Admin who verified
- `resolved_by` - Admin who resolved

## 🔧 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool
- **React Router 7** - Routing
- **Leaflet 1.9** - Maps
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **Requests** - HTTP client
- **OpenWeather API** - Weather data

## 📝 Available Scripts

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
npm run lint     # Run linter (oxlint)
```

### Backend
```bash
python -m uvicorn main:app --reload                    # Dev server with auto-reload
python -m uvicorn main:app --host 0.0.0.0 --port 8000  # Production server
```

## 🐛 Troubleshooting

### Weather data not loading
- Ensure backend is running on `http://localhost:8000`
- Check `.env` has valid `OPENWEATHER_API_KEY`
- Check browser console for CORS errors

### Frontend showing "Cannot GET /"
- Ensure you're accessing `http://localhost:5173` not `http://localhost:8000`
- Check Vite dev server is running with `npm run dev`

### Database errors
- Delete `mausam.db` and restart backend to reset database
- Ensure SQLite is available on your system

## 🎯 Recent Changes

### AuthKit Theme Redesign (Oct 2026)
- ✅ Complete UI redesign to AuthKit midnight cathedral aesthetic
- ✅ Dark frosted glass design system
- ✅ Improved contrast and readability
- ✅ Fixed layout overlap issues
- ✅ Created comprehensive design tokens (`tokens.css`)

## 📚 Documentation Files
- `PROJECT_GUIDE.md` - This file
- `CLAUDE.md` - Development notes (if exists)
- Backend docstrings in Python files

## 🤝 Contributing

When making changes:
1. Keep AuthKit design system consistent
2. Use color tokens from `tokens.css`
3. Maintain dark theme for accessibility
4. Test both frontend and backend changes
5. Update this guide if adding new features

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Check backend logs
4. Verify `.env` configuration

---

**Last Updated:** October 20, 2026
**Design System:** AuthKit Midnight Cathedral
**Version:** 1.0.0
