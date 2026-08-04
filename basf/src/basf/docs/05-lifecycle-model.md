# 05 – Lifecycle Model

**Status:** Authoritative

---

# 1. Purpose

The Lifecycle Model defines how engineering artifacts evolve throughout the Bootstrap Autonomous Software Factory (BASF).

It establishes the canonical states, transitions, and rules governing every artifact from its creation to its final immutable form.

The lifecycle ensures every engineering artifact is:

- Traceable
- Reviewable
- Repairable
- Reproducible
- Versioned

No artifact may bypass the defined lifecycle.

---

# 2. Lifecycle Philosophy

Artifacts become progressively more trustworthy as they move through the engineering pipeline.

Every lifecycle transition increases confidence in the artifact by adding engineering evidence.

The lifecycle therefore represents engineering maturity rather than implementation progress.

---

# 3. Canonical Lifecycle

Every engineering artifact follows the same high-level lifecycle.

```
Draft

↓

Generated

↓

Reviewed

↓

Approved

↓

Frozen

↓

Archived
```

If review fails, the artifact enters the repair cycle.

```
Generated

↓

Reviewed

↓

Rejected

↓

Repaired

↓

Reviewed

↓

Approved
```

---

# 4. Lifecycle States

## Draft

An artifact has been initiated but is incomplete.

Characteristics

- Editable
- Not reviewed
- Not authoritative

---

## Generated

The artifact has been produced by an engine.

Characteristics

- Complete
- Awaiting review
- Version assigned
- Not authoritative

---

## Reviewed

Independent evaluation has completed.

Characteristics

- Review evidence available
- Findings recorded
- Ready for approval or repair

---

## Rejected

The review identified issues preventing approval.

Characteristics

- Findings available
- Repair required
- Previous version retained

---

## Repaired

A new version has been created using review findings.

Characteristics

- Previous version preserved
- New review required
- Findings linked

---

## Approved

The artifact satisfies engineering requirements.

Characteristics

- Engineering complete
- Eligible for freezing
- Approved evidence attached

---

## Frozen

The artifact becomes immutable.

Characteristics

- Read-only
- Version locked
- Authoritative
- Available for downstream systems

---

## Archived

The artifact has been superseded by a newer frozen version.

Characteristics

- Immutable
- Historical reference
- Never modified

---

# 5. Lifecycle Transitions

The following transitions are valid.

| From | To |
|-------|----|
| Draft | Generated |
| Generated | Reviewed |
| Reviewed | Approved |
| Reviewed | Rejected |
| Rejected | Repaired |
| Repaired | Reviewed |
| Approved | Frozen |
| Frozen | Archived |

All other transitions are invalid.

---

# 6. Review Cycle

Review is iterative.

```
Generate

↓

Review

↓

Repair

↓

Review

↓

Repair

↓

Review

↓

Approve
```

The cycle continues until:

- Approval is achieved, or
- Human intervention is requested.

---

# 7. Versioning

Every repair creates a new artifact version.

Example

```
Specification v1

↓

Review

↓

Repair

↓

Specification v2

↓

Review

↓

Repair

↓

Specification v3
```

Versions are immutable once created.

No version is ever overwritten.

---

# 8. Traceability

Every lifecycle transition records:

- Timestamp
- Producing engine
- Parent artifact
- Output artifact
- Review evidence (if applicable)
- Execution identifier

This creates a complete engineering history.

---

# 9. Freeze Rules

An artifact may only enter the Frozen state if:

- It has been approved.
- Review evidence exists.
- All findings are resolved.
- Version information is complete.
- Traceability is preserved.

Freezing publishes the artifact as authoritative.

---

# 10. Failure Handling

Failures never destroy artifacts.

Instead, BASF records:

- Current state
- Failure reason
- Partial outputs
- Execution log

Artifacts remain recoverable.

---

# 11. Lifecycle Invariants

The following rules always apply.

- Every artifact has exactly one lifecycle state.
- Every artifact has exactly one current version.
- Every version is immutable.
- Every transition is recorded.
- Every repair creates a new version.
- Every approval references review evidence.
- Frozen artifacts are immutable.
- Archived artifacts remain accessible.

---

# 12. Lifecycle Ownership

Each lifecycle transition is owned by one engine.

| Transition | Owning Engine |
|------------|---------------|
| Draft → Generated | Specification Engine |
| Generated → Reviewed | Review Engine |
| Reviewed → Rejected | Review Engine |
| Rejected → Repaired | Repair Engine |
| Repaired → Reviewed | Review Engine |
| Reviewed → Approved | Approval Engine |
| Approved → Frozen | Freeze Engine |
| Frozen → Archived | Storage Engine |

Ownership is exclusive.

No transition may have multiple owners.

---

# 13. Evolution

Future versions of BASF may introduce additional artifact types.

All new artifacts shall adopt this lifecycle unless explicitly defined otherwise.

The lifecycle remains stable even as new engineering capabilities are introduced.

This ensures a consistent engineering process across all artifact types.