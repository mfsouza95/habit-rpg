# Categories Specification

## Purpose

Organize activities into named categories (for example Learning, Fitness, Reading) so habits are grouped and each category can carry its own XP reward. Categories replace the current free-text `category` string on activity logs.

## Requirements

### Requirement: Category entity
The system SHALL have a Category entity representing a named group of activities.

#### Scenario: Defining a category
- **WHEN** a category is defined
- **THEN** it has a name and an XP reward value

### Requirement: Built-in categories
The system SHALL seed a set of default categories such as Learning, Fitness, and Reading.

#### Scenario: Fresh database
- **WHEN** the database is first initialized
- **THEN** the default categories are present and available for activity logging

### Requirement: Activity belongs to a category
The system SHALL associate each activity with a Category.

#### Scenario: Logging a categorized activity
- **WHEN** a user logs an activity
- **THEN** the activity references its category instead of storing a free-text category string

#### Scenario: Unknown category
- **WHEN** a user logs an activity against a category that does not exist
- **THEN** the system rejects the submission with a validation error

### Requirement: Per-category XP reward
The system SHALL award XP based on the reward defined for the activity's category.

#### Scenario: Category-driven scoring
- **WHEN** an activity is logged
- **THEN** the XP earned reflects the category's configured reward
