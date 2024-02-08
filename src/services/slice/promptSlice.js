import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warning: false,
  resetPassword: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setWarning: (state, action) => {
      state.warning = action.payload;
    },
    setResetPassword: (state, action) => {
      state.resetPassword = action.payload;
    },
    resetPrompt: () => {
      return initialState;
    },
  },
});

export const { setWarning, setResetPassword, resetPrompt } =
  promptSlice.actions;

export default promptSlice.reducer;
