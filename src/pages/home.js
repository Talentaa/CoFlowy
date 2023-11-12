import Layout from "@/components/layout/layout";
import { useUser } from "@supabase/auth-helpers-react";
import { useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const user = useUser();

  const {
    documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useSelector((state) => state.documents);

  const {
    folders,
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useSelector((state) => state.folders);

  const [textPreviews, setTextPreviews] = useState({});
  const [loadingTextPreviews, setLoadingTextPreviews] = useState(true);

  const recentFolders = useMemo(() => {
    return [...folders]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 5);
  }, [folders]);

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 10);
  }, [documents]);

  useEffect(() => {
    if (documents.length) {
      setLoadingTextPreviews(true);

      createPagesBrowserClient()
        .from("documents")
        .select("id, text_preview")
        .in(
          "id",
          recentDocuments.map((d) => d.id)
        )
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            return;
          }

          setTextPreviews(
            (data || []).reduce((acc, curr) => {
              acc[curr.id] = curr.text_preview;
              return acc;
            }, {})
          );
          setLoadingTextPreviews(false);
        });
    }
  }, [documents]);

  return <h1>Home</h1>;
}

Home.Layout = Layout;
