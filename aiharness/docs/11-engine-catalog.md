# AiHarness

# Engine Catalog

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Engine Catalog defines the logical engines that implement the governance capabilities of AiHarness.

Each engine owns a cohesive set of responsibilities and corresponding domain concepts.

The Engine Catalog defines engine ownership and responsibilities.

It does not define implementation details.

---

# 2. Design Principles

The Engine Catalog follows these principles.

* One engine owns one primary responsibility.
* Engines communicate through published contracts.
* Engines remain loosely coupled.
* Engines consume Shared Engineering Services.
* Engines implement capabilities, not technologies.
* Engines remain independently evolvable.

---

# 3. Engine Overview

AiHarness consists of the following logical engines.

```text id="aih-engine-map"
Governance Engine
│
├── Review Engine
├── Rule Engine
├── Finding Engine
├── Knowledge Evolution Engine
└── Reporting Engine
```

These engines collectively implement the Engineering Governance Platform.

---

# 4. Governance Engine

## Purpose

Coordinates the complete governance lifecycle.

## Responsibilities

* Accept governance requests.
* Coordinate governance workflows.
* Manage governance execution.
* Coordinate engine interactions.
* Track governance progress.
* Publish governance events.

## Owns

* Governance workflow
* Governance orchestration

## Consumes

* Shared Engineering Services

---

# 5. Review Engine

## Purpose

Execute engineering reviews.

## Responsibilities

* Execute Review Profiles.
* Coordinate Rule Packs.
* Evaluate engineering artifacts.
* Coordinate evidence evaluation.
* Produce Review Results.

## Owns

* Reviews
* Review Profiles

## Consumes

* Evidence Acquisition
* Context Assembly
* Engineering Graph
* Traceability

---

# 6. Rule Engine

## Purpose

Execute engineering validation rules.

## Responsibilities

* Execute Rule Packs.
* Evaluate engineering rules.
* Validate engineering constraints.
* Produce rule evaluation results.
* Report rule violations.

## Owns

* Rule Packs
* Rules

## Consumes

* Evidence Sets
* Engineering Standards

---

# 7. Finding Engine

## Purpose

Transform governance results into actionable engineering improvements.

## Responsibilities

* Generate Findings.
* Classify Findings.
* Prioritize Findings.
* Generate Suggestions.
* Maintain governance traceability.

## Owns

* Findings
* Suggestions

## Consumes

* Rule Results
* Evidence
* Engineering Graph

---

# 8. Knowledge Evolution Engine

## Purpose

Govern the controlled evolution of engineering knowledge.

## Responsibilities

* Generate Knowledge Patches.
* Manage approval workflows.
* Verify applied changes.
* Trigger re-reviews.
* Freeze updated knowledge.

## Owns

* Knowledge Patches
* Patch Approval Workflow

## Consumes

* Suggestions
* Reviews
* Engineering Events

---

# 9. Reporting Engine

## Purpose

Produce governance outputs.

## Responsibilities

* Generate Review Reports.
* Generate Compliance Reports.
* Produce Governance Metrics.
* Produce Engineering Dashboards.
* Publish governance summaries.

## Owns

* Governance Reports
* Metrics
* Dashboards

## Consumes

* Reviews
* Findings
* Suggestions
* Knowledge Patches

---

# 10. Capability Mapping

The governance capabilities are implemented by the following engines.

| Capability              | Primary Engine             |
| ----------------------- | -------------------------- |
| Review Management       | Review Engine              |
| Rule Management         | Rule Engine                |
| Evidence Evaluation     | Review Engine              |
| Finding Management      | Finding Engine             |
| Suggestion Management   | Finding Engine             |
| Knowledge Evolution     | Knowledge Evolution Engine |
| Governance Reporting    | Reporting Engine           |
| Governance Coordination | Governance Engine          |

---

# 11. Engine Dependencies

The logical execution flow is:

```text id="aih-engine-flow"
Governance Engine

↓

Review Engine

↓

Rule Engine

↓

Finding Engine

↓

Knowledge Evolution Engine

↓

Reporting Engine
```

Dependencies define logical collaboration.

They do not prescribe deployment topology.

---

# 12. Shared Engineering Services

All engines consume Shared Engineering Services.

Shared services include:

* Artifact Model
* Lifecycle Model
* Engineering Graph Model
* Traceability Model
* Evidence Acquisition Model
* Context Assembly Model
* Engineering Event Model

No engine shall duplicate these responsibilities.

---

# 13. Architectural Constraints

The following constraints shall always apply.

* Every capability has one owning engine.
* Engines shall not overlap responsibilities.
* Engines remain implementation independent.
* Engines communicate through published contracts.
* Engines shall not directly depend on execution platforms.

---

# 14. Extensibility

Future governance capabilities shall be introduced by:

* Extending existing engines where responsibilities remain cohesive, or
* Introducing a new engine only when a distinct governance responsibility emerges.

New engines shall not duplicate existing responsibilities.

---

# 15. Relationship to Other Documents

The Foundation Charter defines the purpose of AiHarness.

The Constitution defines immutable governance laws.

The Platform Architecture defines the structural organization of the platform.

The Domain Model defines the governance entities owned by these engines.

The Lifecycle Model governs the evolution of governance artifacts.

The Capability Model defines the business capabilities implemented by these engines.

The Review Profile Model, Rule Pack Model, Evidence Model, and Finding & Suggestion Model provide detailed specifications for the governance mechanisms executed by these engines.

Shared Engineering Services provides the foundational engineering infrastructure consumed by every engine.
