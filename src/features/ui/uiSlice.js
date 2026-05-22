import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loadingCount: 0,
    message: '',
  },
  reducers: {
    startLoading(state) {
      state.loadingCount += 1;
    },
    stopLoading(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = '';
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setMessage,
  clearMessage,
} = uiSlice.actions;

export const selectGlobalLoading = (state) => state.ui.loadingCount > 0;
export const selectUiMessage = (state) => state.ui.message;

export default uiSlice.reducer;
