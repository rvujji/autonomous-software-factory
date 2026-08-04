# 04 – Domain Model

**Status:** Authoritative

---

# 1. Purpose

The BASF Domain Model defines the canonical engineering objects that exist within the Bootstrap Autonomous Software Factory.

Its purpose is to establish a stable engineering language before implementation begins, ensuring that every module, engine, workflow, API, and storage mechanism uses the same vocabulary.

The domain model is implementation-independent.

It defines *what exists*, not *how it is implemented*.

---

# 2. Domain Philosophy

BASF is an artifact transformation platform.

Artifacts represent engineering knowledge at different stages of maturity.

Engines transform artifacts.

Workflows coordinate transformations.

Execution records what happened.

Nothing else is part of the BASF domain.

---

# 3. Core Domain Objects

The BASF domain consists of five primary concepts.

```
Knowledge

↓

Artifact

↓

Engine

↓

Workflow

↓

Execution
```

---

# 4. Knowledge

## Definition

Knowledge represents authoritative engineering information consumed by BASF.

Knowledge is immutable.

BASF never edits engineering knowledge.

---

### Responsibilities

- Provide engineering context
- Supply architectural guidance
- Supply engineering rules
- Supply templates
- Supply standards

---

### Examples

- Platform Architecture
- Domain Model
- Engine Catalog
- Constitution
- Engineering Standards
- Templates

---

# 5. Artifact

## Definition

An Artifact is any persistent engineering output produced or consumed by BASF.

Artifacts are the primary units of engineering work.

Every engineering activity begins with an artifact and ends with a new artifact.

---

### Examples

- Knowledge Bundle
- Context Bundle
- Engine Specification
- Review Report
- Repair Report
- Approved Specification
- Frozen Specification

---

### Properties

Every artifact has:

- Identifier
- Type
- Version
- Lifecycle State
- Creation Timestamp
- Owner Engine
- Parent Artifact(s)
- Metadata

---

# 6. Engine

## Definition

An Engine performs one engineering transformation.

Each engine consumes one or more artifacts and produces exactly one new artifact.

---

### Responsibilities

- Execute one capability
- Preserve traceability
- Produce deterministic outputs

---

### Examples

- Knowledge Engine
- Context Engine
- Specification Engine
- Review Engine
- Repair Engine
- Approval Engine
- Freeze Engine
- Storage Engine

---

# 7. Workflow

## Definition

A Workflow coordinates the execution of multiple engines.

Workflows contain orchestration logic only.

They never perform engineering transformations.

---

### Responsibilities

- Determine execution order
- Handle retries
- Monitor execution
- Collect execution results

---

# 8. Execution

## Definition

Execution represents one complete run of a workflow.

Every execution is fully reproducible.

---

### Records

Each execution records:

- Workflow
- Input artifacts
- Output artifacts
- Executed engines
- Duration
- Status
- Logs
- Failures

---

# 9. Relationships

```
Knowledge

↓

Knowledge Engine

↓

Knowledge Bundle

↓

Context Engine

↓

Context Bundle

↓

Specification Engine

↓

Engine Specification

↓

Review Engine

↓

Review Report

↓

Repair Engine

↓

Updated Specification

↓

Approval Engine

↓

Approved Specification

↓

Freeze Engine

↓

Frozen Specification
```

Every engineering object exists within this transformation chain.

---

# 10. Aggregate Ownership

BASF intentionally maintains small aggregate boundaries.

## Knowledge Aggregate

Owns:

- Knowledge Sources
- Knowledge Bundles

---

## Artifact Aggregate

Owns:

- Artifact Metadata
- Artifact Versions
- Artifact State

---

## Execution Aggregate

Owns:

- Workflow
- Execution
- Logs
- Results

---

Engines themselves are stateless.

State belongs to artifacts and executions.

---

# 11. Domain Invariants

The following invariants shall always remain true.

- Every artifact has one lifecycle state.
- Every artifact has exactly one producing engine.
- Every artifact is versioned.
- Every workflow creates an execution.
- Every execution records all artifacts.
- Every artifact is traceable.
- Frozen artifacts are immutable.
- Knowledge remains immutable.

---

# 12. Ubiquitous Language

The following terminology is authoritative.

| Term | Definition |
|------|------------|
| Knowledge | Authoritative engineering information |
| Artifact | Persistent engineering object |
| Engine | Artifact transformation component |
| Workflow | Engine orchestration |
| Execution | One workflow run |
| Review | Independent engineering evaluation |
| Finding | Structured engineering issue |
| Repair | Evidence-based artifact modification |
| Approval | Successful review completion |
| Freeze | Publication of immutable artifact |

No alternative terminology should be introduced without updating this domain model.

---

# 13. Domain Boundaries

BASF owns:

- Engineering artifact generation
- Artifact lifecycle
- Workflow execution
- Artifact storage
- Execution history

BASF does not own:

- Product requirements
- Engineering standards
- Review rules
- AI models
- Product implementations

Those belong to other Engineering Platform components.

---

# 14. Evolution

Future BASF versions may introduce new artifact types.

They shall not introduce new engineering concepts unless those concepts cannot be represented using:

- Knowledge
- Artifact
- Engine
- Workflow
- Execution

This keeps the domain model intentionally small, stable, and extensible.