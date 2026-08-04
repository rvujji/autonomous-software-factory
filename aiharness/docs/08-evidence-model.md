# AiHarness

# Evidence Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Evidence Model defines how AiHarness gathers, evaluates, records, and presents evidence when performing engineering reviews.

Every review conclusion produced by AiHarness shall be supported by explicit engineering evidence.

AiHarness shall never produce unsupported findings, assumptions, or recommendations.

Engineering governance must be evidence-driven.

---

# 2. Philosophy

Engineering decisions must be explainable.

Every conclusion shall answer:

* Why was this finding generated?
* Which artifacts support it?
* Which rules were evaluated?
* Which evidence was collected?
* How was the conclusion reached?

Evidence transforms AI reasoning into an auditable engineering process.

---

# 3. Evidence Principles

Every finding shall satisfy the following principles.

* Evidence before conclusion.
* Multiple evidence sources whenever possible.
* Traceable evidence.
* Reproducible conclusions.
* Explainable reasoning.
* Immutable review history.
* Human-verifiable references.

---

# 4. Core Concepts

## Evidence

Evidence represents factual information used during a review.

Evidence is not an opinion.

Evidence is derived from engineering artifacts.

---

## Evidence Source

Evidence may originate from:

* Requirements
* BRDs
* Architecture Documents
* Domain Models
* Engine Specifications
* API Specifications
* UI Specifications
* Security Specifications
* Test Specifications
* Source Code
* Database Schema
* Configuration
* Previous Reviews
* Approved Decisions
* Standards
* Constitution
* Rule Packs

---

## Evidence Set

An Evidence Set contains all evidence collected for evaluating a specific rule.

Each Evidence Set represents the factual basis for one engineering conclusion.

---

# 5. Evidence Lifecycle

Evidence follows the lifecycle below.

```text
Discovered

↓

Collected

↓

Validated

↓

Referenced

↓

Archived
```

Evidence is immutable once referenced by a completed review.

---

# 6. Evidence Categories

## Knowledge Evidence

Supports findings related to engineering knowledge.

Examples

* Requirement definitions
* Business rules
* Architecture sections
* Domain concepts

---

## Structural Evidence

Supports findings related to engineering structure.

Examples

* Dependencies
* Relationships
* Ownership
* Layering
* Lifecycles

---

## Implementation Evidence

Supports implementation reviews.

Examples

* Source files
* APIs
* Database objects
* Components
* Tests

---

## Governance Evidence

Supports governance validation.

Examples

* Constitution
* Policies
* Standards
* Rule Packs

---

## Historical Evidence

Supports comparison across versions.

Examples

* Previous reviews
* Previous decisions
* Previous patches
* Previous releases

---

# 7. Evidence Record

Every evidence item shall contain:

* Evidence ID
* Source Artifact
* Source Version
* Artifact Type
* Section Reference
* Rule Reference
* Context
* Collection Timestamp
* Confidence
* Reviewer

---

# 8. Evidence Collection

Evidence collection follows a deterministic process.

```text
Review Request

↓

Identify Applicable Rule Packs

↓

Determine Required Evidence

↓

Collect Evidence

↓

Validate Evidence

↓

Build Evidence Set

↓

Execute Review Rules
```

Rules shall not execute without sufficient evidence.

---

# 9. Evidence Resolution

AiHarness shall resolve evidence using traceability.

Example

```text
Requirement

↓

Architecture

↓

Domain Model

↓

Engine Specification

↓

Implementation

↓

Review

↓

Release
```

Evidence shall be collected across the complete engineering chain whenever applicable.

---

# 10. Evidence Correlation

A finding may require multiple evidence sources.

Example

Finding

Task Package ownership is missing.

Supporting Evidence

* Platform Architecture
* Domain Model
* Engine Catalog

AiHarness shall correlate evidence before generating findings.

---

# 11. Evidence Quality

Evidence shall be evaluated for quality.

Quality dimensions include:

* Completeness
* Relevance
* Consistency
* Authority
* Freshness
* Traceability

Low-quality evidence shall reduce review confidence.

---

# 12. Evidence Confidence

Every finding shall include an evidence confidence level.

| Confidence | Meaning                              |
| ---------- | ------------------------------------ |
| Very High  | Multiple authoritative sources agree |
| High       | Single authoritative source          |
| Medium     | Partial supporting evidence          |
| Low        | Limited evidence available           |
| Unknown    | Insufficient evidence                |

Confidence reflects evidence quality, not AI certainty.

---

# 13. Evidence-Based Findings

Every finding shall reference:

* Rule
* Evidence Set
* Conclusion
* Explanation
* Severity
* Recommendation

Findings without evidence are prohibited.

---

# 14. Evidence-Based Suggestions

Every improvement suggestion shall reference:

* Finding
* Supporting Evidence
* Proposed Change
* Expected Outcome
* Impact

Suggestions shall be derived from evidence rather than generated independently.

---

# 15. Missing Evidence

When required evidence cannot be located, AiHarness shall not guess.

Instead it shall generate a Missing Evidence Finding.

Example

Missing API Specification

Missing Security Requirement

Missing UI Error Flow

Missing Acceptance Criteria

Missing evidence is itself a review outcome.

---

# 16. Evidence Traceability

Every evidence item shall trace to:

* Source Artifact
* Source Version
* Rule Pack
* Review
* Finding
* Suggestion

Complete traceability shall be maintained throughout the review lifecycle.

---

# 17. Evidence Report

Every review report shall include an Evidence Summary.

Example

Review

Architecture Review

Evidence Collected

* Constitution
* Platform Architecture
* Domain Model
* Lifecycle Model
* Engine Catalog

Evidence Quality

High

Evidence Coverage

96%

Missing Evidence

2 Items

Findings

8

Suggestions

6

---

# 18. Evidence Invariants

The following conditions shall always remain true.

* Every finding references at least one Evidence Set.
* Every suggestion references one or more findings.
* Every Evidence Set references authoritative artifacts.
* Evidence is immutable once a review is completed.
* Missing evidence is explicitly reported.
* Review conclusions are reproducible using the same evidence.

Violation of these invariants invalidates the review.

---

# 19. Relationship to Other Documents

The Review Profile Model defines **what type of review is performed**.

The Rule Pack Model defines **which rules are evaluated**.

The Evidence Model defines **how factual information is collected and validated**.

The Finding & Suggestion Model defines **how evidence is transformed into engineering improvements**.

Together, these four models form the governance foundation of AiHarness.
