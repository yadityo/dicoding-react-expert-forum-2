import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { startLoading, stopLoading } from '../ui/uiSlice';

export const fetchThreadDetail = createAsyncThunk('threadDetail/fetchThreadDetail', async (threadId, { rejectWithValue, dispatch }) => {
  dispatch(startLoading());
  try {
    const { detailThread } = await api.getThreadDetail(threadId);
    return detailThread;
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content, token }, { rejectWithValue, dispatch }) => {
    dispatch(startLoading());
    try {
      const { comment } = await api.createComment(threadId, { content }, token);
      return comment;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(stopLoading());
    }
  },
);

export const toggleCommentVote = createAsyncThunk(
  'threadDetail/toggleCommentVote',
  async (
    {
      threadId,
      commentId,
      voteType,
      token,
      currentVote,
    },
    { rejectWithValue },
  ) => {
    try {
      if (currentVote === voteType) {
        await api.neutralVoteComment(threadId, commentId, token);
        return { commentId, voteType: 0, previousVote: currentVote };
      }

      if (voteType === 1) {
        await api.upVoteComment(threadId, commentId, token);
      } else {
        await api.downVoteComment(threadId, commentId, token);
      }

      return { commentId, voteType, previousVote: currentVote };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        commentId,
        previousVote: currentVote,
        attemptedVote: voteType,
      });
    }
  },
);

function applyVote(entity, userId, voteType) {
  entity.upVotesBy = entity.upVotesBy.filter((id) => id !== userId);
  entity.downVotesBy = entity.downVotesBy.filter((id) => id !== userId);

  if (voteType === 1) entity.upVotesBy.push(userId);
  if (voteType === -1) entity.downVotesBy.push(userId);
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    item: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearThreadDetail(state) {
      state.item = null;
      state.status = 'idle';
      state.error = null;
    },
    applyCommentVoteOptimistic(state, action) {
      const { commentId, userId, voteType } = action.payload;
      if (!state.item) return;
      const comment = state.item.comments.find((entry) => entry.id === commentId);
      if (!comment) return;
      applyVote(comment, userId, voteType);
    },
    applyDetailThreadVoteOptimistic(state, action) {
      const { userId, voteType } = action.payload;
      if (!state.item) return;
      applyVote(state.item, userId, voteType);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.item = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.item) {
          state.item.comments = [action.payload, ...state.item.comments];
        }
      });
  },
});

export const {
  clearThreadDetail,
  applyCommentVoteOptimistic,
  applyDetailThreadVoteOptimistic,
} = threadDetailSlice.actions;
export const selectThreadDetail = (state) => state.threadDetail.item;
export const selectComments = (state) => state.threadDetail.item?.comments || [];

export default threadDetailSlice.reducer;
