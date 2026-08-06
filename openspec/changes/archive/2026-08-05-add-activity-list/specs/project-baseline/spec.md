## MODIFIED Requirements

### Requirement: List activities endpoint (TODO)
The system SHALL expose `GET /activities` returning the running history of logged activities, ordered most recent first.

#### Scenario: Planned endpoint
- **WHEN** the list feature is implemented
- **THEN** `GET /activities` returns logged activities ordered most recent first

#### Scenario: Retrieve all entries
- **WHEN** a client requests `GET /activities`
- **THEN** the system returns the activity log entries ordered most recent first

#### Scenario: Empty history
- **WHEN** a client requests `GET /activities` and no entries exist
- **THEN** the system returns an empty list

#### Scenario: Server error
- **WHEN** the database read fails
- **THEN** the system responds with a 500 error and does not leak internal error details

### Requirement: Running activity list (TODO)
The system SHALL display logged activity entries as a running list on the frontend, loaded on mount and updated after each submit.

#### Scenario: Planned list
- **WHEN** the list feature is implemented
- **THEN** submitted activities are displayed as a running list on the frontend after each submit

#### Scenario: Initial load
- **WHEN** the app loads
- **THEN** the running list shows the persisted activity entries

#### Scenario: After submit
- **WHEN** the user submits a new activity successfully
- **THEN** the new entry appears in the running list

#### Scenario: Empty history
- **WHEN** no activities have been logged
- **THEN** the list shows an empty-state message

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

## ADDED Requirements

### Requirement: ActivityList component (Complete)
The system SHALL render the running list of activities with each entry's category, activity, optional note, XP earned, and timestamp.

#### Scenario: Render entries
- **WHEN** the component receives activity entries
- **THEN** each row shows the category, activity, optional note, XP earned, and timestamp

#### Scenario: Empty state
- **WHEN** there are no entries
- **THEN** the component shows an empty-state message
