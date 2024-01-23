import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  archive: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setArchive: (state, action) => {
      state.archive = action.payload;
    },
    resetPrompt: () => {
      return initialState;
    },
  },
});

export const { setArchive, resetPrompt } = promptSlice.actions;

export default promptSlice.reducer;
