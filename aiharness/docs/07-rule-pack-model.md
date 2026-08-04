# AiHarness Rule Pack Model

## Purpose

Defines reusable engineering review rules.

Rules are independent of Review Profiles.

A Rule Pack may be reused by multiple profiles.

## Rule Pack Structure

Each Rule Pack contains:

- Rule Pack ID
- Name
- Purpose
- Applicable Artifact Types
- Rules
- Severity Mapping
- Dependencies
- Version

## Example Rule Packs

- Constitution Compliance
- Terminology Consistency
- Ownership Validation
- Lifecycle Validation
- Traceability Validation
- Architecture Layering
- Dependency Validation
- Circular Dependency Detection
- UI Completeness
- API Completeness
- Database Standards
- Security Standards
- Testing Standards
- Documentation Standards
- React Standards
- React Native Standards
- FastAPI Standards
- PostgreSQL Standards

## Rule

Each rule defines:

- Rule ID
- Description
- Severity
- Evaluation Logic
- Evidence Required
- Failure Message
- Suggested Improvement Template

## Rule Execution

```text
Artifact
  ↓
Applicable Rule Packs
  ↓
Rules
  ↓
Findings
  ↓
Suggestions
```

## Rule Priorities

- Critical
- Major
- Minor
- Informational
- Recommendation

## Rule Versioning

Rules evolve independently.

Historical reviews preserve the rule versions used during evaluation.
