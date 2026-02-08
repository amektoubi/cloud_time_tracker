# React Frontend: React 19 & Zustand Standard

Modern, type-safe frontend patterns optimized for React 19 and mobile-ready interfaces.

## 🛠 Tech Stack Standard
- **Framework**: React 19 + TypeScript + Vite 7
- **State Management**: Zustand (Atomic stores with devtools)
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **Forms**: React Hook Form (Uncontrolled components for performance)
- **Networking**: Axios with interceptors for JWT management

## 🎯 Mandatory Patterns
1. **Feature-Based Structure**: Organize components by domain (e.g., `src/components/person/`).
2. **Store Logic**: Business logic, API calls, and data normalization must reside in Zustand stores, not components.
3. **Optimistic Updates**: UI must reflect changes immediately; rollback state only on API failure.
4. **Form Validation**: Use `react-hook-form` with consistent error messaging via Bootstrap feedback classes.
5. **Responsive Design**: Always use Bootstrap's grid system (`Container`, `Row`, `Col`) to ensure mobile-first compatibility.

## 🎨 Component Guidelines
- Use **Functional Components** with `React.FC`.
- Destructure props in the function signature.
- Use **Lazy Loading** (`lazy()`, `Suspense`) for all top-level route components.
- Implement **Error Boundaries** at the feature level to prevent total app crashes.

## 🚫 Avoid
- Avoid `Prop Drilling`: Use Zustand for shared state.
- Avoid inline styles: Use Bootstrap utility classes or SCSS.
- Avoid `any`: Use strict TypeScript interfaces for all API responses.
- **NEVER** add a new library to `package.json` without asking the user.
