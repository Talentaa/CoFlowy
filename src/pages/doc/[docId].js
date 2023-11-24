import Layout from "@/components/layout/layout";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createSelector } from "@reduxjs/toolkit";
import { Flex, Loader, Text, Skeleton } from "@mantine/core";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";

const DocumentEditor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
  loading: () => <Loading />,
});

const selectDocument = createSelector(
  [(state) => state.documents, (state, docId) => docId],
  (documents, docId) => ({
    document: documents.documents.find((d) => d.id === docId),
    isLoadingDocument: documents.isLoading,
  })
);

export default function Document() {
  const session = useSession();
  const user = useUser();

  const router = useRouter();
  const { docId } = router.query;

  const { document, isLoadingDocument } = useSelector((state) =>
    selectDocument(state, docId)
  );
  const [permission, setPermission] = useState("loading");

  useEffect(() => {
    if (docId && !isLoadingDocument) {
      if (document) {
        setPermission("edit");
      } else {
        createPagesBrowserClient()
          .rpc("get_user_permission_for_document", {
            document_id: docId,
            user_id: user?.id || null,
            document: null,
          })
          .single()
          .then(({ data }) => setPermission(data));
      }
    }

    return () => {
      setPermission("loading");
    };
  }, [docId, document, isLoadingDocument, user?.id]);

  return (
    <>
      {["read", "edit"].includes(permission) ? (
        <DocumentEditor
          documentId={docId}
          user={{ emial: user?.email }}
          token={
            session
              ? JSON.stringify({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                })
              : "anonymous"
          }
          editable={permission === "edit"}
        />
      ) : (
        <Flex
          justify="center"
          align="center"
          style={{ width: "100%", height: "100%" }}
        >
          {permission === "loading" ? (
            <Loading />
          ) : (
            <Text>No permission to access this document</Text>
          )}
        </Flex>
      )}
    </>
  );
}

Document.Layout = Layout;
