import { userApi } from "@/api";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userApi.fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(userApi.fetchUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(userApi.fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.log(action.error);
      });
  },
});

export const { setUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
