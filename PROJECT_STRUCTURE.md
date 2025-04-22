# Project Structure Overview: hospital-dashboard-two

This document outlines the structure of the `hospital-dashboard-two` project based on analysis of the file system and code definitions.

## Summary

*   **Framework & Language:** It's a **Next.js** application using **TypeScript** and the **App Router** convention for routing and page structure.
*   **Styling:** **Tailwind CSS** is used for styling, configured via `tailwind.config.ts` and `postcss.config.mjs`. Global styles are in `app/globals.css`.
*   **UI Components:**
    *   Located primarily in the `components/` directory.
    *   Uses a base UI library, strongly indicated to be **Shadcn/ui** (based on `components.json` and component structure), within `components/ui/`.
    *   Contains higher-level layout components (`components/layout/`), page-level composition components (`components/pages/`, and potentially root files like `dashboard-content.tsx`), and feature-specific components (`components/calendar/`, `components/chat/`, `components/kanban/`).
*   **Routing:** Handled by the directory structure within `app/`. Each folder (e.g., `app/calendar`, `app/tasks`) represents a route segment, and the `page.tsx` file within defines the UI for that route.
*   **State Management & Logic:** Likely handled within components, potentially using React Context (implied by `ThemeProvider`, `SidebarProvider`) and custom hooks found in the `hooks/` directory. Utility functions reside in `lib/`.
*   **Static Assets:** Stored in the `public/` directory.
*   **Type Definitions:** Custom TypeScript types are defined in the `types/` directory.
*   **Configuration:** Standard configuration files for Node.js/Next.js (`package.json`, `next.config.mjs`), TypeScript (`tsconfig.json`), Git (`.gitignore`), and the UI library (`components.json`) are present at the root.

## Visual Representation (Mermaid Diagram)

```mermaid
graph TD
    A[hospital-dashboard-two] --> B(app);
    A --> C(components);
    A --> D(hooks);
    A --> E(lib);
    A --> F(public);
    A --> G(styles);
    A --> H(types);
    A --> I(package.json);
    A --> J(next.config.mjs);
    A --> K(tailwind.config.ts);
    A --> L(components.json);

    B --> B1(layout.tsx);
    B --> B2(page.tsx);
    B --> B3(globals.css);
    B --> B4(calendar/page.tsx);
    B --> B5(chat/page.tsx);
    B --> B6(tasks/page.tsx);
    B --> B7(...other routes);

    C --> C1(dashboard-content.tsx);
    C --> C2(header.tsx);
    C --> C3(sidebar.tsx);
    C --> C4(layout/);
    C --> C5(pages/);
    C --> C6(ui/);
    C --> C7(calendar/);
    C --> C8(chat/);
    C --> C9(kanban/);

    C6 --> C6a(button.tsx);
    C6 --> C6b(card.tsx);
    C6 --> C6c(input.tsx);
    C6 --> C6d(table.tsx);
    C6 --> C6e(department-card.tsx);
    C6 --> C6f(...many UI elements);

    subgraph "Root Config"
        I J K L
    end

    subgraph "Routing & Pages"
        B1 B2 B3 B4 B5 B6 B7
    end

    subgraph "UI Components"
        C1 C2 C3 C4 C5 C6 C7 C8 C9
    end

    subgraph "Base UI (Shadcn?)"
        C6a C6b C6c C6d C6e C6f
    end