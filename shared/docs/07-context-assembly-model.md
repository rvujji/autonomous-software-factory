# Shared Engineering Services (SES)

# Context Assembly Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Context Assembly Model defines how engineering context is constructed and delivered to engineering consumers within the Engineering Platform.

Rather than exposing complete repositories or arbitrary document collections, Context Assembly provides the minimum authoritative information required to perform a specific engineering activity.

The objective is to maximize relevance while minimizing unnecessary context.

---

# 2. Design Philosophy

Engineering decisions should be based on precise, authoritative, and relevant information.

Providing excessive context reduces efficiency, increases ambiguity, and may introduce conflicting information.

Providing insufficient context prevents informed engineering decisions.

Context Assembly delivers the smallest complete engineering context necessary for a specific purpose.

---

# 3. Context Principles

Every Context shall satisfy the following principles.

* Purpose driven.
* Evidence based.
* Minimal.
* Authoritative.
* Traceable.
* Deterministic.
* Reproducible.
* Versioned.

Context is assembled for a task, not permanently stored.

---

# 4. Context Consumers

Context may be assembled for:

* AiHarness Review Engine
* ASF Planning Engine
* ASF Task Package Engine
* ASF Repair Engine
* Execution Backends
* Human Review
* Future Engineering Platforms

Each consumer may require a different context profile.

---

# 5. Context Request

Every Context Assembly operation begins with a Context Request.

A Context Request shall define:

* Request Identifier
* Consumer
* Engineering Purpose
* Target Artifact
* Scope
* Constraints

The request describes **what must be achieved**, not **how context is assembled**.

---

# 6. Context Sources

Context is assembled from authoritative engineering artifacts.

Typical sources include:

* Knowledge
* Architecture
* Domain Model
* Engine Specifications
* Planning Artifacts
* Reviews
* Findings
* Suggestions
* Engineering Graph
* Traceability Paths
* Standards
* Policies
* Previous Decisions

Context sources are identified through Evidence Acquisition.

---

# 7. Context Assembly Process

Context is assembled through the following sequence.

```text id="context-assembly-process"
Context Request

↓

Evidence Acquisition

↓

Graph Traversal

↓

Artifact Selection

↓

Relationship Expansion

↓

Conflict Resolution

↓

Context Package

↓

Consumer
```

The resulting Context Package contains only the information required for the requesting activity.

---

# 8. Context Package

A Context Package is a structured collection of engineering information prepared for one engineering activity.

A Context Package may contain:

* Primary Artifact
* Related Artifacts
* Applicable Standards
* Relevant Decisions
* Dependency Information
* Acceptance Criteria
* Traceability References
* Evidence References

A Context Package is immutable once delivered.

---

# 9. Context Profiles

Different engineering activities require different Context Profiles.

Examples include:

### Planning Context

Requirements, architecture, dependencies, constraints, acceptance criteria.

---

### Review Context

Target artifact, applicable rule packs, evidence, standards, previous findings.

---

### Repair Context

Finding, suggestion, impacted artifacts, implementation, acceptance criteria.

---

### Task Package Context

Task definition, dependencies, implementation constraints, coding standards, tests, expected outputs.

Profiles define the composition of context without changing the assembly process.

---

# 10. Context Resolution

When multiple artifacts provide overlapping information, Context Assembly shall resolve conflicts using the established authority hierarchy.

Only Approved or Frozen artifacts shall be included unless explicitly requested otherwise.

Conflicting information shall be reported rather than silently resolved.

---

# 11. Context Completeness

Before delivery, Context Assembly shall verify that the assembled context satisfies the requesting purpose.

Incomplete context shall be reported.

Consumers may decide whether to proceed or request additional context.

---

# 12. Context Integrity

Every Context Package shall satisfy the following constraints.

* All artifacts are authoritative.
* Relationships are valid.
* Versions are consistent.
* Evidence is traceable.
* No duplicate artifacts.
* No unresolved ambiguity.

Integrity failures invalidate the Context Package.

---

# 13. Context Lifecycle

Context Packages are transient engineering artifacts.

Their lifecycle consists of:

```text id="context-lifecycle"
Requested

↓

Assembled

↓

Delivered

↓

Consumed

↓

Expired
```

Context Packages shall not become authoritative engineering knowledge.

---

# 14. Context Traceability

Every Context Package shall record:

* Request Identifier
* Consumer
* Source Artifacts
* Source Versions
* Assembly Timestamp
* Evidence References
* Engineering Purpose

This ensures that every engineering decision can be traced back to the exact context used.

---

# 15. Context Governance

Context Assembly shall never:

* Invent engineering knowledge.
* Omit required authoritative artifacts.
* Include deprecated artifacts by default.
* Modify source artifacts.
* Perform engineering reasoning.

Its responsibility ends when the correct Context Package has been assembled and delivered.

---

# 16. Relationship to Other Documents

The Artifact Model defines the engineering objects assembled into context.

The Engineering Graph Model identifies related artifacts.

The Traceability Model defines how artifacts are traversed.

The Evidence Acquisition Model retrieves authoritative engineering evidence.

The Engineering Event Model records Context Assembly activities.

AiHarness and ASF consume Context Packages produced according to this model.
