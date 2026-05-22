import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { getToken, removeToken, saveToken } from '../../utils/token';
import { setMessage, startLoading, stopLoading } from '../ui/uiSlice';

export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { dispatch, rejectWithValue }) => {
  dispatch(startLoading());
  try {
    await api.register(payload);
    dispatch(setMessage('Registrasi berhasil. Silakan login.'));
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, { dispatch, rejectWithValue }) => {
  dispatch(startLoading());
  try {
    const { token } = await api.login(payload);
    saveToken(token);
    const { user } = await api.getOwnProfile(token);
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.message);
  } finally {
    dispatch(stopLoading());
  }
});

export const preloadAuth = createAsyncThunk('auth/preloadAuth', async (_, { rejectWithValue }) => {
  const token = getToken();
  if (!token) return { token: null, user: null };

  try {
    const { user } = await api.getOwnProfile(token);
    return { token, user };
  } catch (error) {
    removeToken();
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken(),
    currentUser: null,
    authStatus: 'idle',
    error: null,
  },
  reducers: {
    logoutUser(state) {
      state.token = null;
      state.currentUser = null;
      removeToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.authStatus = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(preloadAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export const selectAuthUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
