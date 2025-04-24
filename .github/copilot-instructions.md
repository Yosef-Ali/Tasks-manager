# GitHub Copilot Instructions for Hospital Dashboard

## 🏥 Project Context
- **Application Type:** Administrative dashboard for hospital operations, focusing on licensing, permits, and compliance—not direct medical treatment
- **Frameworks:** Next.js 15 (App Router), React 19, Convex backend
- **UI Library:** Shadcn UI with Tailwind CSS v4
- **Design System:** Customizable via Shadcn's Open Code approach, facilitating AI integration and component-level customization
- **Documentation:** Utilizes Context7 MCP for internal documentation and package management

## 🧠 Copilot Behavior Guidelines

### TypeScript & Data Modeling
- Enforce strict typing with comprehensive interfaces for all data models
- Utilize enums for predefined values (e.g., license types, permit statuses)
- Incorporate JSDoc comments for all functions and complex types

### React Components
- Adhere to atomic design principles (atoms, molecules, organisms)
- Implement functional components using hooks
- Integrate error boundaries for critical sections
- Ensure accessibility attributes are present on all UI elements

### Data Handling
- Use Convex mutations exclusively for data modifications
- Implement optimistic updates where appropriate
- Handle loading, error, and empty states for all data fetches
- Validate data thoroughly before backend submission

## 🛡️ Security & Compliance
- Avoid logging Protected Health Information (PHI)
- Implement data masking techniques for sensitive information
- Enforce authentication checks prior to accessing sensitive data
- Maintain audit logs for all data access operations

## 🎨 UI/UX Patterns
- Utilize color schemes adhering to healthcare industry standards
- Maintain clear information hierarchy for critical data
- Design responsive interfaces compatible with various hospital devices
- Format dates and times appropriately for medical records

## 🧰 Helper Functions
- Incorporate comprehensive error handling
- Validate parameters rigorously
- Consider edge cases specific to healthcare data
- Implement caching strategies for frequently accessed data

## 🧪 Testing Guidelines
- Mock Convex backend functions during tests
- Test edge cases for data validation
- Verify rendering of critical UI components
- Simulate various user roles (e.g., doctor, nurse, admin)

## 🔐 Security Considerations
- Adopt secure patterns for handling authentication
- Sanitize all user inputs
- Implement role-based access control
- Ensure secure storage practices for sensitive data

## 📦 Shadcn UI Integration
- Utilize the latest Shadcn CLI (npx shadcn@latest init) for project initialization, supporting Next.js 15 and React 19
- Leverage the Open Code approach for full component customization
- Employ the add command to integrate components, themes, hooks, and utilities as needed

## Healthcare-Specific Guidelines

### Data Models
When suggesting data models, include healthcare-specific fields such as:
- **Administrative Records:** License numbers, expiration dates, compliance status, inspection history
- **Facility Management:** Room allocation, equipment inventory, maintenance schedules
- **Staff Management:** Credentials, certifications, specialties, administrative roles
- **Regulatory Tracking:** Permit status, renewal dates, compliance requirements
