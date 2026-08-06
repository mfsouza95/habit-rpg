# Project Baseline Specification

## Purpose

Snapshot of the current implementation state of the Habit RPG app: which data models, backend layers, frontend components, and UI structure exist today, and what is still to come. Each requirement is tagged **(Complete)** when implemented and verified, or **(TODO)** when it does not exist yet. Requirements are ordered by area (data models, backend, frontend/UI, progression and social) so the list reads as the full picture. This is the reference for what "done" means today and the starting point for new changes.
## Requirements
### Requirement: ActivityLog model (Complete)
The system SHALL store activity log entries in an `ActivityLog` table with `id`, `category`, `activity`, optional `note`, `xpEarned`, and `timestamp`.

#### Scenario: Schema applied
- **WHEN** the database is initialized
- **THEN** the `ActivityLog` table exists in PostgreSQL via the `init` migration

#### Scenario: Row shape
- **WHEN** a row is written
- **THEN** it has an auto-incrementing integer `id`, string `category`, string `activity`, nullable `note`, integer `xpEarned`, and a `timestamp` defaulting to the current time

### Requirement: User model (TODO)
The system SHALL have a User model with `id`, `username`, `email`, `passwordHash`, and `totalXp`. It does not exist yet.

#### Scenario: Planned entity
- **WHEN** the user feature is implemented
- **THEN** a User model with `id`, `username`, `email`, `passwordHash`, and `totalXp` exists

### Requirement: Category model (TODO)
The system SHALL have a Category model (examples: Learning, Fitness, Reading) with an XP reward. It does not exist yet.

#### Scenario: Planned entity
- **WHEN** the category feature is implemented
- **THEN** a Category model with a name and an XP reward exists

### Requirement: Activity model (TODO)
The system SHALL have an Activity model that belongs to a Category and carries an XP reward. It does not exist yet.

#### Scenario: Planned entity
- **WHEN** the activity catalog is implemented
- **THEN** an Activity model exists that belongs to a Category and carries an XP reward

### Requirement: Squad model (TODO)
The system SHALL have a Squad model representing a group of users. It does not exist yet.

#### Scenario: Planned entity
- **WHEN** the squad feature is implemented
- **THEN** a Squad model exists representing a group of users

### Requirement: squad_members join table (TODO)
The system SHALL track squad membership in a `squad_members` join table, built from day one to avoid a retrofit migration. It does not exist yet.

#### Scenario: Planned entity
- **WHEN** the squad feature is implemented
- **THEN** a `squad_members` join table exists linking users to squads

### Requirement: Express entry point (Complete)
The system SHALL boot an Express server that reads environment variables before anything else.

#### Scenario: Startup
- **WHEN** the backend starts
- **THEN** `dotenv/config` is imported first so `DATABASE_URL` is available, and the app listens on port 3000

#### Scenario: Middleware
- **WHEN** requests arrive
- **THEN** CORS and JSON body parsing are applied

### Requirement: Health check endpoint (Complete)
The system SHALL expose `GET /health` that reports whether the API is reachable.

#### Scenario: Healthy API
- **WHEN** a client requests `GET /health`
- **THEN** the system responds with `{ ok: true }`

### Requirement: Activities layered architecture (Complete)
The system SHALL implement the activities endpoint across the documented layers: route, Zod schema, controller, service, and repository.

#### Scenario: Request flow
- **WHEN** a `POST /activities` request reaches the backend
- **THEN** it flows Route -> Schema -> Controller -> Service -> Repository, with each layer handling only its documented concern

#### Scenario: Route registration
- **WHEN** the app starts
- **THEN** the activities router is mounted under `/activities` and maps `POST /` and `GET /` to their controllers

### Requirement: Zod request validation (Complete)
The system SHALL validate activity submissions with a Zod schema before processing.

#### Scenario: Valid submission
- **WHEN** a client submits `category` and `activity` as non-empty trimmed strings and an optional trimmed `note`
- **THEN** validation passes and processing continues

#### Scenario: Invalid submission
- **WHEN** a client omits a required field or sends only whitespace
- **THEN** the controller returns a 400 with a generic error and nothing is persisted

### Requirement: XP calculation in service (Complete)
The system SHALL compute XP earned per activity entry in the service layer.

#### Scenario: Base entry
- **WHEN** a valid activity is logged
- **THEN** the service awards 100 base XP

#### Scenario: Note bonus
- **WHEN** the entry has a non-empty `note`
- **THEN** the service adds 50 XP

#### Scenario: Easter egg bonus
- **WHEN** the `note` is exactly "Neymar JR"
- **THEN** the service adds a further 1000 XP

### Requirement: Prisma persistence (Complete)
The system SHALL persist validated activity logs through the repository using the Prisma client.

#### Scenario: Successful save
- **WHEN** the service passes a validated entry with `xpEarned`
- **THEN** the repository creates a row in `ActivityLog` and returns the saved record

#### Scenario: Server error
- **WHEN** the database write fails
- **THEN** the controller returns a 500 with a generic error and no internal details leak

### Requirement: Prisma singleton and config (Complete)
The system SHALL share one Prisma client and configure the Prisma CLI consistently.

#### Scenario: Singleton import
- **WHEN** a feature needs the database
- **THEN** it imports the client from `shared/prisma`, which instantiates `PrismaClient` from `../generated/prisma/client` (the custom generated output, not `@prisma/client`)

#### Scenario: CLI config
- **WHEN** the Prisma CLI runs
- **THEN** `prisma.config.ts` supplies the schema path, migrations path, classic engine, and `DATABASE_URL`

### Requirement: List activities endpoint (Complete)
The system SHALL expose `GET /activities` returning the running history of logged activities, ordered most recent first.

#### Scenario: Retrieve all entries
- **WHEN** a client requests `GET /activities`
- **THEN** the system returns the activity log entries ordered most recent first

#### Scenario: Empty history
- **WHEN** a client requests `GET /activities` and no entries exist
- **THEN** the system returns an empty list

#### Scenario: Server error
- **WHEN** the database read fails
- **THEN** the system responds with a 500 error and does not leak internal error details

### Requirement: App shell (Complete)
The system SHALL render an app shell with a full-screen centered container.

#### Scenario: Initial render
- **WHEN** the app loads
- **THEN** a bordered centered container is shown with an "Add Activity" button

### Requirement: Activity modal toggle (Complete)
The system SHALL open and close the activity form modal from the shell.

#### Scenario: Opening
- **WHEN** the user clicks "Add Activity"
- **THEN** `isOpen` is set true and the `ActivityForm` modal renders

#### Scenario: Closing
- **WHEN** the user clicks "Close" in the form
- **THEN** the modal unmounts

### Requirement: ActivityForm component (Complete)
The system SHALL provide a modal form component with controlled category, activity, and note inputs.

#### Scenario: Controlled inputs
- **WHEN** the user types in any field
- **THEN** the single generic `handleActivityChange` updates state using the input's `name` as a computed key

#### Scenario: Reset constant
- **WHEN** the component initializes
- **THEN** form state starts from the shared `emptyActivityEntry` constant

#### Scenario: Reset after submit
- **WHEN** a submit succeeds
- **THEN** the form state is reset to the shared `emptyActivityEntry` constant

#### Scenario: In-flight submission
- **WHEN** a submit request is pending
- **THEN** the submit button is disabled

### Requirement: Activity submission to backend (Complete)
The system SHALL submit activity entries to the backend on form submit.

#### Scenario: End-to-end POST
- **WHEN** the user submits the form
- **THEN** the frontend POSTs JSON to `${VITE_API_URL}/activities` with a JSON content type

#### Scenario: Successful submission
- **WHEN** the POST succeeds
- **THEN** the created record is reported to the shell so the running list updates and the modal closes

#### Scenario: Failed submission
- **WHEN** the POST fails
- **THEN** the frontend surfaces the error in the UI instead of only logging it

### Requirement: Shared types (Complete)
The system SHALL define shared frontend types for activities.

#### Scenario: Type contract
- **WHEN** the form, list, or shell needs activity data
- **THEN** `ActivityEntry`, `Activity`, and `ActivityFormProps` (`setIsOpen`, `onSubmitted`) are available from `types.ts`

### Requirement: Tailwind styling (Complete)
The system SHALL style the UI with Tailwind CSS v4.

#### Scenario: Styling applied
- **WHEN** the frontend builds
- **THEN** Tailwind is imported via `@import "tailwindcss"` in both `App.css` and `index.css`, and the page background is dark

### Requirement: Running activity list (Complete)
The system SHALL display logged activity entries as a running list on the frontend, loaded on mount and updated after each submit.

#### Scenario: Initial load
- **WHEN** the app loads
- **THEN** the running list shows the persisted activity entries

#### Scenario: After submit
- **WHEN** the user submits a new activity successfully
- **THEN** the new entry appears in the running list

#### Scenario: Empty history
- **WHEN** no activities have been logged
- **THEN** the list shows an empty-state message

### Requirement: ActivityList component (Complete)
The system SHALL render the running list of activities with each entry's category, activity, optional note, XP earned, and timestamp.

#### Scenario: Render entries
- **WHEN** the component receives activity entries
- **THEN** each row shows the category, activity, optional note, XP earned, and timestamp

#### Scenario: Empty state
- **WHEN** there are no entries
- **THEN** the component shows an empty-state message

### Requirement: Authentication (TODO)
The system SHALL support user registration, login, sessions via JWT in an HttpOnly cookie, protected routes, and logout. It does not exist yet.

#### Scenario: Planned auth flow
- **WHEN** the auth feature is implemented
- **THEN** users can register, log in, and access protected routes via a JWT in an HttpOnly cookie

### Requirement: XP accumulation and levels (TODO)
The system SHALL accumulate `totalXp` on the User and derive levels from a rebalance-friendly XP formula. It does not exist yet.

#### Scenario: Planned progression
- **WHEN** the progression feature is implemented
- **THEN** earned XP accumulates in `totalXp` and the level is derived from a configurable formula

### Requirement: Categories and per-category XP (TODO)
The system SHALL organize activities into Categories and award XP from the category's reward. It does not exist yet.

#### Scenario: Planned categories
- **WHEN** the category feature is implemented
- **THEN** activities reference a Category and earn XP according to that category's reward

### Requirement: Squads and membership (TODO)
The system SHALL support squads of users connected via a `squad_members` join table. It does not exist yet.

#### Scenario: Planned squads
- **WHEN** the squad feature is implemented
- **THEN** users can join squads and membership is tracked in the `squad_members` join table

