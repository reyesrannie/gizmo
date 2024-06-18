import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  header: "",
};

const headerSlice = createSlice({
  name: "headers",
  initialState,
  reducers: {
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    resetHeader: () => {
      return initialState;
    },
  },
});

export const { resetHeader, setHeader } = headerSlice.actions;

export default headerSlice.reducer;
