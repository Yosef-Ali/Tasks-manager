# Hospital Dashboard Architecture Overview

This document provides a high-level overview of the architecture for the Hospital Dashboard project, focusing on the interaction between the frontend and the backend powered by Convex.

## Project Stack

-   **Frontend:** Next.js (App Router), React, TypeScript, Shadcn/ui, Tailwind CSS
-   **Backend:** Convex (Database, Functions, Authentication, File Storage)
-   **Authentication:** Convex's built-in authentication

## Frontend-Backend Interaction

The project employs a clear separation between the frontend and backend.

**Frontend:**
The frontend is built using **Next.js** with **TypeScript**, leveraging the **App Router** for routing and server-side rendering capabilities. **React** is used for building the user interface components. **Shadcn/ui** provides a set of pre-built, accessible UI components located in the `components/ui/` directory, and **Tailwind CSS** is used for styling, allowing for rapid and consistent styling across the application.

**Backend:**
The backend is powered by **Convex**, which serves as a full-stack backend-as-a-service. Convex provides:
-   A **database** for storing application data (patients, medical records, appointments, staff schedules, medications, and notifications).
-   **Backend functions** (queries and mutations) that act as the API for the frontend to interact with the database.
-   **Authentication** capabilities with role-based access control for different hospital staff.
-   **File storage** capabilities for medical images, documents, and patient records.
-   **Real-time synchronization** critical for hospital environments where data currency can impact patient care.

**Data Flow:**
The frontend interacts with the Convex backend functions using the **Convex React SDK**.
-   **Fetching Data:** To retrieve data from the database (e.g., patient lists, appointment schedules, medical records), frontend components use the `useQuery` hook provided by the Convex React SDK. This hook automatically subscribes to data changes, ensuring the UI stays updated in real-time. The `useQuery` hook calls specific query functions defined in the Convex backend.
-   **Modifying Data:** To perform actions that change data in the database (e.g., updating patient status, scheduling appointments, recording medications), frontend components use the `useMutation` hook. This hook calls specific mutation functions defined in the Convex backend, which handle the logic for inserting, updating, or deleting data in the Convex database.
-   **Real-time Updates:** Critical for hospital operations, all connected clients receive immediate updates when data changes, ensuring that all staff have the most current information about patients and resources.

**Data Security and Compliance:**
-   **HIPAA Compliance:** The architecture implements security measures aligned with healthcare data protection standards.
-   **Access Control:** Granular permissions ensure staff can only access patient data relevant to their role.
-   **Audit Logging:** All data access and modifications are logged for compliance and security auditing.
-   **Data Encryption:** Patient data is encrypted both in transit and at rest using industry-standard encryption protocols.

**Offline Capabilities:**
-   The architecture supports limited offline functionality, allowing critical operations to continue during network interruptions with data synchronization once connectivity is restored.

## Architecture Diagram

```mermaid
graph TD
    A[Frontend <br> (Next.js, React)] -->|Calls useQuery/useMutation| B(Convex Backend <br> (Functions))
    B -->|Fetches/Modifies Data| C(Convex Database)
    A -->|Authenticates with Convex| B
    B -->|Authorizes Access based on User Identity| C
```

This diagram illustrates how the frontend relies on Convex backend functions to interact with the database, with Convex's built-in authentication layer securing these interactions.