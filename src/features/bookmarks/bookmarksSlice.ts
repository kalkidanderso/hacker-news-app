import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NormalizedStory } from '../../types';

const STORAGE_KEY = '@bookmarks';

interface BookmarksState {
  items: NormalizedStory[];
  hydrated: boolean;
}

const initialState: BookmarksState = {
  items: [],
  hydrated: false,
};

export const hydrateBookmarks = createAsyncThunk(
  'bookmarks/hydrate',
  async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NormalizedStory[];
  },
);

async function persist(items: NormalizedStory[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<NormalizedStory>) {
      const idx = state.items.findIndex(s => s.id === action.payload.id);
      if (idx === -1) {
        state.items.push(action.payload);
      } else {
        state.items.splice(idx, 1);
      }
      persist(state.items);
    },
    removeBookmark(state, action: PayloadAction<number>) {
      state.items = state.items.filter(s => s.id !== action.payload);
      persist(state.items);
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateBookmarks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.hydrated = true;
    });
  },
});

export const { toggleBookmark, removeBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
