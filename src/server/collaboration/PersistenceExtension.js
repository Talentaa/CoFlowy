const { Node } = require("prosemirror-model");
const { yDocToProsemirrorJSON } = require("y-prosemirror");
const Y = require("yjs");
const { getSchema } = require("@tiptap/core");
const Document = require("@tiptap/extension-document");
const Heading = require("@tiptap/extension-heading");
const Text = require("@tiptap/extension-text");

const { getSupabaseClient } = require("../util/supabase");
const { default: StarterKit } = require("@tiptap/starter-kit");

async function onLoadDocument({ documentName, context, document: ydoc }) {
  const documentId = documentName.split(".").pop();
  const { user, session } = context;

  if (user) {
    console.log(
      `Loading document ${documentId} for user ${user.email} (${user.id}).`
    );
  } else {
    console.log(`Loading document ${documentId} from anonymous user.`);
  }

  if (!ydoc.isEmpty("default")) {
    return;
  }

  const supabaseClient = session
    ? await getSupabaseClient({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    : await getSupabaseClient();

  if (!supabaseClient) {
    throw new Error("Invalid session.");
  }

  const { data: document, error } = await supabaseClient
    .from("documents")
    .select("state")
    .eq("id", documentId)
    .single();

  if (error) {
    return console.error(error);
  }

  if (document.state) {
    const { state: stateHEX } = document;
    const ydoc = new Y.Doc();

    const buffer = Buffer.from(stateHEX.substr(2), "hex");
    const uint8Array = new Uint8Array(
      Object.values(JSON.parse(buffer.toString()))
    );

    Y.applyUpdate(ydoc, uint8Array);
    return ydoc;
  }

  return new Y.Doc();
}

async function onStoreDocument({ documentName, document: ydoc, context }) {
  const documentId = documentName.split(".").pop();
  const { user, permission, session } = context;

  if (permission !== "edit") {
    return;
  }

  if (user) {
    console.log(
      `Persisting document ${documentId} for user ${user.email} (${user.id}).`
    );
  } else {
    console.log(`Persisting document ${documentId} for anonymous user.`);
  }

  const docNode = Node.fromJSON(
    getSchema([
      StarterKit.configure({
        history: false,
      }),
    ]),
    yDocToProsemirrorJSON(ydoc, "default")
  );

  const supabaseClient = session
    ? await getSupabaseClient({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    : await getSupabaseClient();

  if (!supabaseClient) {
    throw new Error("Invalid session.");
  }
}

module.exports = { onLoadDocument, onStoreDocument };
