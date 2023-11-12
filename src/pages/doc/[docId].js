import Layout from "@/components/layout/layout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Doc() {
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  const router = useRouter();
  const { docId } = router.query;

  const { document, isLoadingDocument } = useSelector((state) => ({
    document: state.documents.documents.find((d) => d.id === docId),
    isLoadingDocument: state.documents.isLoading,
  }));

  const [permssion, setPermission] = useState("loading");

  useEffect(() => {
    if (docId && !isLoadingDocument) {
      if (document) {
        setPermission("edit");
      } else {
        supabaseClient
          .rpc("get_user_permission_for_document", {
            document_id: docId,
            user_id: session?.user_id || null,
            document: null,
          })
          .single()
          .then(({ data }) => setPermission(data));
      }
    }

    return () => {
      setPermission("loading");
    };
  }, [docId, document, isLoadingDocument, session?.user.id]);

  return <h1>Document {docId}</h1>;
}

Doc.Layout = Layout;
