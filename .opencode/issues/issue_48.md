# Issue #48: US-017: Migrate Frontend State from Zustand to Redux

**Priority:** P1 (High)
**Type:** Technical Refactor

---

## Description

**As a** Frontend Developer,
**I want** to replace the existing Zustand state management implementation with Redux Toolkit,
**So that** we align with the team's standard architecture and utilize Redux DevTools for complex state debugging.

**Acceptance Criteria:**
- **Dependencies:** Zustand is uninstalled; `@reduxjs/toolkit` and `react-redux` are installed.
- **Store Setup:** The global Redux store is configured, and the `<Provider>` wraps the root application.
- **Migration:** All existing Zustand stores (e.g., Auth, Theme, or Data stores) are converted to Redux Slices.
- **Component Updates:** All React components currently using Zustand hooks are refactored to use `useSelector` and `useDispatch`.
- **Verification:** The application functions exactly as before (no regression in features), and the Redux DevTools extension correctly visualizes state changes.

---

## Plan

_TODO: Define implementation steps_

---

## Technical Plan

### Architecture Decisions
- **Store Structure:** Single Redux Slice (`personSlice`) to maintain current behavior
- **Naming Convention:** Pure Redux patterns with separate selectors
- **Directory Structure:** Keep simple, use existing `stores/` directory
- **Test Strategy:** Redux built-in `renderWithStore` wrapper pattern

### Implementation Steps

1. **Install Dependencies**
   - Uninstall `zustand`
   - Install `@reduxjs/toolkit` and `react-redux`

2. **Create Redux Store Structure**
   - `front/src/stores/personSlice.ts` - Redux Toolkit slice with async thunks and reducers
   - `front/src/stores/store.ts` - Store configuration with devtools
   - `front/src/stores/hooks.ts` - Typed useSelector and useDispatch hooks

3. **Configure Provider**
   - Update `front/src/main.tsx` to wrap App with Redux Provider

4. **Refactor Components**
   - Update `PersonList.tsx` - Replace `usePersonStore()` with `useSelector`/`useDispatch`
   - Update `PersonForm.tsx` - Replace `usePersonStore()` with `useSelector`/`useDispatch`
   - Update `PersonDetails.tsx` - Replace `usePersonStore()` with `useSelector`/`useDispatch`
   - Update `PersonStatistics.tsx` - Replace `usePersonStore()` with `useSelector`/`useDispatch`

5. **Update Tests**
   - Create `front/tests/utils/test-utils.tsx` with `renderWithStore` wrapper
   - Update test files to mock selectors/thunks instead of `usePersonStore`
   - Update `PersonList.test.tsx`
   - Update `PersonForm.test.tsx`
   - Update `PersonDetails.test.tsx`
   - Update `PersonStatistics.test.tsx`
   - Update `App.test.tsx`

6. **Cleanup**
   - Delete `front/src/stores/usePersonStore.ts`
   - Run lint: `npm run lint`
   - Run tests: `npm run test`
   - Verify build: `npm run build`

### File Changes Summary

| Action | File |
|--------|------|
| Create | `front/src/stores/personSlice.ts` |
| Create | `front/src/stores/store.ts` |
| Create | `front/src/stores/hooks.ts` |
| Modify | `front/src/main.tsx` |
| Modify | `front/src/components/person/PersonList.tsx` |
| Modify | `front/src/components/person/PersonForm.tsx` |
| Modify | `front/src/components/person/PersonDetails.tsx` |
| Modify | `front/src/components/person/PersonStatistics.tsx` |
| Create | `front/tests/utils/test-utils.tsx` |
| Modify | `front/tests/PersonList.test.tsx` |
| Modify | `front/tests/PersonForm.test.tsx` |
| Modify | `front/tests/PersonDetails.test.tsx` |
| Modify | `front/tests/PersonStatistics.test.tsx` |
| Modify | `front/tests/App.test.tsx` |
| Delete | `front/src/stores/usePersonStore.ts` |

---

## Progress Tracking

- [x] Install Redux dependencies (@reduxjs/toolkit, react-redux)
- [x] Create personSlice.ts with async thunks and reducers
- [x] Create store.ts with devtools configuration
- [x] Create typed hooks in hooks.ts
- [x] Update main.tsx with Redux Provider
- [x] Refactor PersonList.tsx to use useSelector/useDispatch
- [x] Refactor PersonForm.tsx to use useSelector/useDispatch
- [x] Refactor PersonDetails.tsx to use useSelector/useDispatch
- [x] Refactor PersonStatistics.tsx to use useSelector/useDispatch
- [x] Create test-utils.tsx with renderWithStore
- [x] Update test mocks to use selectors/thunks
- [x] Delete usePersonStore.ts
- [x] Run lint and fix any issues
- [x] Run tests and ensure all pass
- [x] Run build and verify production build works

---

## Progress

- [ ] Issue downloaded and initialized
