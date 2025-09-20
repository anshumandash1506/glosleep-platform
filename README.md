# GloSleep Mattresses - Order Management Platform

A production-grade microservices project for DevOps and cloud learning.

## Project Log
### Day 1 - $(date +%Y-%m-%d)
*   **Goal:** Define the architectural foundation and tech stack.
*   **Progress:**
    *   Created and populated `overview.md` and `architecture-decisions.md`.
    *   Defined the five core microservices and their responsibilities.
    *   Finalized key technology choices (Node.js, MongoDB, K8s) with rationale.
*   **Next Steps:** Implement the Auth Service with Dockerfile and K8s manifests.
*   **Decisions:** Formalized architecture decisions in an ADR log for maintainability.
### Day 1 - $(date +%Y-%m-%d)
*   **Goal:** Initialize the project repository and foundational documentation structure.
*   **Progress:** 
    *   Created the GitHub repo `glosleep-platform`.
    *   Established the Docs-as-Code structure with `/docs` directory.
    *   Defined the 5 core microservices (Auth, Inventory, Procurement, Order, Analytics).
*   **Next Steps:** Define the tech stack in `architecture-decisions.md` and build the Auth Service.
*   **Decisions:** Chose a Docs-as-Code approach for documentation to keep it version-controlled and always in sync.

## Documentation Index

*   [Architecture Overview](./docs/01-architecture/overview.md)
*   [Architecture Decisions](./docs/01-architecture/architecture-decisions.md)