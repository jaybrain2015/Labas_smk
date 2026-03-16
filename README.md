# Labas SMK

AI-powered campus assistant for SMK College of Applied Sciences, Vilnius, Lithuania.

## What It Does

- 📅 **Schedule** — View your daily and weekly class timetable
- 🏫 **Room Availability** — Check which rooms are free, busy, or available soon
- 📢 **Events** — Browse upcoming campus events
- 🤖 **AI Chat** — Ask questions about campus life and get smart answers (powered by Claude)
- 🔐 **Admin Panel** — Import schedules, view statistics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Laravel 11 (PHP) |
| AI Service | Python, FastAPI, Claude API |
| Database | PostgreSQL, Redis |
| Proxy | Nginx |
| Infrastructure | Docker Compose |

## Getting Started

```bash
git clone git@github.com:jaybrain2015/Labas_smk.git
cd Labas_smk
cp .env.example .env
docker compose up -d
docker compose exec backend php artisan migrate:fresh --seed
```

Open http://localhost in your browser.

## License

Academic thesis project — SMK College of Applied Sciences © 2026
