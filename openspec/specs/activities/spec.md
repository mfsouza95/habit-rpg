# Activities Specification

## Purpose

Let users log real-world activities and receive XP for them. This is the core habit-tracking loop: submit an activity, get it validated, scored, and persisted, then see the running history.

## Requirements

### Requirement: Health check
The system SHALL expose a health endpoint that reports whether the API is reachable.

#### Scenario: Healthy API
- **WHEN** a client requests `GET /health`
- **THEN** the system responds with `{ ok: true }`

### Requirement: Log an activity
The system SHALL accept a new activity log entry from the frontend.

#### Scenario: Valid submission
- **WHEN** a client sends `POST /activities` with valid `category`, `activity`, and optional `note`
- **THEN** the system validates the input, calculates the XP earned, persists the entry, and returns the saved result

#### Scenario: Missing required field
- **WHEN** a client sends `POST /activities` without a required field (`category` or `activity`)
- **THEN** the system responds with a 400 validation error and does not persist anything

### Requirement: Validate activity input
The system SHALL validate activity submissions with Zod before processing.

#### Scenario: Whitespace-only values
- **WHEN** a client submits a `category` or `activity` consisting only of whitespace
- **THEN** the system treats it as invalid and responds with a 400 error

#### Scenario: Optional note
- **WHEN** a client omits `note` or sends it as an empty string
- **THEN** the system accepts the submission with the note treated as optional

### Requirement: Calculate XP per entry
The system SHALL compute the XP earned for each activity log entry.

#### Scenario: Base entry
- **WHEN** a valid activity is logged
- **THEN** the system awards base XP of 100

#### Scenario: Note bonus
- **WHEN** a logged activity includes a filled `note`
- **THEN** the system awards an additional 50 XP

#### Scenario: Easter egg bonus
- **WHEN** the `note` is exactly "Neymar JR"
- **THEN** the system awards an additional 1000 XP

### Requirement: Persist activity logs
The system SHALL store each validated activity log in the `ActivityLog` table.

#### Scenario: Successful save
- **WHEN** a valid activity is processed
- **THEN** the system creates a row with `category`, `activity`, optional `note`, `xpEarned`, and a `timestamp` defaulting to now

#### Scenario: Server error
- **WHEN** the database write fails
- **THEN** the system responds with a 500 error and does not leak internal error details

### Requirement: List activities
The system SHALL return the running history of logged activities.

#### Scenario: Retrieve all entries
- **WHEN** a client requests `GET /activities`
- **THEN** the system returns the list of activity log entries ordered by most recent first

#### Scenario: Empty history
- **WHEN** a client requests `GET /activities` and no entries exist
- **THEN** the system returns an empty list

#### Scenario: Server error
- **WHEN** the database read fails
- **THEN** the system responds with a 500 error and does not leak internal error details

### Requirement: Follow the layered architecture
The system SHALL implement each activity endpoint across the documented layers: route, Zod schema, controller, service, and repository.

#### Scenario: Request flow
- **WHEN** an activity request reaches the backend
- **THEN** it flows Route -> Schema -> Controller -> Service -> Repository, with each layer responsible only for its documented concern
