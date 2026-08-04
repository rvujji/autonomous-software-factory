# Autonomous Software Factory (ASF)

# Platform Architecture

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Platform Architecture defines the structural organization of the Autonomous Software Factory (ASF).

It identifies the major architectural components, their responsibilities, interactions, dependencies, and execution boundaries.

This document defines the architecture of the platform, not the implementation of individual engines.

---

# 2. Architectural Vision

ASF is an Engineering Orchestration Platform.

Its responsibility is to transform approved engineering knowledge into production-ready software through deterministic planning, orchestration, execution management, governance integration, and release management.

ASF orchestrates engineering.

It neither governs engineering nor implements software directly.

---

# 3. Architectural Principles

The architecture shall satisfy the following principles.

* Knowledge-driven engineering.
* Deterministic orchestration.
* Planning before execution.
* Immutable execution contracts.
* Continuous governance.
* Replaceable execution platforms.
* Complete traceability.
* Event-driven automation.

---

# 4. Platform Position

Within the Engineering Platform ecosystem:

```text
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

ASF depends upon:

* Shared Engineering Services for engineering infrastructure.
* AiHarness for engineering governance.

Execution Backends depend upon ASF for orchestration.

---

# 5. Platform Responsibilities

ASF provides:

* Knowledge Management
* Engineering Planning
* Dependency Management
* Task Management
* Task Package Generation
* Execution Orchestration
* Release Orchestration

ASF shall never perform:

* Engineering Governance
* Rule Evaluation
* Engineering Review
* Source Code Generation
* Technology-specific implementation

---

# 6. High-Level Architecture

```text
Engineering Knowledge

        │

        ▼

Knowledge Management Engine

        │

        ▼

Planning Engine

        │

        ▼

Engineering Management Engine

        │

        ▼

Task Package Engine

        │

        ▼

Execution Orchestration Engine

        │

        ▼

AiHarness

        │

        ▼

Release Engine
```

Each engine owns one primary engineering responsibility.

---

# 7. Core Architectural Components

## Knowledge Management Engine

### Purpose

Transform approved engineering knowledge into a form suitable for engineering planning.

### Responsibilities

* Receive approved knowledge.
* Validate engineering completeness.
* Build engineering understanding.
* Maintain engineering context.
* Trigger planning.

---

## Planning Engine

### Purpose

Produce deterministic engineering plans.

### Responsibilities

* Analyze engineering knowledge.
* Build dependency plans.
* Produce implementation plans.
* Determine execution order.
* Generate engineering milestones.

---

## Engineering Management Engine

### Purpose

Manage engineering execution throughout the software construction lifecycle.

### Responsibilities

* Manage engineering tasks.
* Resolve dependencies.
* Track execution progress.
* Coordinate workflow execution.
* Manage engineering state.

---

## Task Package Engine

### Purpose

Produce immutable execution contracts.

### Responsibilities

* Assemble execution context.
* Generate Task Packages.
* Include acceptance criteria.
* Include engineering constraints.
* Include testing requirements.

Task Packages are the only mechanism through which engineering work is delivered to Execution Backends.

---

## Execution Orchestration Engine

### Purpose

Coordinate engineering execution.

### Responsibilities

* Select Execution Backends.
* Dispatch Task Packages.
* Monitor execution.
* Collect implementation artifacts.
* Route outputs to AiHarness.
* Initiate repair workflows.
* Retry failed executions when appropriate.

ASF does not implement software.

Execution Backends perform implementation.

---

## Release Engine

### Purpose

Manage engineering releases.

### Responsibilities

* Freeze accepted artifacts.
* Assemble releases.
* Maintain release traceability.
* Produce release packages.
* Publish engineering releases.

---

# 8. Engineering Workflow

The Engineering Orchestration Workflow is:

```text
Approved Knowledge

↓

Knowledge Management

↓

Planning

↓

Task Management

↓

Task Package Generation

↓

Execution

↓

Governance Review

↓

Repair (if required)

↓

Freeze

↓

Release
```

This workflow represents product-level engineering orchestration.

---

# 9. Execution Workflow

Each Task Package follows an independent execution workflow.

```text
Task Package

↓

Execution Backend Selection

↓

Context Delivery

↓

Implementation

↓

Artifact Collection

↓

AiHarness Review

↓

Accepted

or

Repair

↓

Re-execution
```

This workflow represents task-level engineering orchestration.

---

# 10. Integration Model

ASF integrates with:

## Shared Engineering Services

Consumes:

* Artifact Model
* Lifecycle Model
* Engineering Graph Model
* Traceability Model
* Evidence Acquisition Model
* Context Assembly Model
* Engineering Event Model

---

## AiHarness

Consumes:

* Governance Reviews
* Findings
* Suggestions
* Knowledge Patch Status
* Approval Results

---

## Execution Backends

Provides:

* Task Packages
* Engineering Context
* Acceptance Criteria
* Engineering Constraints

Receives:

* Implementation Artifacts
* Execution Status
* Execution Logs

---

# 11. Architectural Boundaries

The following boundaries shall remain independent.

Shared Engineering Services

* Engineering infrastructure.

AiHarness

* Engineering governance.

ASF

* Engineering orchestration.

Execution Backends

* Engineering implementation.

These responsibilities shall never overlap.

---

# 12. Architectural Constraints

The following constraints shall always apply.

* Engineering begins with approved knowledge.
* Every implementation originates from a Task Package.
* Execution Backends never access engineering knowledge directly.
* Every implementation is governed by AiHarness.
* Every accepted artifact participates in release management.
* Engineering workflows remain deterministic.

---

# 13. Quality Attributes

The architecture prioritizes:

* Automation
* Determinism
* Repeatability
* Explainability
* Traceability
* Scalability
* Extensibility
* Backend Independence

---

# 14. Relationship to Other Documents

The Foundation Charter defines the purpose of ASF.

The Constitution defines immutable orchestration laws.

The Domain Model defines orchestration entities.

The Lifecycle Model defines orchestration artifact evolution.

The Capability Model defines business capabilities.

The Engine Catalog defines the logical ownership of engineering capabilities.

Shared Engineering Services provides the foundational engineering infrastructure.

AiHarness provides the engineering governance integrated throughout ASF workflows.
