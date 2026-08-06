## Context

See `proposal.md` — Why. The backend already implements the full `POST /activities` chain (route → Zod schema → controller → service → repository → Prisma). The `ActivityLog` table exists with a `timestamp` column. The frontend is component-level `useState` only (no global state), and `ActivityForm` owns its own submit logic.

## Goals / Non-Goals

**Goals:**
- Read path for activities that mirrors the existing write path layer for layer.
- Running list rendered on the frontend, updated on mount and after each successful submit.
- Form UX: reset + close on success, visible error on failure, disabled submit while in flight.

**Non-Goals:**
- No pagination, filtering, or user scoping (no User/auth yet).
- No delete/update of activities.
- No global state management (kept as component `useState`).

## Decisions

- **Backend ordering by `timestamp` desc**: the repository uses `prisma.activityLog.findMany({ orderBy: { timestamp: 'desc' } })` so the newest entry appears first. Alternative (sort in the controller) was rejected — ordering is data concern, stays in the repository.
- **New service/repository/controller functions**: `getActivities()` (service) → `findActivities()` (repository), `listActivities` (controller) — consistent with existing `calculateActivity` / `saveActivity` / `createActivity` naming.
- **Lift activity state to `App`**: `App` holds `activities: Activity[]`, fetches on mount via `useEffect`, and passes `onSubmitted` to `ActivityForm`. The shell appends the created record to the list and closes the modal. Alternative (ActivityList self-fetches) adds a second fetch and a refetch signal — more moving parts for no benefit at this size.
- **`ActivityList` is presentational**: receives `activities` as a prop and renders rows (category, activity, optional note, `xpEarned`, timestamp) or an empty-state message.
- **Form behavior**: `ActivityFormProps` gains `onSubmitted: (activity: Activity) => void`. On success: call `onSubmitted`, reset to `emptyActivityEntry`, and close via `setIsOpen(false)`. On failure: set an `error` state rendered inline. A `submitting` state disables the Submit button.
- **Shared `Activity` type**: added to `types.ts` mirroring the persisted `ActivityLog` shape (`note: string | null`, `timestamp: string`).

## Risks / Trade-offs

- **Stale list on concurrent inserts** → acceptable: single user, `App` refetches on mount and appends on submit; no polling.
- **Error message only reflects the HTTP status** → mitigated by generic copy; internal details are never shown (consistent with backend behavior).
- **Modal closing on success hides the result** → the new entry appears at the top of the running list, and each row shows `xpEarned`.
