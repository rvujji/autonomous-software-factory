# ASF Foundation Charter

## Purpose

The ASF Foundation Charter defines the vision, mission, scope, governance boundaries, and guiding philosophy of the Autonomous Software Factory (ASF).

It serves as the highest-level document in the ASF documentation hierarchy and acts as the north star for all future architectural, engineering, and implementation decisions.

The Charter does **not** define implementation details. Those belong to lower-level architecture and engine specifications.

---

# Vision

The Autonomous Software Factory (ASF) is a technology-neutral Engineering Operating System that transforms authoritative knowledge into production-ready software with minimal human intervention.

ASF is not an AI coding tool.

ASF governs the complete software engineering lifecycle, from validating knowledge through planning, implementation, review, repair, and release.

Its purpose is to automate engineering while ensuring that business intent, architectural integrity, governance, and quality remain under human control.

The first workload of ASF is the Behavioral Wellness Platform. However, ASF itself remains domain-independent and should be capable of building any future software product.

---

# Mission

ASF exists to:

* Transform business knowledge into executable software.
* Minimize manual engineering effort.
* Maximize architectural consistency.
* Maintain complete traceability from requirements to released software.
* Continuously validate engineering quality.
* Allow humans to focus on intent rather than implementation.

---

# Scope

ASF governs the engineering lifecycle.

It is responsible for:

* Understanding knowledge.
* Validating documentation.
* Detecting inconsistencies.
* Suggesting knowledge improvements.
* Building implementation plans.
* Creating executable task packages.
* Delegating implementation.
* Reviewing generated artifacts.
* Coordinating repairs.
* Managing traceability.
* Governing artifact lifecycles.

ASF is **not** responsible for writing production code directly.

Code generation is delegated to execution backends.

---

# Human Responsibilities

Humans remain responsible for:

* Business vision.
* Product requirements.
* Architectural decisions.
* Knowledge approval.
* Governance approval.
* Release approval.
* Exceptional engineering decisions.

Humans should not manually coordinate implementation tasks or produce repetitive engineering artifacts.

---

# AI Responsibilities

ASF automates:

* Knowledge analysis.
* Completeness validation.
* Gap detection.
* Improvement recommendations.
* Dependency analysis.
* Engineering planning.
* Task decomposition.
* Context preparation.
* Traceability management.
* Artifact review.
* Repair orchestration.
* Regression detection.
* Release readiness.

---

# Core Philosophy

ASF follows one fundamental principle:

> **Knowledge is the source of truth. Code is a derived artifact.**

Every engineering activity originates from validated knowledge.

Implementation never precedes validated documentation.

---

# Governance Model

ASF owns engineering governance.

Execution backends own implementation.

Skills own implementation expertise.

This separation is mandatory and must never be violated.

---

# Technology Independence

ASF must remain independent of:

* Programming languages
* Frameworks
* Databases
* AI models
* IDEs
* Execution platforms

Execution backends are replaceable without affecting ASF architecture.

---

# Execution Backends

ASF delegates implementation to execution backends.

The initial execution backend is:

* OpenCode

Future execution backends may include:

* Claude Code
* Cursor
* Gemini CLI
* GitHub Copilot
* Future autonomous coding systems

ASF communicates through structured task packages rather than implementation-specific instructions.

---

# Skills

Implementation knowledge belongs to Skills.

Examples include:

* React Web
* React Native
* FastAPI
* PostgreSQL
* Testing
* CI/CD

ASF never duplicates implementation standards already encapsulated within Skills.

ASF decides **what** should be built.

Skills define **how** it should be implemented.

---

# Current Technology Stack

Initial implementation stack:

**Frontend**

* React Web
* React Native

**Backend**

* FastAPI

**Database**

* PostgreSQL

**Architecture**

* Modular Monolith

**Execution Backend**

* OpenCode

**Engineering Governance**

* AiHarness

---

# AiHarness

AiHarness is the governance intelligence of ASF.

Responsibilities include:

* Understanding knowledge.
* Validating specifications.
* Detecting inconsistencies.
* Suggesting improvements.
* Building engineering plans.
* Creating execution packages.
* Reviewing generated artifacts.
* Coordinating repairs.
* Maintaining traceability.
* Enforcing governance rules.

AiHarness does not generate production code.

---

# OpenCode

OpenCode is an execution backend.

Responsibilities include:

* Loading required Skills.
* Planning implementation.
* Generating code.
* Running tests.
* Applying repairs.
* Producing engineering artifacts.

OpenCode does not own governance.

---

# Engineering Lifecycle

Every project follows the same lifecycle:

Knowledge

↓

Validation

↓

Knowledge Improvements

↓

Human Approval

↓

Knowledge Freeze

↓

Engineering Planning

↓

Task Package Generation

↓

Execution

↓

Review

↓

Repair

↓

Freeze

↓

Release

Implementation begins only after knowledge has been validated and frozen.

---

# Long-Term Vision

ASF is designed to become a reusable engineering platform capable of producing any software system from authoritative knowledge.

The Behavioral Wellness Platform serves as the first proof that the factory works.

Future products should require only a different knowledge base while reusing the same engineering process.

---

# Success Criteria

ASF is considered successful when it can:

* Understand authoritative knowledge.
* Validate and improve specifications.
* Produce deterministic engineering plans.
* Generate executable task packages.
* Coordinate AI implementation.
* Automatically review and repair generated artifacts.
* Maintain complete traceability.
* Deliver production-ready software with minimal human intervention.

---

# Document Hierarchy

This Foundation Charter defines the purpose and direction of ASF.

The following documents derive from this Charter:

1. ASF Constitution
2. ASF Platform Architecture
3. ASF Domain Model
4. ASF Lifecycle Model
5. ASF Graph & Traceability Model
6. ASF Engine Catalog
7. Engine Specifications
8. Implementation
