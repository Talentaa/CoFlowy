import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const fetchFolders = createAsyncThunk("folders/fetch_all", async () => {
    console.log(supabaseClient);
  const { data, error } = await createPagesBrowserClient()
    .from("user_folders_tree")
    .select("*");

  if (error) {
    throw error;
  }

  return data;
});

export const insertFolder = createAsyncThunk(
  "folders/insert",
  async (folder) => {
    const { data, error } = await createPagesBrowserClient()
      .from("folders")
      .insert(folder);

    if (error) {
      throw error;
    }

    return data;
  }
);

export const updateFolder = createAsyncThunk(
  "folders/update",
  async ({ id, ...updates }) => {
    const { data, error } = await createPagesBrowserClient()
      .from("folders")
      .update(updates)
      .match({ id });

    if (error) {
      throw error;
    }

    return data;
  }
);
