import * as Y from "yjs";

import { useDispatch } from "react-redux";
import { useState, useMemo, useEffect, useLayoutEffect } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";

function getRandomName() {
  const NAMES = ["Anonymous", "Toad", "Yoshi", "Luma", "Boo"];
  return NAMES[Math.round(Math.random() * (NAMES.length - 1))];
}

function getRandomColor() {
  const COLORS = ["#ffb020", "#3366ff", "#474d66"];
  return COLORS[Math.round(Math.random() * (COLORS.length - 1))];
}

export default function DocumentEditor(props) {
  const { documentId, user, token = "anonymous", editable = true } = props;
  const dispatch = useDispatch();

  const ydoc = useMemo(() => new Y.Doc(), [documentId]);

  const [isLocalSynced, setLocalSynced] = useState(false);
  const [isRemoteSynced, setRemoteSynced] = useState(false);

  const localProvider = useMemo(() => {
    const provider = new IndexeddbPersistence(`document.${documentId}`, ydoc);

    provider.on("synced", () => {
      setLocalSynced(!!ydoc.get("default")._start);
    });

    return provider;
  }, [documentId, ydoc]);

  const remoteProvider = useMemo(() => {
    const provider = new HocuspocusProvider({
      name: `document.${documentId}`,
      url: process.env.NEXT_PUBLIC_COLLABORATION_URL || "",
      document: ydoc,
      connect: false,
      token,
      onStatus({ status }) {},
    });

    provider.on("synced", () => {
      setRemoteSynced(true);
    });

    return provider;
  }, [documentId, ydoc]);

  useLayoutEffect(() => {
    remoteProvider.connect();

    return () => {
      setRemoteSynced(false);
      setLocalSynced(false);
      remoteProvider.destroy();
      localProvider.destroy();
    };
  }, [remoteProvider, localProvider]);

  const userCursor = useMemo(() => {
    return {
      name: user?.email || getRandomName(),
      color: getRandomColor(),
    };
  }, [user]);

  const contentEditor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Placeholder.configure({
          placeholder: "Write something here...",
        }),
        Collaboration.configure({
          document: remoteProvider.document,
          field: "default",
        }),
        CollaborationCursor.configure({
          provider: remoteProvider,
          user: userCursor,
        }),
      ],
      editable
    },
    [documentId, editable, remoteProvider]
  );

  const isSynced = isLocalSynced || isRemoteSynced;
  console.log("local remote", isLocalSynced, isRemoteSynced);

  return isSynced ? (
    <>
      {/* <EditorContent editor={titleEditor} spellCheck="false" /> */}
      <RichTextEditor editor={contentEditor} spellCheck="false">
        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  ) : (
    <>
      <div>Loading editor</div>
      <RichTextEditor editor={contentEditor} spellCheck="false">
        <RichTextEditor.Content />
      </RichTextEditor>
    </>
  );
}
