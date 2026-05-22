import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import reducer, {
  applyThreadVoteOptimistic,
  selectThreadCategoriesForForm,
  setCategoryFilter,
  fetchThreads,
} from '../threadsSlice.js';
import { api } from '../../../api/client.js';

vi.mock('../../../api/client.js');

describe('threadsSlice reducer', () => {
  it('should set category filter', () => {
    const initialState = {
      items: [],
      status: 'idle',
      error: null,
      categoryFilter: 'all',
    };

    const nextState = reducer(initialState, setCategoryFilter('General'));
    expect(nextState.categoryFilter).toBe('General');
  });

  it('should apply optimistic up vote', () => {
    const initialState = {
      items: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
      status: 'idle',
      error: null,
      categoryFilter: 'all',
    };

    const nextState = reducer(initialState, applyThreadVoteOptimistic({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }));
    expect(nextState.items[0].upVotesBy).toContain('user-1');
    expect(nextState.items[0].downVotesBy).toHaveLength(0);
  });

  it('should apply optimistic down vote and remove up vote if exists', () => {
    const initialState = {
      items: [{ id: 'thread-1', upVotesBy: ['user-1'], downVotesBy: [] }],
      status: 'idle',
      error: null,
      categoryFilter: 'all',
    };

    const nextState = reducer(initialState, applyThreadVoteOptimistic({ threadId: 'thread-1', userId: 'user-1', voteType: -1 }));
    expect(nextState.items[0].upVotesBy).not.toContain('user-1');
    expect(nextState.items[0].downVotesBy).toContain('user-1');
  });
});

describe('threadsSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchThreads: success should dispatch fulfilled with merged threads and users data', async () => {
    const mockThreads = [{ id: 'thread-1', ownerId: 'user-1', category: 'React' }];
    const mockUsers = [{ id: 'user-1', name: 'User 1', avatar: 'avatar-1' }];

    api.getThreads.mockResolvedValue({ threads: mockThreads });
    api.getUsers.mockResolvedValue({ users: mockUsers });

    const thunk = fetchThreads();
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(fetchThreads.fulfilled.type);
    expect(result.payload[0]).toEqual({
      ...mockThreads[0],
      owner: mockUsers[0],
    });
  });

  it('fetchThreads: failure should dispatch rejected with error message', async () => {
    const errorMessage = 'Network Error';
    api.getThreads.mockRejectedValue(new Error(errorMessage));

    const thunk = fetchThreads();
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(fetchThreads.rejected.type);
    expect(result.payload).toBe(errorMessage);
  });
});

describe('threadsSlice selectors', () => {
  it('should exclude all from categories for form', () => {
    const state = {
      threads: {
        items: [
          { id: 'thread-1', category: 'General' },
          { id: 'thread-2', category: 'React' },
        ],
      },
    };

    const categories = selectThreadCategoriesForForm(state);
    expect(categories).toEqual(['General', 'React']);
  });
});
