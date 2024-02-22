import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
  accountMenu: false,
  roles: false,
  rolesView: false,
  rolesUpdate: false,
  rolesData: null,
  createMenu: false,
  updateMenu: false,
  importMenu: false,
  importHasData: false,
  importTitle: "",
  importLoading: false,
  importError: null,

  viewMenu: false,
  menuData: null,
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
    setUpdateMenu: (state, action) => {
      state.updateMenu = action.payload;
    },
    setViewMenu: (state, action) => {
      state.viewMenu = action.payload;
    },
    setImportMenu: (state, action) => {
      state.importMenu = action.payload;
    },
    setImportHasData: (state, action) => {
      state.importHasData = action.payload;
    },
    setImportTitle: (state, action) => {
      state.importTitle = action.payload;
    },
    setImportLoading: (state, action) => {
      state.importLoading = action.payload;
    },
    setImportError: (state, action) => {
      state.importError = action.payload;
    },
    setMenuData: (state, action) => {
      state.menuData = action.payload;
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
  setUpdateMenu,
  setViewMenu,
  setImportMenu,
  setImportHasData,
  setImportTitle,
  setImportLoading,
  setImportError,
  resetMenu,
  setMenuData,
} = menutSlice.actions;

export default menutSlice.reducer;
