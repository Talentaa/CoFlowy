const { configureStore } = require("@reduxjs/toolkit");
import documentsReducer from "./documents";
import foldersReducer from "./folders";
import uiReducer from "./ui";
import userReducer from "./user";

const store = configureStore({
  reducer: {
    ui: uiReducer,
    documents: documentsReducer,
    folders: foldersReducer,
    user: userReducer
  },
});

export default store;
