import { configureStore } from '@reduxjs/toolkit';
import positionsReducer from './slices/positionsSlice';
import applicationsReducer from './slices/applicationsSlice';
import candidatesReducer from './slices/candidatesSlice';

export const store = configureStore({
    reducer: {
        positions: positionsReducer,
        applications: applicationsReducer,
        candidates: candidatesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
