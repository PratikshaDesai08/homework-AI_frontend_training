# Student Admin API

NestJS 12 · TypeORM · SQLite (better-sqlite3) · class-validator · Swagger

| Method | Path | |
|---|---|---|
| GET | `/api/v1/students?search=&course=&status=&page=1&limit=10&sortBy=createdAt&order=desc` | `{ items, total, page, limit }` |
| GET | `/api/v1/students/:id` | one student, 404 if missing |
| POST | `/api/v1/students` | 201; 400 validation; 409 duplicate email |
| PATCH | `/api/v1/students/:id` | 200; same rules, every field optional |
| DELETE | `/api/v1/students/:id` | 204 |

Errors: `{ statusCode, message, errors?: { <field>: <message> } }`. Swagger UI: `/api/docs`.

```bash
npm install
npm run start:dev      # http://localhost:4000 (PORT), seeds 25 students into an empty DB
npm test               # 29 e2e tests on an in-memory DB
npm run lint && npm run typecheck && npm run build
```

Env: `PORT` (4000), `DATABASE_PATH` (`data/students.sqlite`, `:memory:` for tests), `CORS_ORIGINS` (comma-separated), `SEED_ON_START` (`false` to skip seeding).
Deploy: `render.yaml` at the repo root (Render free web service).
