# PetPulse — Petcare platform (Student end project)

![PetPulse](frontend/public/image/ps1.png)

A full‑stack petcare platform built with Fastify + MongoDB on the backend and Next.js on the frontend.

This is my student end project from last year. Special thanks to my colleague — Yacine Yousfi — for the support and collaboration.

## Quick start with Docker (simple, no nginx)

Requirements:

- Docker and Docker Compose
- Existing MongoDB database (Atlas or self-hosted). Put your connection string in `backend/.env`.

1. Ensure `backend/.env` exists with at least:

   - `MONGODB_URI=...`
   - `ACCESS_TOKEN_SECRET=...`
   - `REFRESH_TOKEN_SECRET=...`
   - Optional: `EMAIL_USER`, `EMAIL_PASS`, `COOKIE_SECRET`, etc.

2. Build and start both services:

```powershell
# From the repo root
docker compose up --build
```

- Frontend: http://localhost:3000
- API (Fastify): http://localhost:5000

The frontend is configured to call the API via `NEXT_PUBLIC_API_URL=http://localhost:5000` (defined in `docker-compose.yml`).

## What’s inside

- Backend: Fastify, Socket.IO, Mongoose
- Frontend: Next.js 15 (App Router), React 19
- Auth, chat, reminders, payments and more features under `backend/controllers` and `frontend/app`/`components`

## Node.js version

Both images use Node.js 20 (bookworm-slim), which is compatible with this project (backend requires >= 18, Next 15 works great on Node 20).

## Local development (optional, without Docker)

Backend (in a separate terminal):

```powershell
cd backend
npm install
npm run dev
```

By default it listens on http://localhost:5000

Frontend (in another terminal):

```powershell
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000

Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in `frontend/.env.local` if you run locally without Docker.

## Environment variables

Backend (`backend/.env`):

- `MONGODB_URI` or `DATABASE_URI` — MongoDB connection string
- `DB_NAME` — optional database name
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` — JWT secrets
- `COOKIE_SECRET` — optional cookie signing secret
- `EMAIL_USER`, `EMAIL_PASS` — for email features (optional)
- Others in code as needed

Frontend:

- `NEXT_PUBLIC_API_URL` — Base URL to call the API (browser-visible). With Docker we set this in compose to `http://localhost:5000`.

## Docker files

- `backend/Dockerfile` — simple Node 20 image for Fastify API
- `frontend/Dockerfile` — single-stage Node 20 image for Next.js (build + start)
- `docker-compose.yml` — brings up both containers; no nginx or extra services
- `.dockerignore` files prevent copying `node_modules`, `.env`, and build artifacts into images

## Troubleshooting

- If the API can’t connect to MongoDB, verify `MONGODB_URI` inside `backend/.env`.
- If CORS blocks requests, ensure the frontend origin (e.g., http://localhost:3000) is allowed in backend CORS config.
- If ports are busy, change the published ports in `docker-compose.yml`.

## Contributing

- Issues and pull requests are welcome. Please keep PRs small and focused.
- Run the app locally or via Docker, test your changes, then open a PR.

## License (important)

This project is provided under a strict non‑commercial, no‑distribution license. You’re welcome to collaborate and submit PRs here, but cloning to use/deploy or distributing the app is not permitted without written permission.

See the full terms in the [LICENSE](./LICENSE) file.

## Acknowledgements

Thanks to my colleague, Yacine Yousfi, for the help and collaboration on this project.
