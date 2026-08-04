# 07 – Engine Catalog

**Status:** Authoritative

---

# 1. Purpose

The Engine Catalog defines the executable engineering components of the Bootstrap Autonomous Software Factory (BASF).

Each engine owns exactly one engineering responsibility and performs one artifact transformation.

Collectively, the engines implement the engineering pipeline defined by the Platform Architecture while remaining independently replaceable and independently testable.

---

# 2. Engine Philosophy

Every engine shall:

- Own one capability
- Transform one engineering artifact into another
- Be independently executable
- Be independently testable
- Be deterministic
- Produce traceable outputs

Engines never communicate directly.

All communication occurs through persisted engineering artifacts.

---

# 3. Engine Dependency Graph

```
Knowledge Engine

↓

Context Engine

↓

Specification Engine

↓

Review Engine

↓

Repair Engine

↓

Approval Engine

↓

Freeze Engine
```

Supporting every engine:

- Storage Engine
- Workflow Engine

---

# 4. Knowledge Engine

## Purpose

Load authoritative engineering knowledge from the Engineering Platform.

## Input

Engineering Platform documentation

## Output

Knowledge Bundle

## Responsibilities

- Discover engineering knowledge
- Read documents
- Validate knowledge sources
- Build knowledge bundle

## Owns

Knowledge Bundle

---

# 5. Context Engine

## Purpose

Assemble task-specific engineering context.

## Input

Knowledge Bundle

Target Artifact

## Output

Context Bundle

## Responsibilities

- Select relevant knowledge
- Remove unrelated information
- Build engineering context
- Preserve traceability

## Owns

Context Bundle

---

# 6. Specification Engine

## Purpose

Generate implementation-ready engineering specifications.

## Input

Context Bundle

## Output

Engineering Specification

## Responsibilities

- Generate specifications
- Apply engineering standards
- Apply templates
- Produce structured output

## Owns

Engineering Specification

---

# 7. Review Engine

## Purpose

Submit engineering artifacts for independent review.

## Input

Engineering Specification

## Output

Review Report

## Responsibilities

- Submit artifact
- Collect findings
- Normalize review output
- Store review evidence

## Owns

Review Report

---

# 8. Repair Engine

## Purpose

Resolve review findings.

## Input

Engineering Specification

Review Report

Knowledge Bundle

## Output

Updated Engineering Specification

## Responsibilities

- Interpret findings
- Apply engineering knowledge
- Generate corrected artifact
- Preserve traceability

## Owns

Updated Specification

---

# 9. Approval Engine

## Purpose

Determine engineering readiness.

## Input

Review Report

Updated Specification

## Output

Approved Specification

## Responsibilities

- Verify review completion
- Verify finding resolution
- Approve engineering artifact

## Owns

Approval Decision

---

# 10. Freeze Engine

## Purpose

Publish immutable engineering artifacts.

## Input

Approved Specification

## Output

Frozen Specification

## Responsibilities

- Lock artifact
- Publish authoritative version
- Record version history

## Owns

Frozen Specification

---

# 11. Storage Engine

## Purpose

Persist engineering artifacts.

## Input

Any Artifact

## Output

Stored Artifact

## Responsibilities

- Save artifacts
- Version artifacts
- Retrieve artifacts
- Archive artifacts
- Maintain metadata

Storage Engine performs no engineering transformations.

It provides infrastructure services to the platform.

---

# 12. Workflow Engine

## Purpose

Coordinate engine execution.

## Input

Workflow Request

## Output

Execution Record

## Responsibilities

- Execute workflows
- Determine execution order
- Retry failed steps
- Track execution
- Produce logs

Workflow Engine performs orchestration only.

It never modifies engineering artifacts.

---

# 13. Engine Contracts

Every engine exposes the same conceptual contract.

```
Input Artifact(s)

↓

Process

↓

Output Artifact
```

Each engine is therefore interchangeable provided it preserves its contract.

---

# 14. Engine Ownership Matrix

| Engine | Owns | Produces |
|---------|------|----------|
| Knowledge Engine | Knowledge Bundle | Knowledge Bundle |
| Context Engine | Context Bundle | Context Bundle |
| Specification Engine | Specification | Engineering Specification |
| Review Engine | Review Report | Review Report |
| Repair Engine | Updated Specification | Updated Specification |
| Approval Engine | Approval Decision | Approved Specification |
| Freeze Engine | Frozen Specification | Frozen Specification |
| Storage Engine | Artifact Repository | Stored Artifacts |
| Workflow Engine | Execution | Execution Records |

---

# 15. Engine Invariants

Every engine shall:

- Have exactly one responsibility
- Produce exactly one primary artifact
- Never modify input artifacts
- Preserve traceability
- Record execution
- Be independently testable
- Be independently replaceable

No engine shall perform orchestration, storage, and engineering transformation simultaneously.

---

# 16. Engine Evolution

Future BASF versions may introduce additional engines.

Examples include:

- Planning Engine
- Code Generation Engine
- Test Generation Engine
- Database Engine
- API Engine
- Documentation Engine
- Release Engine

New engines shall follow the same architectural principles:

- One capability
- One transformation
- One primary artifact
- Independent execution
- Independent testing

The Engine Catalog may expand, but the engineering philosophy remains unchanged.