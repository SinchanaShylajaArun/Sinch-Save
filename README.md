# Sinch & Save

A personal expense tracker for variable part-time income: log earnings and spending, stay under weekly caps, and watch a terrarium savings jar grow.

This repo holds independent parts. Each one has its own dependencies, settings, tests, README and CI workflow, and can be run, tested and deployed on its own.

| Part | Folder | Stack | Docs |
|---|---|---|---|
| Backend API | [`backend/`](backend) | FastAPI, SQLAlchemy, PostgreSQL / SQLite | [backend/README.md](backend/README.md) |
| Frontend | [`frontend/`](frontend) | React, Vite | [frontend/README.md](frontend/README.md) |
| Paystub RAG | `rag/` (planned) | Claude API, pgvector | |

## Quick start
Run each part in its own terminal:
```bash
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
cd frontend && npm install && npm run dev
```

## Roadmap
- [x] Phase 1: Backend API
- [x] Phase 2: React frontend
- [ ] Phase 3: Auth, migrations, deployment
- [ ] Phase 4: Paystub RAG
- [ ] Phase 5: Evaluation, PII masking, polish

## Working in this repo
- Commits are scoped by part: `feat(backend): …`, `fix(frontend): …`, `docs: …`
- Releases are tagged per part: `backend-v0.1.0`, `frontend-v0.2.0`
- CI only runs for the part that changed (see `.github/workflows/`)
