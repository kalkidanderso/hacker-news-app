import { configureStore } from '@reduxjs/toolkit';
import feedReducer from '../features/feed/feedSlice';
import bookmarksReducer from '../features/bookmarks/bookmarksSlice';

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    bookmarks: bookmarksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
