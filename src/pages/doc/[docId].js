import Layout from "@/components/layout/layout";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function Doc() {
  const session = useSession();
  const user = useUser();
  console.log(session, user);

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
      <h1>docId {docId}</h1>
      <h1>userId {user?.id}</h1>
    </>
  );
}

Doc.Layout = Layout;
