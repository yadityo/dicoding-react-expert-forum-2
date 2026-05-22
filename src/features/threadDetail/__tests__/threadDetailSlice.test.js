import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import reducer, {
  clearThreadDetail,
  applyCommentVoteOptimistic,
  fetchThreadDetail,
} from '../threadDetailSlice.js';
import { api } from '../../../api/client.js';

vi.mock('../../../api/client.js');

describe('threadDetailSlice reducer', () => {
  it('should clear thread detail', () => {
    const initialState = {
      item: { id: 'thread-1' },
      status: 'succeeded',
      error: null,
    };

    const nextState = reducer(initialState, clearThreadDetail());
    expect(nextState.item).toBeNull();
    expect(nextState.status).toBe('idle');
  });

  it('should apply optimistic comment vote', () => {
    const initialState = {
      item: {
        id: 'thread-1',
        comments: [
          { id: 'comment-1', upVotesBy: [], downVotesBy: [] },
        ],
      },
      status: 'succeeded',
      error: null,
    };

    const nextState = reducer(initialState, applyCommentVoteOptimistic({
      commentId: 'comment-1',
      userId: 'user-1',
      voteType: 1,
    }));

    expect(nextState.item.comments[0].upVotesBy).toContain('user-1');
  });
});

describe('threadDetailSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchThreadDetail: success should dispatch fulfilled with data', async () => {
    const mockDetail = { id: 'thread-1', title: 'Thread 1', comments: [] };
    api.getThreadDetail.mockResolvedValue({ detailThread: mockDetail });

    const thunk = fetchThreadDetail('thread-1');
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(fetchThreadDetail.fulfilled.type);
    expect(result.payload).toEqual(mockDetail);
    expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');
  });

  it('fetchThreadDetail: failure should dispatch rejected with error message', async () => {
    const errorMessage = 'Thread not found';
    api.getThreadDetail.mockRejectedValue(new Error(errorMessage));

    const thunk = fetchThreadDetail('thread-1');
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(fetchThreadDetail.rejected.type);
    expect(result.payload).toBe(errorMessage);
  });
});
