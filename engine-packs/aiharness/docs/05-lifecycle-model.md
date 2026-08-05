# AiHarness

# Lifecycle Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Lifecycle Model defines the lifecycle states and state transitions for governance artifacts managed by AiHarness.

It extends the Shared Engineering Services Lifecycle Model with governance-specific workflows while preserving the canonical lifecycle framework.

This document defines how governance artifacts evolve from creation to completion.

---

# 2. Scope

This Lifecycle Model applies to governance artifacts including:

* Reviews
* Findings
* Suggestions
* Knowledge Patches
* Governance Reports
* Review Profiles
* Rule Packs

Each governance artifact inherits the canonical lifecycle defined by Shared Engineering Services.

Where necessary, governance artifacts introduce additional intermediate states.

---

# 3. Design Philosophy

Governance activities are progressive.

Every governance artifact moves through explicit, traceable, and governed lifecycle states.

No lifecycle transition shall occur implicitly.

Every transition shall be auditable.

---

# 4. Lifecycle Principles

Every governance artifact shall satisfy the following principles.

* Exactly one current lifecycle state.
* Explicit state transitions.
* Immutable lifecycle history.
* Traceable transitions.
* Governed progression.
* Human approval where required.
* No hidden transitions.

---

# 5. Review Lifecycle

The lifecycle of a Review is:

```text id="review-lifecycle"
Requested

↓

Preparing

↓

Executing

↓

Completed

↓

Approved

↓

Frozen

↓

Archived
```

### Requested

A review has been requested but has not yet started.

---

### Preparing

Review Profile, Rule Packs, Context, and Evidence are being prepared.

---

### Executing

Rules are being evaluated.

Evidence is being assessed.

Findings are generated.

---

### Completed

The review has finished execution.

Results have been produced.

---

### Approved

The review has been accepted as the authoritative governance outcome.

---

### Frozen

The completed review becomes immutable.

---

### Archived

The review is retained for historical reference.

---

# 6. Finding Lifecycle

The lifecycle of a Finding is:

```text id="finding-lifecycle"
Created

↓

Validated

↓

Accepted

↓

Closed

↓

Archived
```

### Created

The finding has been generated.

---

### Validated

Supporting evidence has been confirmed.

---

### Accepted

The finding is accepted as valid.

---

### Closed

No further action is required.

---

### Archived

The finding is retained for historical purposes.

---

# 7. Suggestion Lifecycle

The lifecycle of a Suggestion is:

```text id="suggestion-lifecycle"
Generated

↓

Pending Approval

↓

Approved

↓

Rejected
```

### Generated

The suggestion has been produced from one or more findings.

---

### Pending Approval

Waiting for human approval.

---

### Approved

The suggestion may be implemented through a Knowledge Patch.

---

### Rejected

The suggestion shall not be implemented.

Rejected suggestions remain traceable.

---

# 8. Knowledge Patch Lifecycle

The lifecycle of a Knowledge Patch is:

```text id="patch-lifecycle"
Proposed

↓

Approved

↓

Applied

↓

Verified

↓

Closed
```

### Proposed

The patch has been created from approved suggestions.

---

### Approved

Human approval has been granted.

---

### Applied

The knowledge artifact has been updated.

---

### Verified

AiHarness has successfully re-reviewed the updated artifact.

---

### Closed

The patch process has completed successfully.

---

# 9. Governance Report Lifecycle

The lifecycle of a Governance Report is:

```text id="report-lifecycle"
Generated

↓

Published

↓

Archived
```

Governance Reports are immutable after publication.

---

# 10. Review Profile Lifecycle

Review Profiles follow the Shared Engineering Services lifecycle.

Only Approved or Frozen Review Profiles may be used for governance.

---

# 11. Rule Pack Lifecycle

Rule Packs follow the Shared Engineering Services lifecycle.

Only Approved or Frozen Rule Packs may be executed.

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
* Frozen governance artifacts are immutable.
* Historical lifecycle states are preserved.
* Rejected Suggestions shall never produce Knowledge Patches.
* Unapproved Reviews shall never become authoritative.

Violation of these constraints represents a governance integrity failure.

---

# 14. Relationship to Shared Engineering Services

This Lifecycle Model extends the canonical Lifecycle Model defined by Shared Engineering Services.

It introduces governance-specific lifecycle states while preserving the shared lifecycle principles.

No governance lifecycle shall violate the canonical lifecycle contract.

---

# 15. Relationship to Other Documents

The Foundation Charter defines the purpose of AiHarness.

The Constitution defines governance laws.

The Domain Model defines the governance entities that follow these lifecycles.

The Platform Architecture defines the governance workflow.

The Review Profile Model, Rule Pack Model, Evidence Model, and Finding & Suggestion Model define the behavior of the corresponding governance artifacts.

Shared Engineering Services provides the foundational lifecycle framework inherited by all governance artifacts.
