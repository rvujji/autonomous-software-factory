# Autonomous Software Factory (ASF)

# Engine Catalog

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Engine Catalog defines the logical engines that implement the engineering orchestration capabilities of the Autonomous Software Factory (ASF).

Each engine owns a cohesive engineering responsibility and corresponding domain concepts.

The Engine Catalog defines engine ownership, responsibilities, interactions, and boundaries.

It does not define implementation details.

---

# 2. Design Principles

The Engine Catalog follows these principles.

* One engine owns one primary responsibility.
* Engines implement business capabilities.
* Engines remain loosely coupled.
* Engines consume Shared Engineering Services.
* Engines integrate with AiHarness through published governance contracts.
* Engines remain independently evolvable.
* Engines are logical architectural components, not deployment units.

---

# 3. Engine Overview

ASF consists of the following logical engines.

```text id="asf-engine-map"
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
Release Engine
```

These engines collectively implement the Engineering Orchestration Platform.

---

# 4. Knowledge Management Engine

## Purpose

Prepare engineering knowledge for autonomous software construction.

## Responsibilities

* Receive approved Knowledge Spaces.
* Validate engineering readiness.
* Organize engineering knowledge.
* Detect missing engineering artifacts.
* Maintain knowledge readiness.
* Trigger planning.

## Owns

* Knowledge Readiness
* Knowledge Consumption
* Knowledge Validation Requests

## Consumes

* Shared Engineering Services
* AiHarness

---

# 5. Planning Engine

## Purpose

Transform approved engineering knowledge into deterministic implementation plans.

## Responsibilities

* Analyze engineering knowledge.
* Construct dependency graphs.
* Produce Engineering Plans.
* Generate milestones.
* Estimate engineering scope.
* Determine execution order.

## Owns

* Engineering Plans
* Milestones
* Planning Strategy

## Consumes

* Engineering Graph
* Traceability
* Knowledge Readiness

---

# 6. Engineering Management Engine

## Purpose

Coordinate engineering work throughout the software construction lifecycle.

## Responsibilities

* Generate Engineering Tasks.
* Manage dependencies.
* Schedule engineering work.
* Coordinate execution flow.
* Track engineering progress.
* Manage engineering state.

## Owns

* Engineering Tasks
* Dependency Resolution
* Execution Progress

## Consumes

* Engineering Plans
* Planning Results

---

# 7. Task Package Engine

## Purpose

Produce immutable execution contracts.

## Responsibilities

* Assemble execution context.
* Generate Task Packages.
* Include engineering constraints.
* Include acceptance criteria.
* Include testing requirements.
* Version Task Packages.

## Owns

* Task Packages
* Task Package Templates

## Consumes

* Context Assembly
* Engineering Tasks
* Standards
* Acceptance Criteria

---

# 8. Execution Orchestration Engine

## Purpose

Coordinate engineering implementation performed by Execution Backends.

## Responsibilities

* Select Execution Backend.
* Dispatch Task Packages.
* Monitor execution.
* Collect implementation artifacts.
* Submit artifacts to AiHarness.
* Coordinate repair workflows.
* Retry execution where appropriate.
* Maintain execution history.

## Owns

* Execution Sessions
* Execution Coordination
* Backend Selection

## Consumes

* Task Packages
* Governance Results
* Engineering Events

---

# 9. Release Engine

## Purpose

Assemble and publish governed engineering releases.

## Responsibilities

* Collect accepted artifacts.
* Verify release completeness.
* Freeze releases.
* Produce release metadata.
* Publish releases.
* Maintain release history.

## Owns

* Releases
* Release Contents
* Release Metadata

## Consumes

* Accepted Artifacts
* Governance Results

---

# 10. Capability Mapping

The orchestration capabilities are implemented by the following engines.

| Capability              | Primary Engine                 |
| ----------------------- | ------------------------------ |
| Knowledge Management    | Knowledge Management Engine    |
| Engineering Planning    | Planning Engine                |
| Task Management         | Engineering Management Engine  |
| Task Package Management | Task Package Engine            |
| Execution Orchestration | Execution Orchestration Engine |
| Release Management      | Release Engine                 |

---

# 11. Engine Collaboration

The logical orchestration flow is:

```text id="asf-engine-flow"
Knowledge Management Engine

↓

Planning Engine

↓

Engineering Management Engine

↓

Task Package Engine

↓

Execution Orchestration Engine

↓

AiHarness

↓

Release Engine
```

AiHarness is an external governance dependency and is not part of the ASF engine hierarchy.

---

# 12. External Dependencies

All engines consume Shared Engineering Services.

Shared services include:

* Artifact Model
* Lifecycle Model
* Engineering Graph Model
* Traceability Model
* Evidence Acquisition Model
* Context Assembly Model
* Engineering Event Model

All governance activities are delegated to AiHarness.

All implementation activities are delegated to Execution Backends.

ASF shall not duplicate these responsibilities.

---

# 13. Architectural Constraints

The following constraints shall always apply.

* Every capability has one owning engine.
* Engines shall not overlap responsibilities.
* Engines shall remain technology independent.
* Engines communicate through explicit contracts.
* Engines shall not perform engineering governance.
* Engines shall not implement software directly.

Violation of these constraints represents an orchestration integrity failure.

---

# 14. Extensibility

Future orchestration capabilities shall be introduced by:

* Extending existing engines where responsibilities remain cohesive, or
* Introducing a new engine only when a distinct orchestration responsibility emerges.

New engines shall not duplicate existing responsibilities.

---

# 15. Relationship to Other Documents

The Foundation Charter defines the purpose of ASF.

The Constitution defines immutable orchestration laws.

The Platform Architecture defines the structural organization of ASF.

The Domain Model defines the orchestration entities owned by these engines.

The Lifecycle Model governs orchestration artifact evolution.

The Capability Model defines the business capabilities implemented by these engines.

Shared Engineering Services provides the foundational engineering infrastructure consumed by every engine.

AiHarness provides the governance capabilities integrated throughout engineering orchestration.

Execution Backends perform implementation using Task Packages produced by ASF.
