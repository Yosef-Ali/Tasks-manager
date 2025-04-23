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
-   A **database** for storing application data (users, tasks, documents, notifications).
-   **Backend functions** (queries and mutations) that act as the API for the frontend to interact with the database.
-   **Authentication** capabilities.
-   **File storage** capabilities.

**Data Flow:**
The frontend interacts with the Convex backend functions using the **Convex React SDK**.
-   **Fetching Data:** To retrieve data from the database (e.g., listing tasks, getting document details), frontend components use the `useQuery` hook provided by the Convex React SDK. This hook automatically subscribes to data changes, ensuring the UI stays updated in real-time. The `useQuery` hook calls specific query functions defined in the Convex backend.
-   **Modifying Data:** To perform actions that change data in the database (e.g., creating a task, updating a document status, deleting a task), frontend components use the `useMutation` hook. This hook calls specific mutation functions defined in the Convex backend, which handle the logic for inserting, updating, or deleting data in the Convex database.

**Authentication Flow:**
Authentication is handled directly by **Convex**.
-   Convex provides built-in authentication features that allow users to sign up, log in, and manage sessions.
-   The Convex React SDK integrates with this authentication system, allowing frontend components to access the authenticated user's identity and manage authentication state.
-   Convex backend functions can access the authenticated user's identity, enabling the implementation of security rules and authorization logic to control data access and modifications.

## Architecture Diagram

```mermaid
graph TD
    A[Frontend <br> (Next.js, React)] -->|Calls useQuery/useMutation| B(Convex Backend <br> (Functions))
    B -->|Fetches/Modifies Data| C(Convex Database)
    A -->|Authenticates with Convex| B
    B -->|Authorizes Access based on User Identity| C
```

This diagram illustrates how the frontend relies on Convex backend functions to interact with the database, with Convex's built-in authentication layer securing these interactions.