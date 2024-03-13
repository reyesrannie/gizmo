import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warning: false,
  resetPassword: false,
  return: false,
  receive: false,
  openReason: false,
  openReasonReturn: false,
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
    setOpenReason: (state, action) => {
      state.openReason = action.payload;
    },
    setReturn: (state, action) => {
      state.return = action.payload;
    },
    setReceive: (state, action) => {
      state.receive = action.payload;
    },
    setOpenReasonReturn: (state, action) => {
      state.openReasonReturn = action.payload;
    },

    resetPrompt: () => {
      return initialState;
    },
  },
});

export const {
  setWarning,
  setResetPassword,
  setOpenReason,
  setReturn,
  setReceive,
  resetPrompt,
  setOpenReasonReturn,
} = promptSlice.actions;

export default promptSlice.reducer;
