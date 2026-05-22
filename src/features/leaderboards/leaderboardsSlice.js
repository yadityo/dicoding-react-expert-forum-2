import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { startLoading, stopLoading } from '../ui/uiSlice';

export const fetchLeaderboards = createAsyncThunk('leaderboards/fetchLeaderboards', async (_, { rejectWithValue, dispatch }) => {
  dispatch(startLoading());
  try {
    const { leaderboards } = await api.getLeaderboards();
    return leaderboards;
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectLeaderboards = (state) => state.leaderboards.items;

export default leaderboardsSlice.reducer;
