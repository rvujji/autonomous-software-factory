# AiHarness Review Profile Model

## Purpose

Defines reusable review configurations.

Instead of hardcoding reviews, AiHarness executes a Review Profile.

## Example

```text
Architecture Review
  ↓
Rule Packs
  ↓
Evidence Collection
  ↓
Analysis
  ↓
Findings
  ↓
Suggestions
  ↓
Report
```

## Review Profile

A Review Profile contains:

- Profile ID
- Name
- Target Artifact Types
- Applicable Rule Packs
- Evidence Sources
- Review Sequence
- Severity Rules
- Report Template
- Completion Criteria

## Standard Profiles

- Knowledge Review
- Architecture Review
- BRD Review
- Domain Review
- Lifecycle Review
- Graph Review
- Capability Review
- Engine Review
- API Review
- Database Review
- React Web Review
- React Native Review
- Security Review
- Testing Review
- Release Review
- Compliance Review

## Review Pipeline

```text
Select Profile
  ↓
Collect Evidence
  ↓
Load Rule Packs
  ↓
Execute Rules
  ↓
Generate Findings
  ↓
Generate Suggestions
  ↓
Generate Report
```

## Extensibility

Profiles are configuration.

New review types should be created by composing Rule Packs rather than modifying AiHarness.
