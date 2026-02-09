import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useDispatchRaw, useSelector as useSelectorRaw } from 'react-redux';
import { personReducer } from './personSlice';

export const store = configureStore({
  reducer: {
    person: personReducer,
  },
  devTools: {
    name: 'cloud-time-tracker',
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelectorRaw;
export const useAppDispatch = () => useDispatchRaw<AppDispatch>();
