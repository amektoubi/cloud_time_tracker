# Component-Driven Frontend Architecture Standard

Framework-agnostic patterns for building maintainable, testable user interfaces through modular component composition.

---

## 🎯 Core Principles

### 1. Feature-Based Organization
- **Domain Cohesion**: Group components, styles, tests, and assets by feature/domain (e.g., `components/person/`, `components/auth/`)
- **Colocation**: Keep related files together (component + test + stories + styles in same directory)
- **Public API**: Each feature exports a single `index.ts` defining its public interface

### 2. Component Hierarchy
- **Presentational (Dumb) Components**: Pure UI, receive data via props, emit events
- **Container (Smart) Components**: Connect to state/store, handle business logic, pass data down
- **Atomic Design Layers**:
  - **Atoms**: Basic UI elements (Button, Input, Badge)
  - **Molecules**: Composed atoms (SearchBar = Input + Button)
  - **Organisms**: Complex sections (Header, Sidebar, Form)
  - **Templates**: Page layouts with placeholder content
  - **Pages**: Specific instances with real data

### 3. State Colocation Principle
- **Local State**: Keep state as close to where it's used as possible
- **Lift State**: Only elevate state when multiple components need access
- **Global State**: Reserve for cross-cutting concerns (auth, theme, user preferences)

---

## 🛠 Mandatory Patterns

### Pattern 1: Component API Design
```typescript
// ✅ GOOD: Explicit, type-safe props
interface PersonCardProps {
  person: {
    id: string
    name: string
    email: string
  }
  variant?: 'compact' | 'expanded'
  onClick?: (personId: string) => void
}

// ❌ BAD: Generic "any" or overly broad props
interface BadProps {
  data: any
  config: object
}
```

### Pattern 2: Unidirectional Data Flow
```
State Store → Container Component → Presentational Component → User Event → Action → State Store
```
- **Props Down**: Data flows from parent to child via props
- **Events Up**: Child components emit events (callbacks) to parents
- **No Sibling Communication**: Siblings communicate through shared parent state

### Pattern 3: Composition over Inheritance
```typescript
// ✅ GOOD: Slot-based composition
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>

// ❌ BAD: Deep inheritance chains
class ExtendedButton extends Button { ... }
class SuperExtendedButton extends ExtendedButton { ... }
```

### Pattern 4: Responsive-First Development
- **Mobile-First**: Build base styles for smallest viewport, enhance upward
- **Breakpoint Tokens**: Use semantic names (xs, sm, md, lg, xl) not pixel values
- **Touch Targets**: Minimum 44×44px interactive elements for mobile

### Pattern 5: Accessibility by Default
- **Semantic HTML**: Use proper elements (`<button>`, `<nav>`, `<article>`)
- **ARIA Labels**: Provide context for screen readers
- **Keyboard Navigation**: All interactive elements must be focusable via Tab
- **Color Contrast**: Minimum WCAG AA compliance (4.5:1 for text)

---

## 🧪 Testing Strategy

### Component Tests
- **Unit Tests**: Test individual component behavior with mocked props
- **Integration Tests**: Test component composition and event flow
- **Snapshot Tests**: Guard against unintended DOM changes

### Testing Pyramid
```
          E2E Tests (10%)
         /              \
Integration Tests (20%)  \
       /                  \
  Unit Tests (70%)        \
```

### Mocking Strategy
- **Props**: Pass controlled test data
- **Events**: Spy on callback functions
- **External Dependencies**: Mock API calls, store access

---

## 🎨 Styling Standards

### CSS Architecture
- **Utility-First**: Prefer utility classes (Tailwind, Bootstrap) over custom CSS
- **Component Scoping**: Use CSS Modules, styled-components, or framework scoping
- **Design Tokens**: Centralize colors, spacing, typography in tokens/theme system

### File Structure
```
components/
└── person/
    ├── PersonCard/
    │   ├── PersonCard.tsx          # Component
    │   ├── PersonCard.test.tsx     # Tests
    │   ├── PersonCard.stories.tsx  # Storybook
    │   ├── PersonCard.module.css   # Scoped styles
    │   └── index.ts                # Public API
    ├── PersonList/
    └── index.ts                    # Feature exports
```

---

## 🔄 State Integration Patterns

### Pattern A: Store Connection (Framework-Specific Adapter)
- **React**: `useSelector` / `useDispatch` hooks
- **Vue**: `mapState` / `mapActions` or Composition API
- **Svelte**: Stores with `subscribe` / `set` / `update`

### Pattern B: Container Pattern
```typescript
// Container: Connects to store
const PersonListContainer = () => {
  const persons = usePersonStore(state => state.persons)
  const fetchPersons = usePersonStore(state => state.fetchPersons)
  
  useEffect(() => { fetchPersons() }, [])
  
  return <PersonList persons={persons} />
}

// Presentational: Pure component
interface PersonListProps {
  persons: Person[]
}
const PersonList: React.FC<PersonListProps> = ({ persons }) => {
  return <div>{/* render list */}</div>
}
```

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **Prop Drilling** | Passing props through multiple levels | Use state colocation or context/store |
| **God Components** | Components with 200+ lines, multiple responsibilities | Split into smaller, focused components |
| **Inline Styles** | Hard to maintain, no theming support | Use utility classes or CSS-in-JS |
| **Magic Numbers** | `padding: 16px` scattered everywhere | Use design tokens (`spacing.md`) |
| **Boolean Props for Variants** | `isPrimary`, `isSecondary`, `isDisabled` | Use discriminated unions (`variant: 'primary' \| 'secondary'`) |

---

## 📦 Performance Patterns

### Lazy Loading
- **Route-Level**: Code-split by route/page
- **Component-Level**: Lazy load heavy components (modals, charts)
- **Conditional**: Only load components when needed (tabs, accordions)

### Memoization
- **React**: `React.memo`, `useMemo`, `useCallback`
- **Vue**: `v-once`, computed properties
- **Svelte**: `$:` reactive statements with guards

### Virtualization
- **Long Lists**: Use virtual scrolling for 100+ items
- **Windowing**: Only render visible items + buffer

---

## 🔗 Framework Adapter Interface

This abstract skill is implemented by framework-specific adapters:

| Adapter | Implements | Location |
|---------|------------|----------|
| `react-19` | Component syntax, hooks, JSX | `.opencode/stack-adapters/frontend/react-19/` |
| `vue-3` | Single-file components, Composition API | `.opencode/stack-adapters/frontend/vue-3/` |
| `svelte-5` | `.svelte` files, runes | `.opencode/stack-adapters/frontend/svelte-5/` |

**Adapter Responsibilities:**
- Translate abstract patterns to framework-specific syntax
- Provide framework-specific testing utilities
- Configure build tooling (Vite, Webpack, etc.)
- Implement state connection patterns for that framework

---

## ✅ Quality Checklist

Before marking a component task complete:

- [ ] Component is type-safe (no `any` types)
- [ ] Props are documented with JSDoc/TypeDoc
- [ ] Accessibility tested (screen reader, keyboard nav)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Unit tests cover happy path + edge cases
- [ ] No console errors/warnings in development
- [ ] Follows project's naming conventions
- [ ] No unused imports or dead code
- [ ] Storybook/visual tests created (if applicable)
