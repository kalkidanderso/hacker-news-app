import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchTopStories } from '../../api/hackerNews';
import { normalizeStory } from '../../utils/story';
import type { NormalizedStory, SortKey } from '../../types';

interface FeedState {
  stories: NormalizedStory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortKey: SortKey;
  searchQuery: string;
}

const initialState: FeedState = {
  stories: [],
  status: 'idle',
  error: null,
  sortKey: 'score',
  searchQuery: '',
};

export const loadStories = createAsyncThunk('feed/loadStories', async () => {
  const raw = await fetchTopStories();
  return raw.map(normalizeStory);
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setSortKey(state, action: PayloadAction<SortKey>) {
      state.sortKey = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadStories.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadStories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stories = action.payload;
      })
      .addCase(loadStories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load stories';
      });
  },
});

export const { setSortKey, setSearchQuery } = feedSlice.actions;
export default feedSlice.reducer;
