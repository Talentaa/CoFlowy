import { documentsApi } from "@/api";
import { createSlice } from "@reduxjs/toolkit";

export const documentsSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    insertDocument: (state, action) => {
      state.documents = [...state.documents, action.payload];
    },
    updateDocument: (state, action) => {
      state.documents = state.documents.map((document) => {
        document.id === action.payload.id ? action.payload : document;
      });
    },
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(
        (document = document.id !== action.payload.id)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(documentsApi.fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(documentsApi.fetchDocuments.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(documentsApi.fetchDocuments.rejected, (state, action) => {
        (state.isLoading = false), (state.error = action.error.message);
      });
  },
});

export const { setDocuments, insertDocument, updateDocument, deleteDocument } =
  documentsSlice.actions;

export default documentsSlice.reducer;
