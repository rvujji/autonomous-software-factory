# Autonomous Software Factory (ASF)

# Lifecycle Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Lifecycle Model defines the lifecycle states and transitions for orchestration artifacts managed by the Autonomous Software Factory (ASF).

It extends the Shared Engineering Services Lifecycle Model with orchestration-specific workflows while preserving the canonical lifecycle framework.

This document defines how orchestration artifacts evolve throughout the software construction process.

---

# 2. Scope

This Lifecycle Model applies to the following orchestration artifacts:

* Engineering Plans
* Milestones
* Engineering Tasks
* Task Packages
* Execution Sessions
* Execution Results
* Releases

Each orchestration artifact inherits the canonical lifecycle defined by Shared Engineering Services.

---

# 3. Design Philosophy

Engineering orchestration is progressive.

Artifacts move through explicit, traceable, and governed states.

Every transition shall be deterministic, reproducible, and auditable.

---

# 4. Lifecycle Principles

Every orchestration artifact shall satisfy the following principles.

* Exactly one current lifecycle state.
* Explicit state transitions.
* Immutable lifecycle history.
* Traceable transitions.
* Deterministic progression.
* Governance before acceptance.
* No hidden transitions.

---

# 5. Engineering Plan Lifecycle

The lifecycle of an Engineering Plan is:

```text id="plan-lifecycle"
Created

↓

Analyzed

↓

Approved

↓

Executing

↓

Completed

↓

Archived
```

### Created

The Engineering Plan has been generated from approved knowledge.

---

### Analyzed

Dependencies, milestones, risks, and execution order have been determined.

---

### Approved

The plan is approved for execution.

---

### Executing

Engineering Tasks are being executed.

---

### Completed

All planned work has completed successfully.

---

### Archived

The Engineering Plan is retained for historical reference.

---

# 6. Milestone Lifecycle

The lifecycle of a Milestone is:

```text id="milestone-lifecycle"
Planned

↓

Active

↓

Completed

↓

Archived
```

Milestones track engineering progress.

---

# 7. Engineering Task Lifecycle

The lifecycle of an Engineering Task is:

```text id="task-lifecycle"
Created

↓

Ready

↓

Packaged

↓

Executing

↓

Governance Review

↓

Completed

or

Repair Required
```

### Created

The task has been generated from the Engineering Plan.

---

### Ready

All dependencies have been satisfied.

---

### Packaged

A Task Package has been generated.

---

### Executing

The Task Package is being executed by an Execution Backend.

---

### Governance Review

Generated artifacts are being evaluated by AiHarness.

---

### Completed

The task has been successfully accepted.

---

### Repair Required

Governance identified issues requiring corrective work.

A new Task Package shall be generated for the repair cycle.

---

# 8. Task Package Lifecycle

The lifecycle of a Task Package is:

```text id="task-package-lifecycle"
Generated

↓

Dispatched

↓

Executing

↓

Completed

↓

Closed
```

Task Packages are immutable.

Failures produce a new Task Package rather than modifying the existing one.

---

# 9. Execution Session Lifecycle

The lifecycle of an Execution Session is:

```text id="execution-session-lifecycle"
Started

↓

Running

↓

Completed

or

Failed
```

Execution Sessions record one execution attempt.

Retries create new Execution Sessions.

---

# 10. Execution Result Lifecycle

The lifecycle of an Execution Result is:

```text id="execution-result-lifecycle"
Produced

↓

Submitted

↓

Accepted

or

Rejected
```

Accepted results proceed to release management.

Rejected results initiate repair.

---

# 11. Release Lifecycle

The lifecycle of a Release is:

```text id="release-lifecycle"
Prepared

↓

Verified

↓

Frozen

↓

Published

↓

Archived
```

Only governance-approved artifacts may be included in a Release.

---

# 12. Lifecycle Governance

Lifecycle transitions shall satisfy the following conditions.

* Every transition has an initiating actor.
* Every transition has a timestamp.
* Every transition has a recorded reason.
* Every transition is traceable.
* Every transition generates an Engineering Event.

---

# 13. Lifecycle Constraints

The following conditions shall always remain true.

* One current lifecycle state per artifact.
* Frozen releases are immutable.
* Task Packages are immutable.
* Failed executions create new Execution Sessions.
* Rejected Execution Results initiate repair.
* Completed tasks contain only governance-approved outputs.

Violation of these constraints represents an orchestration integrity failure.

---

# 14. Relationship to Shared Engineering Services

This Lifecycle Model extends the canonical Lifecycle Model defined by Shared Engineering Services.

It introduces orchestration-specific states while preserving the shared lifecycle principles.

No orchestration lifecycle shall violate the canonical lifecycle contract.

---

# 15. Relationship to Other Documents

The Foundation Charter defines the purpose of ASF.

The Constitution defines immutable orchestration laws.

The Platform Architecture defines orchestration workflows.

The Domain Model defines the orchestration entities governed by these lifecycles.

The Capability Model defines the orchestration capabilities built upon these lifecycle transitions.

The Engine Catalog defines the engines responsible for managing these lifecycle states.

Shared Engineering Services provides the foundational lifecycle framework inherited by all orchestration artifacts.

AiHarness governs engineering outputs before they become accepted or released.
