# Labas SMK — AI Campus Assistant

AI-powered campus assistant for SMK College of Applied Sciences, Vilnius, Lithuania.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                    Nginx :80                     │
│              (Reverse Proxy)                     │
├─────────┬──────────────┬────────────────────────┤
│ /* →    │ /api/* →     │ /ai/* →                │
│ React   │ Laravel      │ FastAPI                │
│ :5174   │ :8000        │ :8001                  │
└────┬────┴──────┬───────┴──────┬──────────────────┘
     │           │              │
     │     ┌─────┴─────┐   ┌───┴───┐
     │     │ PostgreSQL │   │ Claude│
     │     │   :5432    │   │  API  │
     │     └─────┬─────┘   └───────┘
     │     ┌─────┴─────┐
     │     │   Redis    │
     │     │   :6379    │
     │     └───────────┘
```

## 🚀 Quick Start

### 1. Configure and Start
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
docker compose up -d
docker compose exec backend php artisan migrate:fresh --seed
```

### 2. Access
- **App**: http://localhost
- **AI Docs**: http://localhost:8001/docs

### Demo Credentials
| Role    | Email                    | Password |
|---------|--------------------------|----------|
| Admin   | admin@smk.lt             | password |
| Student | jonas@student.smk.lt     | password |

## 📁 Project Structure

```
labas-smk/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Laravel 11 API
├── ai-service/        # Python FastAPI + Claude
├── nginx/             # Reverse proxy config
├── docs/              # Academic thesis & data templates
└── docker-compose.yml
```

## 🔌 Core API Endpoints

### Student Features
- `GET /api/schedule/my` — Personal daily timetable
- `GET /api/rooms/availability` — Real-time room status (free/busy)
- `GET /api/events` — Campus events calendar
- `POST /api/chat/stream` — Real-time AI conversation

### Management
- `POST /api/admin/schedule/import` — Excel/CSV import
- `DELETE /api/chat/history` — Clear session history

## 🤖 AI Features
- **Context-Aware**: Grounds responses in live schedule and room data.
- **Multilingual**: Auto-detects English, Lithuanian, and Russian.
- **Persona-Driven**: Features the "Mia" friendly assistant persona.

## 📄 License
Academic thesis project — SMK College of Applied Sciences © 2026
