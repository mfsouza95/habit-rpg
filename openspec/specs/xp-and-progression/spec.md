# XP and Progression Specification

## Purpose

Make effort visible and rewarding: every logged activity earns XP that accumulates on the user, and the user's level is derived from their total XP. The formula lives in one place so it can be rebalanced without database migrations.

## Requirements

### Requirement: Earn XP per activity
The system SHALL award XP when a user logs an activity.

#### Scenario: Awarding XP
- **WHEN** a user logs a valid activity
- **THEN** the system credits the user with the XP earned for that entry

### Requirement: Accumulate total XP
The system SHALL keep a running `totalXp` total on the User.

#### Scenario: Multiple activities
- **WHEN** a user logs several activities
- **THEN** each award is added to the user's `totalXp`

### Requirement: Derive level from XP
The system SHALL calculate the user's level from their `totalXp` using a formula.

#### Scenario: Level up
- **WHEN** a user's `totalXp` crosses the threshold for the next level
- **THEN** the system reports the new level

#### Scenario: No progress lost
- **WHEN** a user earns XP between levels
- **THEN** the system preserves the surplus XP toward the next level

### Requirement: Rebalance-friendly formula
The system SHALL keep the XP formula configurable in one place so values can be tuned without migrations.

#### Scenario: Adjusting rewards
- **WHEN** XP values need to change
- **THEN** they are updated in code or configuration rather than via a database migration
