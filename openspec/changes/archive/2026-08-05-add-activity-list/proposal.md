## Why

The core loop is incomplete: users can log activities and get XP, but there is no way to see what has been logged. The frontend POSTs entries and `console.log`s the response but never renders it. This change closes the loop by adding a read path and surfacing the running history in the UI, which is the documented immediate next step in `project-context.md`.

## What Changes

- **Backend `GET /activities`** — new route, controller, service, and repository method returning all `ActivityLog` rows ordered most recent first (empty history returns an empty list).
- **Frontend running list** — `App` fetches activities on mount and renders them via a new `ActivityList` component (category, activity, note, `xpEarned`, timestamp) with an empty state.
- **Form UX** — on successful submit the form resets to the empty entry, closes the modal, and the new entry appears in the list; on failure the error is surfaced in the UI instead of swallowed; the submit button is disabled while the request is in flight.
- **Shared types** — new `Activity` interface describing a persisted log entry.

## Capabilities

### New Capabilities
- none (no new capability spec; behavior fits existing specs)

### Modified Capabilities
- `project-baseline`: flip *List activities endpoint* and *Running activity list* from TODO to Complete; add the new `ActivityList` component and the form UX behaviors (reset/close on success, error surfacing, in-flight disable) as completed requirements.

## Impact

- Backend: `features/activities/` (routes, controller, service, repository) — no schema change, no migration.
- Frontend: `src/App.tsx`, new `src/components/ActivityList.tsx`, `src/components/ActivityForm.tsx`, `types.ts`.
- Tests: extend backend suite (repository/controller for the list endpoint) and frontend suite (`App`, `ActivityList`, `ActivityForm`).
- No new dependencies.
