import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import reducer, { logoutUser, loginUser } from '../authSlice.js';
import { api } from '../../../api/client.js';

vi.mock('../../../api/client.js');
vi.mock('../../../utils/token', () => ({
  getToken: vi.fn(),
  saveToken: vi.fn(),
  removeToken: vi.fn(),
}));

describe('authSlice reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      token: undefined,
      currentUser: null,
      authStatus: 'idle',
      error: null,
    });
  });

  it('should clear auth on logout', () => {
    const initialState = {
      token: 'token',
      currentUser: { id: 'user-1' },
      authStatus: 'succeeded',
      error: null,
    };

    const nextState = reducer(initialState, logoutUser());
    expect(nextState.token).toBeNull();
    expect(nextState.currentUser).toBeNull();
  });
});

describe('authSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginUser: success should dispatch fulfilled with data', async () => {
    const payload = { email: 'test@test.com', password: 'password' };
    const mockToken = 'mock-token';
    const mockUser = { id: 'user-1', name: 'Test User' };

    api.login.mockResolvedValue({ token: mockToken });
    api.getOwnProfile.mockResolvedValue({ user: mockUser });

    const thunk = loginUser(payload);
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(loginUser.fulfilled.type);
    expect(result.payload).toEqual({ token: mockToken, user: mockUser });
    expect(api.login).toHaveBeenCalledWith(payload);
    expect(api.getOwnProfile).toHaveBeenCalledWith(mockToken);
  });

  it('loginUser: failure should dispatch rejected with error message', async () => {
    const payload = { email: 'test@test.com', password: 'password' };
    const errorMessage = 'Invalid credentials';

    api.login.mockRejectedValue(new Error(errorMessage));

    const thunk = loginUser(payload);
    const result = await thunk(dispatch, getState, undefined);

    expect(result.type).toBe(loginUser.rejected.type);
    expect(result.payload).toBe(errorMessage);
  });
});
