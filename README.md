# Team 6 Full-stack Release

React UI and Django REST API are deployed as one HTTPS service. The production image builds the UI, serves its assets through Django/WhiteNoise, and exposes the API under `/api/` on the same origin.

## Sources preserved in this release

- UI: `Tech-Jam-KDG-2026-Winter/Team-6-React-frontend` branch `develop` (`facd5d6`).
- API: `Tech-Jam-KDG-2026-Winter/Team-6-Django-backend` branch `main` (`ab1bd43`).

The historical nested `node_modules`, built assets, and unrelated backend branches were intentionally excluded.

## Local development

Create `backend/.env` from the root `.env.example`, then run the backend and UI in separate terminals:

```sh
cd backend
cp ../.env.example .env
python manage.py migrate
python manage.py runserver
```

```sh
cd frontend
npm ci
npm run dev
```

For production-like validation, build and run the Docker image with the required environment variables. The health endpoint is `/api/health/`.

## Deployment

`render.yaml` defines a single Docker web service plus managed Postgres. Connect this repository in Render, create the Blueprint, and keep the generated `SECRET_KEY` private. The service uses `/api/health/` for health checks, applies migrations on startup, and stores database data in Postgres.

Before release, run:

```sh
cd frontend && npm ci && npm run lint && npm run build
cd ../backend && DEBUG=true SECRET_KEY=local-only-secret python manage.py test
```
