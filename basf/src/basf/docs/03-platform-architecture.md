# 03 – Platform Architecture

**Status:** Authoritative

---

# 1. Purpose

The Bootstrap Autonomous Software Factory (BASF) is an artifact transformation platform.

Its purpose is to autonomously transform engineering knowledge into approved engineering artifacts through a deterministic pipeline of generation, review, repair, approval, and freezing.

Unlike traditional software generators, BASF is not organized around AI prompts or execution workflows.

It is organized around engineering artifacts.

Every engine exists solely to transform one artifact into another while preserving traceability, reproducibility, and engineering correctness.

---

# 2. Architectural Philosophy

BASF follows five architectural principles.

## Artifact-Centric

Artifacts are the primary units of engineering.

Every engine consumes one or more artifacts and produces exactly one new artifact.

---

## Immutable Knowledge

Engineering knowledge is immutable input.

BASF consumes knowledge but never modifies it.

---

## Independent Engines

Each engine owns one engineering capability.

No engine performs multiple unrelated responsibilities.

---

## Deterministic Pipeline

Engineering progresses through a deterministic sequence of artifact transformations.

The workflow is repeatable and reproducible.

---

## Replaceable Components

Every engine can be replaced without affecting the overall platform provided it preserves its artifact contracts.

---

# 3. High-Level Architecture

```
                    Engineering Platform
                           │
                           ▼
                  Knowledge Engine
                           │
                           ▼
                   Knowledge Bundle
                           │
                           ▼
                   Context Engine
                           │
                           ▼
                    Context Bundle
                           │
                           ▼
                Specification Engine
                           │
                           ▼
               Engine Specification
                           │
                           ▼
                    Review Engine
                           │
                           ▼
                     Review Report
                           │
                           ▼
                     Repair Engine
                           │
                           ▼
               Updated Specification
                           │
                           ▼
                   Approval Engine
                           │
                           ▼
               Frozen Specification
```

Every stage produces a persistent engineering artifact.

---

# 4. Runtime Modules

BASF consists of the following runtime modules.

## CLI

Responsible for user interaction.

Examples:

- generate
- review
- repair
- freeze
- run

The CLI contains no engineering logic.

---

## Knowledge Engine

Loads engineering knowledge from the Engineering Platform.

Produces:

Knowledge Bundle

---

## Context Engine

Selects and assembles only the knowledge required for a specific engineering task.

Produces:

Context Bundle

---

## Specification Engine

Transforms contextual engineering knowledge into an implementation-ready engineering specification.

Produces:

Engine Specification

---

## Review Engine

Submits engineering artifacts to independent reviewers and collects structured findings.

Produces:

Review Report

---

## Repair Engine

Repairs engineering artifacts using review findings and authoritative engineering knowledge.

Produces:

Updated Specification

---

## Approval Engine

Determines whether an engineering artifact satisfies review requirements.

Produces:

Approved Specification

---

## Freeze Engine

Publishes immutable engineering artifacts.

Produces:

Frozen Specification

---

## Storage Engine

Persists every engineering artifact and execution log.

Responsible only for storage.

---

# 5. Artifact Pipeline

Engineering work progresses through a fixed pipeline.

```
Knowledge Documents

↓

Knowledge Bundle

↓

Context Bundle

↓

Engine Specification

↓

Review Report

↓

Updated Specification

↓

Approved Specification

↓

Frozen Specification
```

Every artifact becomes the input to the next engineering stage.

---

# 6. Execution Pipeline

A complete BASF execution follows this sequence.

```
Load Knowledge

↓

Build Context

↓

Generate Specification

↓

Review Specification

↓

Repair Findings

↓

Review Again

↓

Approve

↓

Freeze
```

Review and repair repeat until approval is achieved.

---

# 7. Layered Architecture

```
Presentation Layer

CLI

────────────────────

Application Layer

Workflow Coordinator

────────────────────

Engineering Layer

Knowledge

Context

Specification

Review

Repair

Approval

Freeze

────────────────────

Infrastructure Layer

Storage

Execution Backend

Logging

Configuration
```

Dependencies always point downward.

No lower layer depends upon a higher layer.

---

# 8. Engine Communication

Engines never invoke one another directly.

All communication occurs through engineering artifacts.

```
Engine A

↓

Artifact

↓

Storage

↓

Artifact

↓

Engine B
```

This ensures loose coupling and complete traceability.

---

# 9. External Systems

BASF integrates with:

## Engineering Platform

Source of engineering knowledge.

---

## AiHarness

Independent engineering reviewer.

---

## Execution Backends

AI execution providers responsible for generation and repair.

Examples include:

- Claude
- OpenCode
- Future providers

Execution backends never become part of BASF's domain model.

---

# 10. Error Handling

Failures never overwrite engineering artifacts.

Instead, BASF records:

- execution log
- failure reason
- partial outputs
- diagnostics

Every execution remains reproducible.

---

# 11. Scalability

The architecture is intentionally sequential in v0.

Future versions may introduce:

- parallel artifact generation
- distributed execution
- workflow scheduling
- dependency graphs
- multi-agent collaboration

These additions must preserve the existing artifact contracts.

---

# 12. Architectural Constraints

The following constraints are mandatory.

- Knowledge is read-only.
- Every engine owns one capability.
- Every engine produces exactly one artifact.
- Every artifact is versioned.
- Every artifact is persisted.
- Every execution is logged.
- Every review is independent.
- Frozen artifacts are immutable.
- Engines communicate only through artifacts.

These constraints define the architecture of BASF.

---

# 13. Implementation Strategy

BASF shall be implemented as a modular monolith.

Each engine is an independent module with well-defined artifact contracts.

The implementation must prioritize simplicity, determinism, and maintainability over distribution or scalability.

Distributed execution may be introduced in future versions without changing the platform architecture.