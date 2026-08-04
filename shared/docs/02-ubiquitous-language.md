# Shared Engineering Services (SES)

# Ubiquitous Language

**Version:** 0.1

**Status:** Draft

---

# 1. Purpose

The Ubiquitous Language defines the canonical engineering vocabulary shared by all platforms within the Engineering Platform ecosystem.

Its purpose is to ensure that every document, engine, service, workflow, implementation, and AI agent uses the same terminology with the same meaning.

This document is the authoritative source for engineering terminology.

All other documents shall reference these definitions rather than redefining them.

---

# 2. Principles

The Ubiquitous Language follows these principles.

* Every engineering concept has exactly one canonical name.
* A term shall have exactly one meaning.
* Synonyms are prohibited.
* Definitions shall be technology independent.
* Definitions shall remain stable over time.
* Every platform shall adopt this language without modification.

---

# 3. Core Terms

## Artifact

A managed engineering object.

Artifacts are the fundamental building blocks of the Engineering Platform.

Every managed object is an Artifact.

Examples include:

* Knowledge
* Requirement
* Architecture
* Domain Model
* Plan
* Task
* Task Package
* Source File
* API
* Test
* Review
* Finding
* Suggestion
* Release

---

## Knowledge

Authoritative engineering information approved for engineering use.

Knowledge defines engineering intent.

Knowledge may include requirements, architecture, standards, specifications, business rules, and design decisions.

Source code is not Knowledge.

---

## Requirement

A statement describing an expected capability, behavior, or constraint of a system.

Requirements define **what** shall be achieved.

---

## Architecture

The structural organization of a system.

Architecture defines responsibilities, boundaries, interactions, and ownership.

Architecture does not define implementation.

---

## Domain Model

The canonical representation of concepts, entities, relationships, and invariants within a domain.

---

## Capability

A business or engineering ability that a platform must provide.

Capabilities define outcomes.

They do not define implementation.

---

## Engine

A cohesive software component responsible for implementing one or more capabilities.

Each Engine owns one primary responsibility.

---

## Lifecycle

The governed sequence of states through which an Artifact progresses.

Every Artifact possesses a lifecycle.

---

## Version

A uniquely identifiable revision of an Artifact.

Frozen versions are immutable.

---

## Relationship

A defined connection between two Artifacts.

Relationships are first-class engineering objects.

---

## Traceability

The ability to navigate engineering relationships across the complete lifecycle of an Artifact.

Traceability explains why an Artifact exists, how it was produced, and what it affects.

---

## Engineering Knowledge Graph

The canonical graph representing engineering Artifacts and their relationships.

Different engineering activities operate on different projections of the same graph.

---

## Graph Projection

A logical view of the Engineering Knowledge Graph created for a specific engineering purpose.

Examples include:

* Knowledge View
* Planning View
* Review View
* Dependency View
* Impact View

---

## Evidence

Authoritative factual information used to support an engineering decision or review.

Evidence is derived from Artifacts.

Evidence is never inferred without support.

---

## Evidence Set

A collection of evidence assembled to support one engineering activity.

Examples include:

* Review
* Planning
* Impact Analysis
* Validation

---

## Context

The minimal, relevant engineering information assembled to perform a specific task.

Context is derived from Evidence.

Context is not equivalent to an entire document collection.

---

## Review

A governed evaluation of one or more Artifacts against approved engineering rules.

Reviews produce Findings.

---

## Finding

An issue, observation, or result identified during a Review.

Every Finding shall reference supporting Evidence.

---

## Suggestion

A proposed improvement generated from one or more Findings.

Suggestions require explicit approval before becoming engineering changes.

---

## Knowledge Patch

An approved modification applied to an existing Knowledge Artifact.

Knowledge Patches preserve engineering history.

---

## Rule

A deterministic engineering constraint evaluated during governance.

Rules belong to Rule Packs.

---

## Rule Pack

A reusable collection of related engineering rules.

Multiple Review Profiles may use the same Rule Pack.

---

## Review Profile

A reusable review configuration defining:

* Applicable Rule Packs
* Required Evidence
* Review Sequence
* Report Format

---

## Governance

The process of ensuring engineering activities comply with approved knowledge, policies, standards, and constitutional principles.

---

## Execution Backend

An external platform responsible for implementing engineering work.

Execution Backends do not own engineering governance.

Examples include OpenCode and future execution platforms.

---

## Skill

Reusable implementation expertise for a technology, framework, language, or engineering discipline.

Skills guide implementation.

They do not define engineering governance.

---

## Task

A unit of engineering work produced during planning.

Tasks describe work.

Tasks are not execution contracts.

---

## Task Package

An immutable execution contract generated from a Task.

A Task Package contains all information required by an Execution Backend to perform engineering work.

---

## Approval

An explicit human decision authorizing progression to the next governed lifecycle state.

Approval cannot be inferred automatically.

---

## Freeze

A lifecycle state indicating an Artifact is immutable.

Frozen Artifacts may only evolve by creating a new version.

---

# 4. Naming Rules

Engineering terminology shall satisfy the following rules.

* One concept → One name.
* One name → One meaning.
* Avoid abbreviations unless universally accepted.
* Prefer business language over implementation language.
* Avoid technology-specific terminology in shared concepts.

---

# 5. Ownership

The Shared Engineering Services layer owns this Ubiquitous Language.

ASF, AiHarness, and all future engineering platforms shall adopt these definitions without modification.

Platform-specific terminology may extend this language but shall not redefine existing terms.

---

# 6. Governance

Changes to the Ubiquitous Language require:

* Impact Analysis
* Human Approval
* Version Increment
* Traceability Update

Terminology changes are considered architectural changes.

---

# 7. Relationship to Other Documents

The Ubiquitous Language is the foundational document for the Engineering Platform.

All Shared Engineering Services, AiHarness, ASF, and future platform documents shall use the terminology defined herein.

No document shall redefine a term that already exists within the Ubiquitous Language.
