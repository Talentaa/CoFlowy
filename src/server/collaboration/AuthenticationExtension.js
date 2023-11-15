const { getSupabaseClient } = require("../util/supabase");

async function onAuthenticate({ documentName, connection, token }) {
  const documentId = documentName.split(".").pop();

  let user = null;

  const supabaseClient =
    token === "anonymous"
      ? await getSupabaseClient()
      : await getSupabaseClient(JSON.parse(token));

  if (!supabaseClient) {
    throw new Error("Invalid token.");
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  user = session?.user || null;

  const { data: permission, error } = await supabaseClient
    .rpc("get_user_permission_for_document", {
      document_id: documentId,
      user_id: user?.id || null,
      document: null,
    })
    .single();
  console.log("Permission :", permission);

  if (!["read", "edit"].includes(permission)) {
    console.error(error);
    throw new Error("Not allowed.");
  }

  if (permission !== "edit") {
    connection.readOnly = true;
  }

  return {
    permission: permission === "edit" ? "edit" : "read",
    session,
    user,
  };
}

module.exports = { onAuthenticate };
