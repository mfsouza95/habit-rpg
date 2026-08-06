# Auth Specification

## Purpose

Give users a way to create an account and sign in so their activity logs, XP, and squads are tied to them. Uses JWT tokens stored in HttpOnly cookies for secure, browser-friendly sessions.

## Requirements

### Requirement: Register
The system SHALL let a user create an account with a username, email, and password.

#### Scenario: Successful registration
- **WHEN** a user submits a valid username, email, and password
- **THEN** the system creates the account, hashes the password, and signs the user in

#### Scenario: Existing email or username
- **WHEN** a user submits an email or username that is already registered
- **THEN** the system rejects the registration with a conflict error

#### Scenario: Weak password
- **WHEN** a user submits a password that does not meet the minimum requirements
- **THEN** the system rejects the registration with a validation error

### Requirement: Login
The system SHALL authenticate an existing user and start a session.

#### Scenario: Correct credentials
- **WHEN** a user submits the correct email and password
- **THEN** the system verifies the credentials and issues a session

#### Scenario: Incorrect credentials
- **WHEN** a user submits an unknown email or wrong password
- **THEN** the system rejects the login without revealing which field was wrong

### Requirement: Session via JWT in HttpOnly cookie
The system SHALL maintain authenticated sessions using a JWT stored in an HttpOnly cookie.

#### Scenario: Issuing the token
- **WHEN** a user successfully logs in or registers
- **THEN** the system sets a JWT in an HttpOnly cookie on the response

#### Scenario: Reading the token
- **WHEN** a subsequent request carries the cookie
- **THEN** the system reads and verifies the JWT to identify the user

### Requirement: Protect routes
The system SHALL require authentication for routes that operate on a user's data.

#### Scenario: Authenticated access
- **WHEN** an authenticated user calls a protected endpoint
- **THEN** the system allows the request and identifies the user from the session

#### Scenario: Missing or invalid token
- **WHEN** a request without a valid session hits a protected endpoint
- **THEN** the system responds with an unauthorized error

### Requirement: Logout
The system SHALL end a user's session on request.

#### Scenario: Clearing the session
- **WHEN** an authenticated user logs out
- **THEN** the system clears the session cookie so subsequent requests are unauthenticated
