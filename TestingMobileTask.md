# MobileTasks — End-to-End Testing Notes

## Operator credentials

| Field    | Value     |
|----------|-----------|
| Username | `test.op` |
| Password | `test123` |
| Shop ID  | `30`      |

## What was fixed / added

1. **Shared patterns** — added `MY_TASKS`, `START`, `COMPLETE` to `AGENCY_TASKS_PATTERNS` in `crm3-micro/packages/shared/src/patterns.ts`

2. **ops-svc handlers** (`crm3-micro/apps/ops-svc/src/app.module.ts`):
   - `myTasks` — filters `agencyTask` by `agencyId + userId` (or `assignAllOperators = true`), returns paginated list
   - `start` — sets `status = 1`, `startAt = now`
   - `complete` — sets `status = 2`, `endAt = now`

3. **Gateway proxy** (`crm3-micro/apps/gateway/src/proxy/ops.proxy.controller.ts`):
   - Added `GET /api/shoptasks/my/:shopId` route (was missing)
   - Fixed `PATCH /api/shoptasks/shop-task/:id/start` to use `AGENCY_TASKS_PATTERNS.START` instead of the wrong `ALL_SHOPS` pattern
   - Fixed `PATCH /api/shoptasks/shop-task/:id/complete` to use `AGENCY_TASKS_PATTERNS.COMPLETE`

4. **Test user** — created `test.op / test123` operator (user id 132) and assigned 2 tasks to shop #30:
   - `[perf] Simple pending u69 …` (agencyTask id 87)
   - `[perf] Simple task u44 …` (agencyTask id 86)

## Verified screen output (Puppeteer)

```
My Tasks
Hello, test.op 👋
Shop #30
Logout
All  Pending  Active  Done

[perf] Simple pending u69 t1779521357938
Pending  ·  Tap to start →

[perf] Simple task u44 t1779521357938
Pending  ·  Tap to start →
```

## Running services

| Service   | Port | Start command                                        |
|-----------|------|------------------------------------------------------|
| auth-svc  | 3101 | `cd crm3-micro/apps/auth-svc && npm run start:dev`   |
| ops-svc   | 3103 | `cd crm3-micro/apps/ops-svc && npm run start:dev`    |
| gateway   | 3100 | `cd crm3-micro/apps/gateway && npm run start:dev`    |
| MobileTasks (web) | 8082 | `cd MobileTasks && npx expo start --web --port 8082` |

## Mobile API endpoints used

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, returns `access_token` |
| GET | `/api/auth/me` | Current user |
| GET | `/api/shoptasks/my/:shopId` | Operator's tasks for a shop |
| PATCH | `/api/shoptasks/shop-task/:id/start` | Start a task |
| POST | `/api/shoptasks/shop-task/:id/answer` | Submit a question answer |
| PATCH | `/api/shoptasks/shop-task/:id/complete` | Complete a task |
| GET | `/api/shoptasks` | All tasks (manager view) |
| GET | `/api/shoptasks/:id/questions` | Task questions |
