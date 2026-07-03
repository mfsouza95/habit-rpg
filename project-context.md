# Habit RPG — Project Context

## Overview

A social habit-tracking web app where users log real-world activities, earn XP, level up, and connect with friends/squads. Built as a long-term learning project to become a fullstack developer.

## Philosophy

- Build the smallest thing that proves the feature works
- Avoid premature abstractions, premature optimization, over-engineering
- Feature-driven, incremental development
- Commit at done-condition milestones using conventional commits

## Tech Stack

### Frontend
- React + TypeScript + Vite + Tailwind CSS
- State: component-level useState (no global state yet)

### Backend
- Node.js + Express + TypeScript
- Runtime: tsx (with tsx watch for dev)
- Validation: Zod
- ORM: Prisma 6 (important: NOT v7)
- Database: PostgreSQL (local, pgAdmin for GUI)

### Not yet implemented
- Auth (planned: JWT inside HttpOnly cookies)
- Redis (planned for caching/leaderboards later)
- Docker (planned for deployment, not Phase 1)

---

## Repository Structure

```
habit-rpg/
├── frontend/         # Vite + React app
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── ActivityForm.tsx
│   │   └── types.ts
│   ├── .env          # VITE_API_URL=http://localhost:3000
│   ├── .env.example
│   └── .gitignore
├── backend/          # Express app
│   ├── features/
│   │   └── activities/
│   │       ├── activities.routes.ts
│   │       ├── activities.controller.ts
│   │       ├── activities.service.ts
│   │       ├── activities.repository.ts
│   │       └── activities.schema.ts
│   ├── shared/
│   │   └── prisma.ts         # Prisma singleton — imports from ../generated/prisma/client
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── generated/
│   │   └── prisma/           # Prisma generated client (gitignored)
│   │       └── client.ts     # Entry point for PrismaClient import
│   ├── index.ts              # Express app entry point
│   ├── tsconfig.json
│   ├── prisma.config.ts      # Prisma CLI config (reads DATABASE_URL from .env via dotenv)
│   ├── .env                  # DATABASE_URL (gitignored)
│   ├── .env.example
│   └── .gitignore
└── README.md
```

---

## Architecture

### Request Flow
```
Route → Schema (Zod) → Controller → Service → Repository → Database
```

### Layer Responsibilities
- **Routes** — map HTTP method + URL to controller handler only
- **Schema** — Zod validation of request body at entry point
- **Controller** — receive request, call service, send response. Knows HTTP. No business logic.
- **Service** — business logic only. No HTTP. No req/res.
- **Repository** — database access only. No business logic. No HTTP.

### Naming Convention
Files are prefixed with feature name: `activities.controller.ts`, not `controller.ts`

---

## Database

- PostgreSQL running locally
- Database name: `habit-rpg` (hyphen, not underscore — intentional choice)
- Connection via `DATABASE_URL` in `.env`
- Prisma client imported from `../generated/prisma/client` (custom output path in schema.prisma)

### Current Models

```prisma
model ActivityLog {
  id        Int      @id @default(autoincrement())
  category  String
  activity  String
  note      String?
  xpEarned  Int
  timestamp DateTime @default(now())
}
```

---

## Current Implementation Status

### Frontend
- ✅ Vite + React + TypeScript running
- ✅ Tailwind installed
- ✅ `App.tsx` manages `isOpen` state for modal
- ✅ "Add Activity" button toggles modal
- ✅ `ActivityForm` component with controlled inputs
- ✅ `handleActivityChange` — generic handler using `[e.target.name]` computed key
- ✅ `handleSubmit` — async, preventDefault, try/catch, posts to backend
- ✅ `emptyActivityEntry` const defined outside component for reuse/reset
- ✅ `ActivityFormProps` and `ActivityEntry` interfaces in `src/types.ts`
- ✅ Form posts JSON to `${VITE_API_URL}/activities`

### Backend
- ✅ Express running via `tsx watch index.ts`
- ✅ `GET /health` returns `{ ok: true }`
- ✅ `POST /activities` route wired to controller
- ✅ `express.json()` middleware for body parsing
- ✅ `cors()` middleware
- ✅ Zod schema validates `category` (required, min 1, trim), `activity` (required, min 1, trim), `note` (optional, trim)
- ✅ Controller validates with `safeParse`, returns 400 on failure, logs error server-side
- ✅ Service calculates XP: base 100, +50 if note filled, +1000 if note === "Neymar JR" (easter egg)
- ✅ Service calls repository and returns saved result
- ✅ Repository saves to `ActivityLog` table using `prisma.activityLog.create()`
- ✅ Prisma singleton in `shared/prisma.ts`
- ✅ Migration `init` applied — `ActivityLog` table exists in DB

### Currently In Progress
- ⚠️ Controller needs to `await` the now-async `calculateActivity` service call
- ⚠️ Controller needs try/catch around the service/repository call for database error handling

---

## XP System

- Stored: `totalXp` on User (not yet implemented)
- Calculated: level derived from XP formula (not yet implemented)
- Current: XP calculated per activity log entry in service layer
- Formula: base 100 + 50 if note filled + 1000 if note === "Neymar JR"
- Reason for formula approach: easy to rebalance without migrations

---

## Entity Model (Planned)

- **User** — id, username, email, passwordHash, totalXp
- **Category** — examples: Learning, Fitness, Reading
- **Activity** — belongs to Category, has XP reward
- **ActivityLog** — userId, activityId, timestamp, xpEarned, optionalNote (currently simplified: stores category/activity as strings until User entity exists)
- **Squad** — group of users for social features
- **squad_members** — join table (to be built as join table from the start, not added later)

---

## Key Decisions & Rationale

- **Express over NestJS** — deliberate choice to learn manual wiring before framework abstractions
- **Prisma 6 over Prisma 7** — v7 too new, less community documentation, breaking config changes
- **Prisma over TypeORM/Sequelize** — cleanest TypeScript integration, best migration workflow
- **`import from '../generated/prisma/client'`** — NOT `@prisma/client`, because schema.prisma has custom output path
- **No `globalThis` singleton pattern** — not needed for Express (tsx watch restarts whole process, unlike Next.js hot reload)
- **`safeParse` over `parse`** — controlled error handling, never leak internal errors to client
- **`note` is optional** — in both Zod schema (`z.string().optional()`) and Prisma model (`String?`)
- **`squad_members` as join table from day one** — avoids painful migration later

---

## Immediate Next Steps

1. Update controller to `await calculateActivity()` and wrap in try/catch
2. Test full flow: form submit → validation → XP calc → save to DB → response
3. Verify in pgAdmin that rows are being inserted into `ActivityLog`
4. Build `GET /activities` endpoint to read all entries
5. Display entries on frontend after each submit (running list)

---

## Tech Lead Rules (Claude's Role)

- Guide only, do not write code directly
- Give syntax snippets only when the developer is stuck
- Linear progression — don't context switch between unrelated layers
- Ask for approval before any new install, import, or logic change
- Project should be challenging but not discouraging
- Conventional commits at each done-condition milestone
- Always recommend the professional, standard approach
