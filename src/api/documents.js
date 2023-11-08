import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const fetchDocuments = createAsyncThunk(
  "documents/fetch_all",
  async () => {
    const { data, error } = await createPagesBrowserClient()
      .from("user_documents_tree")
      .select("*");

    if (error) {
      throw error;
    }
    return data;
  }
);

export const insertDocument = createAsyncThunk(
  "documents/insert",
  async (document) => {
    const { data, error } = await createPagesBrowserClient()()
      .from("documents")
      .insert(document)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
);

export const updateDocument = createAsyncThunk(
  "documents/update",
  async ({ id, ...updates }) => {
    const { data, error } = await createPagesBrowserClient()()
      .from("documents")
      .update(updates)
      .match({ id });

    if (error) {
      throw error;
    }

    return data;
  }
);
