# Squads Specification

## Purpose

Add the social layer: users form squads with friends and see each other's progress. The `squad_members` join table is built from day one so the many-to-many relationship never requires a painful retrofit migration.

## Requirements

### Requirement: Squad entity
The system SHALL have a Squad entity representing a group of users.

#### Scenario: Creating a squad
- **WHEN** a user creates a squad
- **THEN** the system records the squad and makes the creator a member

### Requirement: Squad membership
The system SHALL track which users belong to which squad through a `squad_members` join table.

#### Scenario: Joining a squad
- **WHEN** a user joins a squad
- **THEN** the system adds a membership row linking the user to the squad

#### Scenario: Leaving a squad
- **WHEN** a user leaves a squad
- **THEN** the system removes the membership row

#### Scenario: Preventing duplicates
- **WHEN** a user is already a member of a squad
- **THEN** the system does not create a second membership for the same pair

### Requirement: View squad members
The system SHALL let a member see who belongs to their squad.

#### Scenario: Listing members
- **WHEN** a member views their squad
- **THEN** the system returns the squad's member list

### Requirement: Connect with friends
The system SHALL support squads as the mechanism for connecting with friends.

#### Scenario: Shared progress
- **WHEN** a user and their friends belong to the same squad
- **THEN** they can view each other's activity and XP progress within the squad context
