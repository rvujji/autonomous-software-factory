# AiHarness

# Platform Architecture

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Platform Architecture defines the structural organization of AiHarness.

It identifies the major architectural components, their responsibilities, interactions, dependencies, and architectural boundaries.

This document defines the architecture of the platform, not the implementation of individual engines.

---

# 2. Architectural Vision

AiHarness is an independent Engineering Governance Platform.

It continuously validates engineering artifacts against approved engineering knowledge through deterministic, evidence-based governance.

AiHarness is responsible for governing engineering.

It does not perform planning, orchestration, or implementation.

---

# 3. Architectural Principles

The architecture shall satisfy the following principles.

* Governance independent of execution.
* Evidence before reasoning.
* Deterministic reviews.
* Explicit engineering workflows.
* Reusable governance components.
* Technology independence.
* Complete traceability.
* Modular architecture.

---

# 4. Platform Position

Within the Engineering Platform ecosystem:

```text id="aih-platform-position"
Shared Engineering Services
        │
        ▼
AiHarness
        │
        ▼
Autonomous Software Factory
        │
        ▼
Execution Backends
```

AiHarness depends on Shared Engineering Services.

ASF depends on AiHarness.

Execution Backends do not communicate directly with AiHarness except through governance contracts.

---

# 5. Platform Responsibilities

AiHarness provides:

* Engineering governance
* Engineering review
* Standards validation
* Evidence evaluation
* Finding generation
* Suggestion generation
* Knowledge evolution governance
* Governance reporting

AiHarness shall never perform:

* Planning
* Task generation
* Source code generation
* Software implementation
* Deployment

---

# 6. High-Level Architecture

```text id="aih-high-level-architecture"
Engineering Request

        │

        ▼

Governance Engine

        │

        ▼

Review Engine

        │

        ▼

Rule Engine

        │

        ▼

Evidence Evaluation

        │

        ▼

Finding Engine

        │

        ▼

Suggestion Engine

        │

        ▼

Patch Governance

        │

        ▼

Reporting
```

Each component owns one primary engineering responsibility.

---

# 7. Shared Engineering Services

AiHarness consumes the following shared services:

* Ubiquitous Language
* Artifact Model
* Lifecycle Model
* Engineering Graph
* Traceability
* Evidence Acquisition
* Context Assembly
* Engineering Events

AiHarness shall not duplicate these responsibilities.

---

# 8. Core Architectural Components

## Governance Engine

Coordinates the complete governance workflow.

Owns governance orchestration.

---

## Review Engine

Executes engineering reviews.

Selects Review Profiles.

Coordinates Rule Packs.

Produces Review Results.

---

## Rule Engine

Executes engineering rules.

Evaluates Rule Packs.

Produces rule evaluation results.

---

## Evidence Evaluation

Evaluates evidence delivered by Evidence Acquisition.

Determines evidence sufficiency.

Reports missing evidence.

Does not retrieve evidence directly.

---

## Finding Engine

Transforms rule evaluation results into engineering Findings.

Every Finding references supporting evidence.

---

## Suggestion Engine

Generates engineering Suggestions from approved Findings.

Suggestions are recommendations only.

---

## Patch Governance

Manages approval and application of Knowledge Patches.

Ensures Approved and Frozen knowledge evolves through governed changes.

---

## Report Engine

Produces governance reports.

Supports:

* Human review
* Engineering dashboards
* Compliance reporting
* Architecture assessment

---

# 9. Architectural Boundaries

AiHarness governs engineering.

ASF orchestrates engineering.

Execution Backends implement engineering.

These boundaries shall remain independent.

---

# 10. Integration Model

AiHarness integrates with:

### Shared Engineering Services

For:

* Evidence
* Context
* Graph
* Traceability
* Events

---

### ASF

For:

* Review Requests
* Governance Results
* Knowledge Validation
* Architecture Validation

---

### Execution Backends

Indirectly through ASF.

AiHarness shall not depend upon execution platform implementation details.

---

# 11. Architectural Workflow

The canonical governance workflow is:

```text id="aih-workflow"
Review Request

↓

Context Assembly

↓

Evidence Acquisition

↓

Review Profile

↓

Rule Packs

↓

Evidence Evaluation

↓

Findings

↓

Suggestions

↓

Approval

↓

Knowledge Patch

↓

Re-review

↓

Freeze
```

This workflow represents the primary responsibility of AiHarness.

---

# 12. Dependency Rules

Dependencies shall satisfy the following constraints.

* Components depend only on lower architectural layers.
* No circular dependencies.
* Shared Engineering Services remain the only shared dependency.
* Governance components remain independent of implementation technologies.

---

# 13. Extensibility

AiHarness evolves through:

* New Review Profiles
* New Rule Packs
* New governance capabilities
* New reporting capabilities

Core architectural boundaries shall remain stable.

---

# 14. Quality Attributes

The architecture prioritizes:

* Determinism
* Explainability
* Traceability
* Reusability
* Maintainability
* Extensibility
* Testability
* Platform independence

---

# 15. Relationship to Other Documents

The Foundation Charter defines the purpose of AiHarness.

The Constitution defines immutable governance laws.

The Domain Model defines governance entities.

The Lifecycle Model defines governance artifact evolution.

The Capability Model defines governance capabilities.

The Review Profile Model, Rule Pack Model, Evidence Model, and Finding & Suggestion Model define the governance mechanisms executed by the platform.

The Engine Catalog defines the responsibilities of each architectural component.
