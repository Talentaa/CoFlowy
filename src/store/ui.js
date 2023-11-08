import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  desktopSiderbarOpened: true,
  mobileSiderbarOpened: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDesktopSidebar(state) {
      state.desktopSiderbarOpened = !state.desktopSiderbarOpened;
    },
    toggleMobileSidebar(state) {
      state.mobileSiderbarOpened = !state.mobileSiderbarOpened;
    },
  },
});

export const { toggleDesktopSidebar, toggleMobileSidebar } = uiSlice.actions;

export default uiSlice.reducer;
