import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
  accountMenu: false,
  roles: false,
  rolesView: false,
  rolesUpdate: false,
  rolesData: null,
  createMenu: false,
};

const menutSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
    setAccountMenu: (state, action) => {
      state.accountMenu = action.payload;
    },
    setRolesMenu: (state, action) => {
      state.roles = action.payload;
    },
    setRolesView: (state, action) => {
      state.rolesView = action.payload;
    },
    setRolesUpdate: (state, action) => {
      state.rolesUpdate = action.payload;
    },
    setRolesData: (state, action) => {
      state.rolesData = action.payload;
    },
    setCreateMenu: (state, action) => {
      state.createMenu = action.payload;
    },
    resetMenu: () => {
      return initialState;
    },
  },
});

export const {
  setDrawer,
  setAccountMenu,
  setRolesMenu,
  setRolesView,
  setRolesUpdate,
  setRolesData,
  setCreateMenu,
  resetMenu,
} = menutSlice.actions;

export default menutSlice.reducer;
