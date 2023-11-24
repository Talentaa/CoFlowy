import { Breadcrumbs, ActionIcon, Burger, Group, Button } from "@mantine/core";
import ToggleColor from "./toggle-color";
import ShareDocumentButton from "./share-document-button";
import { toggleDesktopSidebar, toggleMobileSidebar } from "@/store/ui";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";
import { IconHeart } from "@tabler/icons-react";
import { IconHeartFilled } from "@tabler/icons-react";
import { documentsApi } from "@/api";

import classes from "./main-header.module.css";
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react";
import { IconLayoutSidebarLeftExpandFilled } from "@tabler/icons-react";

export default function MainHeader() {
  const dispatch = useDispatch();
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

  const session = useSession();

  const router = useRouter();
  const { docId, folderId } = router.query;
  const { documents } = useSelector((state) => state.documents);
  const { folders } = useSelector((state) => state.folders);

  const activeDocument = useSelector((state) =>
    docId ? state.documents.documents.find((d) => d.id === docId) : null
  );

  const activeFolder = useSelector((state) =>
    folderId
      ? state.folders.folders.find((f) => f.id === folderId)
      : docId
        ? state.documents.documents.find((d) => d.id === docId)?.folder_id
        : null
  );

  const folderPath = useMemo(() => {
    if (!folderId) {
      return null;
    }

    const path = [];
    let current = folders.find((f) => f.id === folderId);

    while (current) {
      path.unshift(current);
      current = current.parent_id
        ? folders.find((f) => f.id === current.parent_id)
        : null;
    }
    return path;
  }, [folderId, folders]);

  const documentPath = useMemo(() => {
    if (!docId) {
      return null;
    }

    const data = [
      ...documents.map((d) => ({ type: "document", ...d })),
      ...folders.map((f) => ({ type: "folder", ...f })),
    ];

    const path = [];
    let current = data.find((item) => item.id === docId);

    while (current) {
      path.unshift(current);
      if (current.parent_id) {
        current = data.find((item) => item.id === current.parent_id);
      } else if (current.folder_id) {
        current = data.find((item) => item.id === current.folder_id);
      } else {
        current = null;
      }
    }
    return path;
  }, [docId, documents, folders]);

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <ActionIcon
          variant="transparent"
          onClick={() => {
            dispatch(toggleDesktopSidebar());
          }}
        >
          {desktopSiderbarOpened ? (
            <IconLayoutSidebarLeftExpandFilled />
          ) : (
            <IconLayoutSidebarLeftExpand />
          )}
        </ActionIcon>
        <Burger
          opened={mobileSiderbarOpened}
          onClick={() => {
            dispatch(toggleMobileSidebar());
          }}
          hiddenFrom="sm"
          size="sm"
        />
        <Breadcrumbs>
          {!!activeFolder &&
            folderPath?.map((folder, index) => (
              <Link
                href={`/folder/${folder.id}`}
                key={index}
                className={classes.link}
              >
                {folder.name.trim() || "Untitled"}
              </Link>
            ))}

          {!!activeDocument &&
            documentPath?.map((item, index) => (
              <Link
                key={index}
                href={`/${item.type === "document" ? "doc" : "folder"}/${
                  item.id
                }`}
                className={classes.link}
              >
                {(item.type === "document"
                  ? item.title.trim()
                  : item.name.trim()) || "Untitled"}
              </Link>
            ))}
        </Breadcrumbs>
      </Group>
      <Group>
        {!session && (
          <Button onClick={() => router.push("/auth")}>Sign in</Button>
        )}
        {!!activeDocument && (
          <>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => {
                dispatch(
                  documentsApi.updateDocument({
                    id: docId,
                    favorite: !activeDocument.favorite,
                  })
                );
              }}
            >
              {activeDocument?.favorite ? <IconHeartFilled /> : <IconHeart />}
            </ActionIcon>
            <ShareDocumentButton documentId={docId} />
          </>
        )}
        <ToggleColor />
      </Group>
    </Group>
  );
}
