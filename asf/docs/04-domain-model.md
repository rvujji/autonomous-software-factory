# Autonomous Software Factory (ASF)

# Domain Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Domain Model defines the canonical orchestration concepts, entities, relationships, ownership, and invariants within the Autonomous Software Factory (ASF).

It establishes the common engineering language used throughout the orchestration platform.

This document defines **what orchestration concepts exist**, not **how they are implemented**.

---

# 2. Design Philosophy

ASF models software construction as a governed orchestration process.

Engineering knowledge is transformed into executable work through planning, dependency management, task decomposition, execution orchestration, and release management.

Each domain concept owns one engineering responsibility.

---

# 3. Domain Principles

The orchestration domain follows these principles.

* Every concept has one canonical meaning.
* Every entity has one owner.
* Every relationship is explicit.
* Every orchestration decision is traceable.
* Every execution originates from engineering knowledge.
* Every engineering activity progresses through governed orchestration.

---

# 4. Core Domain Entities

The following entities constitute the ASF orchestration domain.

---

## Knowledge Space

Represents the collection of approved engineering knowledge that defines the software system to be constructed.

The Knowledge Space is the source material for planning.

ASF consumes Knowledge Space but does not own the underlying engineering knowledge.

---

## Engineering Plan

Represents the complete engineering strategy required to construct a software system.

An Engineering Plan defines:

* Scope
* Milestones
* Dependencies
* Execution strategy
* Completion criteria

---

## Milestone

Represents a significant engineering objective within an Engineering Plan.

Milestones organize engineering progress.

---

## Engineering Task

Represents one unit of engineering work.

Tasks are produced through engineering planning.

Tasks describe work.

Tasks are not execution contracts.

---

## Task Package

Represents an immutable execution contract delivered to an Execution Backend.

A Task Package contains:

* Engineering objective
* Context
* Constraints
* Acceptance criteria
* Required outputs
* Dependencies

Task Packages are the only mechanism through which implementation work is requested.

---

## Execution Session

Represents one execution attempt performed by an Execution Backend.

An Execution Session records:

* Backend
* Inputs
* Outputs
* Duration
* Status
* Logs

---

## Execution Result

Represents the implementation artifacts produced by an Execution Session.

Execution Results are submitted to AiHarness for governance.

---

## Release

Represents a governed collection of accepted engineering artifacts.

A Release becomes deployable only after governance approval.

---

# 5. Entity Relationships

The primary relationships are:

```text
Knowledge Space
        │
        ▼
Engineering Plan
        │
        ▼
Milestone
        │
        ▼
Engineering Task
        │
        ▼
Task Package
        │
        ▼
Execution Session
        │
        ▼
Execution Result
        │
        ▼
Release
```

All relationships are represented through the Engineering Graph provided by Shared Engineering Services.

---

# 6. Aggregate Ownership

The orchestration aggregates are:

### Planning Aggregate

Owns:

* Engineering Plan
* Milestones

---

### Task Aggregate

Owns:

* Engineering Tasks
* Task Dependencies

---

### Execution Aggregate

Owns:

* Task Packages
* Execution Sessions
* Execution Results

---

### Release Aggregate

Owns:

* Releases
* Release Contents
* Release Metadata

---

# 7. Domain Invariants

The following conditions shall always remain true.

* Every Engineering Plan originates from approved knowledge.
* Every Task belongs to exactly one Engineering Plan.
* Every Task Package belongs to exactly one Task.
* Every Execution Session executes exactly one Task Package.
* Every Execution Result belongs to exactly one Execution Session.
* Every Release contains only governance-approved artifacts.

Violation of these invariants represents an orchestration integrity failure.

---

# 8. Domain Responsibilities

The orchestration domain is responsible for:

* Understanding engineering knowledge.
* Planning engineering work.
* Managing engineering tasks.
* Producing Task Packages.
* Coordinating execution.
* Managing engineering releases.

The orchestration domain is not responsible for:

* Engineering governance.
* Rule evaluation.
* Standards validation.
* Software implementation.

---

# 9. Domain Boundaries

ASF owns orchestration concepts only.

The following concepts belong to Shared Engineering Services and are referenced but not owned:

* Artifact
* Lifecycle
* Engineering Graph
* Traceability
* Evidence Acquisition
* Context Assembly
* Engineering Events

The following concepts belong to AiHarness and are referenced but not owned:

* Review
* Rule Pack
* Evidence
* Finding
* Suggestion
* Knowledge Patch
* Governance Report

Execution Backends own implementation activities and generated implementation artifacts until they are returned to ASF.

---

# 10. Relationship to Other Documents

The Foundation Charter defines the purpose of ASF.

The Constitution defines immutable orchestration laws.

The Platform Architecture defines the structural organization of orchestration components.

The Lifecycle Model defines the lifecycle of orchestration entities.

The Capability Model defines the orchestration capabilities built upon this domain.

The Engine Catalog defines the engines responsible for implementing these domain concepts.

Shared Engineering Services provides the foundational engineering infrastructure used throughout the orchestration domain.

AiHarness provides the governance capabilities that validate orchestration outcomes.
