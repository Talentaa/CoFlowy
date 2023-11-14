import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    desktopSiderbarOpened: true,
    mobileSiderbarOpened: false,
  },
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
