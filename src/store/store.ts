import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

if (typeof authReducer !== 'function') {
  console.error('authReducer is not a function! Check src/store/authSlice.ts export and path.');
  throw new Error('authReducer is invalid - stopping execution to debug.');
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// console.log('Store initialized successfully at:', new Date().toISOString());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
