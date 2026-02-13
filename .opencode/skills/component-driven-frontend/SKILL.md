# Skill: Component-Driven Frontend Architecture

## 🎯 Core Principles
You are responsible for building modular, testable, and maintainable user interfaces using the **Atomic Design** philosophy.

### 1. The Component Hierarchy
*   **Atoms:** Basic UI elements (Buttons, Inputs, Badges). Purely presentational. No business logic.
*   **Molecules:** Composed atoms (Search Bar = Input + Button). Minimal local state.
*   **Organisms:** Complex sections (Header, Sidebar, User Profile Card). Can connect to global state.
*   **Templates/Pages:** Layouts populated with real data. These orchestrate the organisms.

### 2. Separation of Concerns (Container vs. Presentational)
*   **Smart (Container) Components:**
    *   *Role:* Connect to Store/API, handle data fetching, manage complex state.
    *   *Output:* Passes data down via Props.
    *   *Example:* `UserProfileContainer.tsx`
*   **Dumb (Presentational) Components:**
    *   *Role:* Render UI based ONLY on props. Emit events via callbacks.
    *   *Output:* HTML/JSX.
    *   *Example:* `UserProfileView.tsx` (receives `user` object and `onEdit` function).

### 3. State Management (Colocation Principle)
*   **Local State:** If state is only used by one component (e.g., `isOpen` for a modal), keep it local (`useState`).
*   **Lifted State:** If siblings need to share state, lift it to their common parent.
*   **Global State:** Only use Global Stores (Redux/Zustand/Pinia) for data that is truly app-wide (Auth, Theme, Notifications, Cached API Data).
*   **Server State:** Use tools like React Query/SWR for server data caching if available in the stack.

## 🛠 Coding Standards
### 1. Prop Design (Type Safety)
*   **Explicit Interface:** Always define a strict interface for Props. Avoid `any`.
    *   *Bad:* `props: { user: any }`
    *   *Good:* `interface Props { user: UserDTO; onSave: (u: UserDTO) => void; }`
*   **Composition:** Use `children` or `slots` for content injection rather than passing massive config objects.

### 2. Styling (Scoped)
*   **Isolation:** Styles must be scoped to the component (CSS Modules, Styled Components, or Shadow DOM).
*   **Utility Classes:** If a utility framework (Tailwind/Bootstrap) is present, prefer utility classes over custom CSS for layout (margin/padding).
*   **Tokens:** Use Design Tokens (CSS Variables) for colors and spacing to maintain consistency.

### 3. Testing Strategy
*   **Unit Tests:** Test *Presentational Components* by rendering them with mock props and asserting output (Snapshot/Text content).
*   **Integration Tests:** Test *Container Components* by mocking the Store/API and simulating user interactions (Click/Type).
*   **Accessibility (a11y):** Ensure all interactive elements are keyboard accessible and have ARIA labels.

## 🚫 Anti-Patterns
1.  **Prop Drilling:** Passing props down 4+ levels. Solution: Use Context or Composition.
2.  **God Components:** A single file > 300 lines handling UI, API, and Logic. Solution: Split into sub-components and custom hooks.
3.  **Inline Styles:** Hardcoding `style={{ margin: '20px' }}`. Solution: Use classes or design tokens.

## 🔄 Interaction with Other Agents
*   **With Backend Specialist:** Agree on the API Response structure (DTO) *before* writing the API integration code.
*   **With Orchestrator:** Report if a UI design requires backend changes (e.g., "I need a `getUsersByRole` endpoint to implement this filter").
