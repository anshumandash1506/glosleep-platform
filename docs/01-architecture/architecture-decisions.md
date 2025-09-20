# Architecture Decisions Record (ADR)

This log lists the key technology decisions made for the GloSleep platform.

## ADR 1: Microservices over Monolith
*   **Status:** Accepted
*   **Context:** Need for independent scalability of business domains (e.g., Inventory vs. Analytics) and team autonomy.
*   **Decision:** Use a microservices architecture.
*   **Consequences:** Increased complexity in deployment and inter-service communication but provides long-term agility and scalability.

## ADR 2: Node.js + Express for Backend
*   **Status:** Accepted
*   **Context:** Need for a lightweight, fast-to-develop, and widely supported runtime for API services.
*   **Decision:** Use Node.js with the Express framework for all backend services.
*   **Consequences:** Uniformity across teams, vast npm ecosystem. Potential performance limitations for CPU-intensive tasks are acceptable for this business domain.

## ADR 3: MongoDB as the Data Store
*   **Status:** Accepted
*   **Context:** Data model is document-oriented (e.g., an Order with nested items). Need for flexible schema and rapid development.
*   **Decision:** Use MongoDB for all services.
*   **Consequences:** Fast iteration. Requires careful design to avoid data duplication and manage relationships across services.

## ADR 4: Kubernetes for Orchestration
*   **Status:** Accepted
*   **Context:** Need to manage the deployment, scaling, and networking of multiple service containers.
*   **Decision:** Use Kubernetes (via Kind for local, EKS for production).
*   **Consequences:** Standardized deployment model, built-in service discovery, and self-healing. Steeper initial learning curve.

## ADR 5: DevOps & GitOps Approach
*   **Status:** Accepted
*   **Context:** Need for automated, reliable, and auditable deployments.
*   **Decision:** Use GitHub Actions for CI and ArgoCD for CD (GitOps).
*   **Consequences:** Faster release cycles, rollback capability, and infrastructure defined as code.