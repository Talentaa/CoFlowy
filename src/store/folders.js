import { foldersApi } from "@/api";
import { createSlice } from "@reduxjs/toolkit";

export const foldersSlice = createSlice({
  name: "folders",
  initialState: {
    folders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    insertFolder: (state, action) => {
      state.folders = [...state.folders, action.payload];
    },
    updateFolder: (state, action) => {
      state.folders = state.folders.map((folder) =>
        folder.id === action.payload.id ? action.payload : folder
      );
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(
        (folder) => folder.id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(foldersApi.fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
      })
      .addCase(foldersApi.fetchFolders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(foldersApi.fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFolders, insertFolder, updateFolder, deleteFolder } =
  foldersSlice.actions;

export default foldersSlice.reducer;
