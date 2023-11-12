const { configureStore } = require("@reduxjs/toolkit");
import documentsReducer from "./documents";
import foldersReducer from "./folders";
import uiReducer from "./ui";

const store = configureStore({
  reducer: {
    ui: uiReducer,
    documents: documentsReducer,
    folders: foldersReducer,
  },
});

export default store;
