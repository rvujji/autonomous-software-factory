# AiHarness Finding & Suggestion Model

## Purpose

Defines how engineering findings become engineering improvements.

AiHarness shall not stop after detecting defects.

It shall guide knowledge toward completion.

## Finding

A Finding represents a detected engineering issue.

### Properties

- Finding ID
- Rule
- Severity
- Target Artifact
- Evidence
- Explanation
- Recommendation
- Status

## Suggestion

A Suggestion represents a proposed correction.

### Properties

- Suggestion ID
- Source Finding
- Target Artifact
- Target Section
- Suggested Patch
- Rationale
- Confidence
- Status

## Knowledge Patch

A Knowledge Patch represents an approved modification.

### Properties

- Patch ID
- Target Artifact
- Patch Contents
- Linked Suggestion
- Approval
- Version
- Applied Date

## Approval Workflow

```text
Finding
  ↓
Suggestion
  ↓
Human Approval
  ↓
Knowledge Patch
  ↓
Document Updated
  ↓
Re-review
  ↓
Freeze
```

## Suggestion Lifecycle

```text
Created
  ↓
Reviewed
  ↓
Approved
  ↓
Rejected
  ↓
Applied
  ↓
Verified
  ↓
Archived
```

## Patch Rules

A patch shall:

- Modify one artifact.
- Identify target section.
- Preserve traceability.
- Preserve history.
- Create a new artifact version.

## Knowledge Completion Loop

```text
Read Knowledge
  ↓
Review
  ↓
Findings
  ↓
Suggestions
  ↓
Approval
  ↓
Patch
  ↓
Updated Knowledge
  ↓
Review
  ↓
Freeze
```

This loop continues until no Critical or Major findings remain.
