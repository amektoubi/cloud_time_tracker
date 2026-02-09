import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/stores/store';

interface TestUtilsProps {
  children: React.ReactNode;
}

function Wrapper({ children }: TestUtilsProps): ReactElement {
  return <Provider store={store}>{children}</Provider>;
}

export function renderWithStore(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): ReturnType<typeof render> {
  return render(ui, { wrapper: Wrapper, ...options });
}

export { Wrapper };
