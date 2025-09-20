# Architecture Overview

## Business Goal
To build a scalable, cloud-native order management system for GloSleep Mattresses that automates the flow from supplier procurement to customer sales.

## High-Level Architecture
The application follows a **microservices architecture** with clear domain boundaries. Each service owns its data and exposes a well-defined API.

- **Frontend:** A single React/Next.js dashboard (to be implemented) will consume all backend APIs.
- **Backend:** Comprises five core Node.js services communicating via REST.
- **Data:** Each service will have a dedicated MongoDB collection, promoting loose coupling.
- **Infrastructure:** The system is designed to run on Kubernetes, locally via Kind, and in production on AWS EKS.
- **Observability:** Built-in metrics, logging, and tracing are first-class concerns.