/**
 * @fileoverview Test utilities for Redux testing
 */

import React from 'react';
import { render as rtlRender, type RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { personReducer } from './stores/personSlice';
import type { PersonState } from './stores/personSlice';

interface TestStoreState {
  person: PersonState;
}

function createTestStore(preloadedState?: Partial<TestStoreState>) {
  return configureStore({
    reducer: {
      person: personReducer,
    },
    preloadedState: preloadedState as TestStoreState,
  });
}

export function renderWithStore(
  ui: React.ReactElement,
  preloadedState?: Partial<TestStoreState>
): RenderResult {
  const store = createTestStore(preloadedState);
  return rtlRender(<Provider store={store}>{ui}</Provider>);
}

export { createTestStore };
