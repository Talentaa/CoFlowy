import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const fetchUser = createAsyncThunk(
  "user/fetch", async ({ id }) => {
  const { data, error } = await createPagesBrowserClient()
    .from("profiles")
    .select("*")
    .match({ id })
    .single();

  if (error) {
    throw error;
  }

  return data;
});

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, ...updates }) => {
    const { data, error } = await createPagesBrowserClient()
      .from("profiles")
      .update(updates)
      .match({ id });

    if (error) {
      throw error;
    }

    return data;
  }
);
