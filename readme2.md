# Labas SMK — AI Campus Assistant

> AI-powered campus assistant for SMK College of Applied Sciences, Vilnius, Lithuania.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                    Nginx :80                     │
│              (Reverse Proxy)                     │
├─────────┬──────────────┬────────────────────────┤
│ /* →    │ /api/* →     │ /ai/* →                │
│ React   │ Laravel      │ FastAPI                │
│ :5173   │ :8000        │ :8001                  │
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

### Prerequisites
- Docker & Docker Compose
- (Optional) Anthropic API key for Claude integration

### 1. Clone and configure
```bash
cd labas-smk
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY (optional)
```

### 2. Start all services
```bash
docker compose up -d
```

### 3. Run migrations and seed data
```bash
docker compose exec backend php artisan migrate:fresh --seed
```

### 4. Open in browser
- **App**: http://localhost
- **API**: http://localhost/api
- **AI Docs**: http://localhost:8001/docs

### Demo Credentials
| Role    | Email                    | Password |
|---------|--------------------------|----------|
| Admin   | admin@smk.lt             | password |
| Student | jonas@student.smk.lt     | password |
| Student | elena@student.smk.lt     | password |

## 📁 Project Structure

```
labas-smk/
├── frontend/          # React + Vite + TailwindCSS + TypeScript
│   ├── src/
│   │   ├── components/  # Layout, Sidebar, Skeleton
│   │   ├── pages/       # 8 page components
│   │   ├── hooks/       # React Query hooks
│   │   ├── store/       # Zustand auth store
│   │   └── lib/         # Axios API client
│   └── Dockerfile
├── backend/           # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # 6 controllers
│   │   ├── Models/                # 6 models
│   │   └── Repositories/         # 3 repositories
│   ├── database/
│   │   ├── migrations/            # 7 migrations
│   │   └── seeders/               # Demo data seeder
│   └── Dockerfile
├── ai-service/        # Python FastAPI + Claude
│   ├── services/        # Claude service + context builder
│   ├── models/          # Pydantic schemas
│   ├── main.py
│   └── Dockerfile
├── nginx/             # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/logout` — Logout (requires token)
- `GET  /api/auth/me` — Current user profile

### Schedule
- `GET /api/schedule/my` — Today's schedule for current user
- `GET /api/schedule/week` — Full week schedule

### Rooms
- `GET /api/rooms/availability` — All rooms with real-time status (free/soon/busy)
- `GET /api/rooms/{id}` — Room details + today's schedule

### Events
- `GET /api/events` — All upcoming events (filter by ?category=)
- `GET /api/events/upcoming` — Next 5 events

### Chat (AI)
- `POST /api/chat` — Send message, get AI response
- `GET  /api/chat/history` — Chat history

### Admin
- `POST /api/admin/schedule/import` — Upload Excel/CSV schedule
- `GET  /api/admin/stats` — Dashboard statistics

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0b0f` |
| Accent Blue | `#4f8ef7` |
| Accent Purple | `#7b5cf7` |
| Success Green | `#22d3a0` |
| Heading Font | Syne |
| Body Font | DM Sans |

## 🤖 AI Features

- **Claude Integration**: Uses `claude-sonnet-4-20250514` for intelligent responses
- **Context-Aware**: Includes user's schedule, room availability, and events in prompts
- **Multilingual**: Auto-detects and responds in English, Lithuanian, or Russian
- **Knowledge Base**: Contains SMK campus info (building layout, office hours, procedures)
- **Fallback Mode**: Provides helpful static responses when API key is not configured

## 🛠 Development

### Run without Docker
```bash
# Backend
cd backend && composer install && php artisan serve

# Frontend
cd frontend && npm install && npm run dev

# AI Service
cd ai-service && pip install -r requirements.txt && uvicorn main:app --port 8001 --reload
```

## 📄 License

Academic thesis project — SMK College of Applied Sciences © 2026
