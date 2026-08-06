# Users Specification

## Purpose

Introduce the User entity that anchors the whole app: an identity with a username, email, credentials hash, and an accumulated XP total. Every activity log, squad, and progression value eventually belongs to a user.

## Requirements

### Requirement: User entity
The system SHALL have a User entity with `id`, `username`, `email`, `passwordHash`, and `totalXp`.

#### Scenario: Creating a user
- **WHEN** a user is created
- **THEN** the system assigns a unique id, stores the username, email, and password hash, and initializes `totalXp` to 0

### Requirement: Unique username and email
The system SHALL reject users with a duplicate `username` or `email`.

#### Scenario: Duplicate email
- **WHEN** a registration attempts to use an email already in use
- **THEN** the system rejects the registration with a conflict error

#### Scenario: Duplicate username
- **WHEN** a registration attempts to use a username already in use
- **THEN** the system rejects the registration with a conflict error

### Requirement: User profile
The system SHALL expose a user's profile including their username and total XP.

#### Scenario: View own profile
- **WHEN** an authenticated user views their profile
- **THEN** the system returns their username and current `totalXp`

### Requirement: Track total XP
The system SHALL store `totalXp` on the User as the running sum of XP earned from activity logs.

#### Scenario: XP accumulation
- **WHEN** a user earns XP from a logged activity
- **THEN** the system adds that XP to the user's `totalXp`

### Requirement: Link activity logs to users
The system SHALL associate each activity log with the user who logged it.

#### Scenario: Ownership
- **WHEN** a user logs an activity
- **THEN** the activity log records the user's id

#### Scenario: Unauthenticated state
- **WHEN** no authenticated user is associated with a request that creates an activity log
- **THEN** the system rejects the request until the user model and auth are in place
