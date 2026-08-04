# AiHarness

# Domain Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Domain Model defines the canonical governance concepts, entities, relationships, ownership, and invariants within AiHarness.

It establishes the common engineering language used throughout the platform.

This document defines **what governance concepts exist**, not **how they are implemented**.

---

# 2. Design Philosophy

AiHarness models engineering governance as a set of connected domain concepts.

Each concept has a single responsibility and explicit ownership.

The Domain Model remains independent of storage technology, programming language, and implementation details.

---

# 3. Domain Principles

The governance domain follows these principles.

* Every concept has one canonical meaning.
* Every entity has one owner.
* Every relationship is explicit.
* Every governance decision is traceable.
* Every engineering conclusion is evidence-based.
* Every engineering change follows governed workflows.

---

# 4. Core Domain Entities

The following entities constitute the AiHarness governance domain.

## Review

Represents a governed evaluation of one or more engineering artifacts.

A Review executes using one Review Profile.

A Review produces Findings.

---

## Review Profile

Defines how a Review shall be executed.

A Review Profile specifies:

* Applicable Rule Packs
* Required Evidence
* Execution Sequence
* Report Format

A Review references exactly one Review Profile.

---

## Rule Pack

A reusable collection of engineering rules.

Rule Packs may be shared across multiple Review Profiles.

Rule Packs remain independently versioned.

---

## Rule

A deterministic engineering validation rule.

Rules belong to exactly one Rule Pack.

Rules evaluate engineering evidence and produce rule results.

---

## Evidence

Represents authoritative engineering information supporting governance decisions.

Evidence is supplied through Shared Engineering Services.

Evidence is never created by AiHarness.

---

## Evidence Set

A collection of Evidence used during a Review.

Every Review operates on one or more Evidence Sets.

---

## Finding

Represents an engineering issue, observation, or validation result identified during a Review.

Every Finding references supporting Evidence.

---

## Suggestion

Represents a proposed engineering improvement generated from one or more Findings.

Suggestions are recommendations.

Suggestions do not modify engineering artifacts.

---

## Knowledge Patch

Represents an approved change to engineering knowledge.

Knowledge Patches implement approved Suggestions.

Knowledge Patches require human approval.

---

## Governance Report

Represents the outcome of a governance activity.

Reports summarize:

* Review Results
* Findings
* Suggestions
* Evidence Summary
* Compliance Status

---

# 5. Entity Relationships

The primary relationships are:

```text id="aih-domain-relationships"
Review
    │
    ├── uses ─────────► Review Profile
    │
    ├── evaluates ────► Evidence Set
    │
    ├── executes ─────► Rule Pack(s)
    │
    ├── produces ─────► Finding(s)
    │
    └── generates ────► Governance Report


Finding
    │
    ├── references ───► Evidence
    │
    └── produces ─────► Suggestion(s)


Suggestion
    │
    └── becomes ──────► Knowledge Patch
```

All relationships are governed by the Engineering Graph Model.

---

# 6. Aggregate Ownership

The governance aggregates are:

### Review Aggregate

Owns:

* Review
* Review Profile Reference
* Evidence Set Reference
* Rule Execution Results
* Findings
* Governance Report

---

### Rule Pack Aggregate

Owns:

* Rule Pack
* Rules

---

### Finding Aggregate

Owns:

* Finding
* Supporting Evidence References
* Suggestion References

---

### Knowledge Evolution Aggregate

Owns:

* Suggestion
* Knowledge Patch
* Approval Status

---

# 7. Domain Invariants

The following conditions shall always remain true.

* Every Review uses one Review Profile.
* Every Rule belongs to one Rule Pack.
* Every Finding references Evidence.
* Every Suggestion references one or more Findings.
* Every Knowledge Patch references approved Suggestions.
* Every Governance Report references one Review.

Violation of these invariants represents a governance integrity failure.

---

# 8. Domain Responsibilities

The governance domain is responsible for:

* Reviewing engineering artifacts.
* Evaluating evidence.
* Applying engineering rules.
* Producing findings.
* Generating suggestions.
* Governing knowledge evolution.
* Producing governance reports.

The governance domain is not responsible for planning, implementation, or execution.

---

# 9. Domain Boundaries

AiHarness owns governance concepts only.

The following concepts belong to Shared Engineering Services and are referenced but not owned:

* Artifact
* Lifecycle
* Engineering Graph
* Traceability
* Evidence Acquisition
* Context Assembly
* Engineering Events

The following concepts belong to ASF and are referenced but not owned:

* Plan
* Task
* Task Package
* Execution
* Implementation Workflow

---

# 10. Relationship to Other Documents

The Foundation Charter defines the purpose of AiHarness.

The Constitution defines governance laws.

The Platform Architecture defines the structural organization of governance components.

The Lifecycle Model defines the lifecycle of governance entities.

The Capability Model defines the capabilities built upon this domain.

The Review Profile Model, Rule Pack Model, Evidence Model, and Finding & Suggestion Model provide detailed specifications for the corresponding domain entities.

Shared Engineering Services provides the foundational engineering models referenced throughout this Domain Model.
