import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warning: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setWarning: (state, action) => {
      state.warning = action.payload;
    },
    resetPrompt: () => {
      return initialState;
    },
  },
});

export const { setWarning, resetPrompt } = promptSlice.actions;

export default promptSlice.reducer;
