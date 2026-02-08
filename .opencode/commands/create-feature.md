---
description: Generates a new frontend feature module
agent: react-expert
---

# Create Frontend Feature: [featureName]

1. Create a directory `front/src/components/[featureName]/`.
2. Create a main component `[featureName]List.tsx` using Bootstrap 5.
3. Define types in `front/src/types/[featureName].ts` matching the backend DTO.
4. Create a Zustand store in `front/src/stores/use[featureName]Store.ts` with actions for CRUD.
5. Add an entry to the API service in `front/src/services/api.ts`.
6. Register the route in `front/src/App.tsx` using lazy loading.
