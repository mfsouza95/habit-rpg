## 1. Backend list endpoint

- [x] 1.1 Add `findActivities()` to `activities.repository.ts` returning all rows ordered by `timestamp` desc
- [x] 1.2 Add `getActivities()` to `activities.service.ts` delegating to the repository
- [x] 1.3 Add `listActivities` controller to `activities.controller.ts` with try/catch returning 500 on failure
- [x] 1.4 Register `GET /` on the activities router

## 2. Backend tests

- [x] 2.1 Repository test: returns rows ordered most recent first; returns `[]` when empty
- [x] 2.2 Controller test: returns the list; returns 500 when the service throws

## 3. Frontend list + UX

- [x] 3.1 Add `Activity` interface to `types.ts`
- [x] 3.2 Create `src/components/ActivityList.tsx` (rows + empty state)
- [x] 3.3 `App.tsx`: hold `activities` state, fetch on mount via `useEffect`, render `ActivityList`, pass `onSubmitted` to `ActivityForm`
- [x] 3.4 `ActivityForm.tsx`: add `onSubmitted` prop, reset + close on success, inline error on failure, disable submit while in flight

## 4. Frontend tests

- [x] 4.1 `ActivityList.test.tsx`: renders entries with category/activity/note/xpEarned/timestamp; shows empty state
- [x] 4.2 `App.test.tsx`: renders fetched entries on mount
- [x] 4.3 `ActivityForm.test.tsx`: calls `onSubmitted` + resets + closes on success; shows error on failure; disables submit while pending

## 5. Verification

- [x] 5.1 Run backend `pnpm test`
- [x] 5.2 Run frontend `pnpm test`, `pnpm lint`, `pnpm build`
