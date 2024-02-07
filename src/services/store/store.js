import { configureStore } from "@reduxjs/toolkit";
import { jsonServerAPI } from "./request";
import authSlice from "../slice/authSlice";
import promptSlice from "../slice/promptSlice";
import menuSlice from "../slice/menuSlice";
import { jsonSedarAPI } from "./sedarRequest";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    prompt: promptSlice,
    menu: menuSlice,

    [jsonServerAPI.reducerPath]: jsonServerAPI.reducer,
    [jsonSedarAPI.reducerPath]: jsonSedarAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jsonSedarAPI.middleware,
      jsonServerAPI.middleware
    ),
});
