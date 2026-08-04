# Shared Engineering Services (SES)

# Evidence Acquisition Model

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Evidence Acquisition Model defines how engineering evidence is discovered, collected, validated, assembled, and delivered to engineering consumers across the Engineering Platform.

Evidence Acquisition is a shared engineering capability used by both the Autonomous Software Factory (ASF) and AiHarness.

Its responsibility is to provide authoritative, traceable, and deterministic engineering evidence for planning, governance, validation, review, repair, and decision making.

This document defines **how engineering evidence is acquired**, not **how it is evaluated**.

---

# 2. Design Philosophy

Engineering decisions shall always be supported by authoritative evidence.

Rather than allowing individual platforms to retrieve information independently, Evidence Acquisition provides a single, reusable mechanism for discovering and assembling engineering evidence.

The service delivers only the evidence required for a specific engineering purpose.

---

# 3. Design Principles

Evidence Acquisition shall satisfy the following principles.

* Retrieve authoritative evidence only.
* Never fabricate evidence.
* Preserve complete traceability.
* Produce deterministic results.
* Support multiple evidence sources.
* Minimize unnecessary retrieval.
* Remain implementation independent.
* Be reusable across all engineering platforms.

Evidence Acquisition retrieves evidence.

It never performs engineering reasoning.

---

# 4. Responsibilities

Evidence Acquisition is responsible for:

* Discovering evidence.
* Selecting authoritative sources.
* Retrieving engineering artifacts.
* Validating evidence quality.
* Correlating evidence.
* Ranking evidence.
* Building Evidence Sets.
* Delivering evidence to requesting consumers.

Evidence Acquisition does not:

* Review engineering artifacts.
* Generate findings.
* Produce suggestions.
* Perform planning.
* Execute engineering work.

---

# 5. Consumers

Evidence Acquisition is consumed by:

* AiHarness
* ASF
* Future Engineering Platforms

Within these platforms, consumers may include:

* Knowledge Engine
* Knowledge Validation Engine
* Planning Engine
* Review Engine
* Repair Engine
* Traceability Engine
* Governance Engine
* Task Package Engine

Consumers shall not retrieve engineering evidence independently.

---

# 6. Evidence Sources

Evidence may originate from multiple authoritative engineering sources.

### Knowledge Sources

* Requirements
* BRDs
* Architecture Documents
* Domain Models
* Engine Specifications
* Standards
* Policies
* ADRs

---

### Graph Sources

* Engineering Graph
* Dependency Relationships
* Traceability Relationships
* Impact Relationships

---

### Implementation Sources

* Source Code
* APIs
* Database Schema
* UI Components
* Tests
* Configuration
* Generated Artifacts

---

### Governance Sources

* Constitution
* Rule Packs
* Review Profiles
* Compliance Rules

---

### Historical Sources

* Previous Reviews
* Previous Decisions
* Previous Releases
* Previous Versions
* Previous Patches

---

# 7. Evidence Providers

Evidence is retrieved through specialized Evidence Providers.

Examples include:

* Document Provider
* Engineering Graph Provider
* Source Code Provider
* Database Provider
* Test Provider
* Rule Pack Provider
* Standards Provider
* Version History Provider
* Metrics Provider
* Git Provider

Evidence Providers encapsulate retrieval mechanisms.

Consumers remain independent of storage technologies.

---

# 8. Evidence Request

Every acquisition begins with an Evidence Request.

An Evidence Request contains:

* Request Identifier
* Requesting Platform
* Requesting Engine
* Engineering Purpose
* Target Artifact
* Required Evidence Types
* Scope
* Constraints

The request specifies **what evidence is required**, not **how it is retrieved**.

---

# 9. Evidence Discovery

Evidence Discovery identifies candidate engineering artifacts relevant to the request.

Discovery may use:

* Engineering Graph traversal
* Traceability paths
* Semantic relationships
* Artifact ownership
* Version history
* Lifecycle state
* Dependency analysis

Discovery shall prioritize authoritative engineering artifacts.

---

# 10. Evidence Selection

Not all discovered evidence is returned.

Selection is based upon:

* Authority
* Relevance
* Completeness
* Freshness
* Lifecycle State
* Traceability
* Confidence

Selection shall minimize unnecessary engineering context.

---

# 11. Evidence Authority

When multiple evidence sources conflict, authority determines precedence.

The default authority order is:

1. Constitution
2. Foundation Charter
3. Platform Architecture
4. Domain Model
5. Lifecycle Model
6. Engineering Graph Model
7. Traceability Model
8. Capability Model
9. Engine Catalog
10. Engine Specifications
11. Approved Knowledge
12. Generated Artifacts

Draft, Deprecated, or Archived artifacts shall not be considered authoritative unless explicitly requested.

---

# 12. Evidence Correlation

Evidence from multiple providers may be combined into a single Evidence Set.

Correlation identifies:

* Supporting evidence
* Contradicting evidence
* Missing evidence
* Duplicate evidence

Evidence Sets provide the factual basis for downstream engineering activities.

---

# 13. Evidence Assembly

Evidence Acquisition assembles the minimum authoritative Evidence Set required by the requesting consumer.

Evidence Sets shall be:

* Relevant
* Complete
* Traceable
* Versioned
* Deterministic

Evidence Acquisition shall not include unrelated engineering artifacts.

---

# 14. Evidence Cache

Evidence may be cached to improve performance.

Cached evidence shall preserve:

* Source Version
* Lifecycle State
* Authority
* Traceability

Cache invalidation shall occur whenever authoritative artifacts change.

---

# 15. Evidence Freshness

Evidence Acquisition shall always retrieve the latest Approved or Frozen version of an Artifact.

Older versions may be retrieved only when explicitly requested.

---

# 16. Missing Evidence

When required evidence cannot be located, the service shall return a Missing Evidence Result.

Missing evidence is a valid engineering outcome.

Examples include:

* Missing Requirement
* Missing API Specification
* Missing Security Specification
* Missing Test Specification
* Missing Acceptance Criteria

Consumers determine how missing evidence affects their workflows.

---

# 17. Evidence Traceability

Every delivered Evidence Set shall record:

* Request Identifier
* Requesting Platform
* Requesting Engine
* Source Artifacts
* Source Versions
* Retrieval Timestamp
* Provider
* Authority Level
* Selection Criteria

Evidence shall remain fully traceable throughout the engineering lifecycle.

---

# 18. Architectural Constraints

Evidence Acquisition shall:

* Never modify engineering artifacts.
* Never infer unsupported facts.
* Never bypass lifecycle governance.
* Never retrieve non-authoritative artifacts by default.
* Never perform engineering reasoning.

Its responsibility ends when authoritative evidence has been successfully delivered.

---

# 19. Relationship to Other Documents

The Artifact Model defines the engineering objects retrieved as evidence.

The Lifecycle Model determines artifact eligibility based on lifecycle state.

The Engineering Graph Model enables discovery and navigation of related artifacts.

The Traceability Model defines traversal across engineering relationships.

The Context Assembly Model transforms Evidence Sets into Context Packages.

The Engineering Event Model records evidence acquisition activities.

AiHarness evaluates evidence using Rule Packs and Review Profiles.

ASF consumes evidence for planning, task generation, orchestration, and execution.
