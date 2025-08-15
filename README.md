
# Backend (Railway)

## Dev
```bash
cp .env.example .env
npm i
npx prisma generate
npm run dev
```
Open http://localhost:3000/health

## Endpoints
- POST /api/pair/create  (Authorization: Bearer <token>) -> { id }
- POST /api/pair/:botId/start -> queues a start job
- GET  /api/bots         -> list user bots

## Notes
- Workers run in-process for simplicity. For scale, split into a separate Railway service and import `startWorker` there.
- Auth: If `JWT_SECRET` is missing, middleware allows a dev user automatically.
