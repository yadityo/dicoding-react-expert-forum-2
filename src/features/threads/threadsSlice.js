import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { startLoading, stopLoading } from '../ui/uiSlice';

export const fetchThreads = createAsyncThunk('threads/fetchThreads', async (_, { rejectWithValue, dispatch }) => {
  dispatch(startLoading());
  try {
    const [threadsData, usersData] = await Promise.all([api.getThreads(), api.getUsers()]);
    const usersMap = usersData.users.reduce(
      (acc, user) => ({
        ...acc,
        [user.id]: user,
      }),
      {},
    );

    const threads = threadsData.threads.map((thread) => ({
      ...thread,
      owner: usersMap[thread.ownerId] || { name: 'Unknown', avatar: '' },
    }));

    return threads;
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

export const createThread = createAsyncThunk('threads/createThread', async ({ payload, token }, { rejectWithValue, dispatch }) => {
  dispatch(startLoading());
  try {
    const { thread } = await api.createThread(payload, token);
    return thread;
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

export const toggleThreadVote = createAsyncThunk(
  'threads/toggleThreadVote',
  async (
    {
      threadId,
      voteType,
      token,
      currentVote,
    },
    { rejectWithValue },
  ) => {
    try {
      let apiCall = null;
      if (currentVote === voteType) {
        apiCall = api.neutralVoteThread(threadId, token);
        await apiCall;
        return { threadId, voteType: 0, previousVote: currentVote };
      }

      apiCall = voteType === 1 ? api.upVoteThread(threadId, token) : api.downVoteThread(threadId, token);
      await apiCall;
      return { threadId, voteType, previousVote: currentVote };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        threadId,
        previousVote: currentVote,
        attemptedVote: voteType,
      });
    }
  },
);

// function applyVote(thread, userId, voteType) {
//   thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
//   thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

//   if (voteType === 1) {
//     thread.upVotesBy.push(userId);
//   }

//   if (voteType === -1) {
//     thread.downVotesBy.push(userId);
//   }
// }

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    categoryFilter: 'all',
  },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
    applyThreadVoteOptimistic(state, action) {
      const { threadId, userId, voteType } = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (!thread) return;
      applyVote(thread, userId, voteType);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      });
  },
});

export const { setCategoryFilter, applyThreadVoteOptimistic } = threadsSlice.actions;

export const selectThreads = (state) => state.threads.items;
export const selectThreadCategories = (state) => [
  'all',
  ...new Set(state.threads.items.map((item) => item.category || 'uncategorized')),
];
export const selectThreadCategoriesForForm = (state) => (
  selectThreadCategories(state).filter((category) => category !== 'all')
);
export const selectFilteredThreads = (state) => {
  if (state.threads.categoryFilter === 'all') return state.threads.items;
  return state.threads.items.filter(
    (thread) => (thread.category || 'uncategorized') === state.threads.categoryFilter,
  );
};

export default threadsSlice.reducer;
