import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  warning: false,
  resetPassword: false,
  return: false,
  receive: false,
  entryReceive: false,
  openReason: false,
  openReasonReturn: false,
  disableProceed: false,
  isContinue: false,
  navigate: "",
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
    setEntryReceive: (state, action) => {
      state.entryReceive = action.payload;
    },

    setOpenReasonReturn: (state, action) => {
      state.openReasonReturn = action.payload;
    },
    setDisableProceed: (state, action) => {
      state.disableProceed = action.payload;
    },
    setIsContinue: (state, action) => {
      state.isContinue = action.payload;
    },
    setNavigate: (state, action) => {
      state.navigate = action.payload;
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
  setEntryReceive,
  setOpenReasonReturn,
  setDisableProceed,
  setIsContinue,
  setNavigate,
} = promptSlice.actions;

export default promptSlice.reducer;
