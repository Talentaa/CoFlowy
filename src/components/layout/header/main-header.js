import { Breadcrumbs, Anchor } from "@mantine/core";
import ToggleColor from "./toggle-color";
import { toggleDesktopSidebar, toggleMobileSidebar } from "@/store/ui";
import { Burger, Group } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function MainHeader() {
  const dispatch = useDispatch();
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

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
        <Burger
          opened={desktopSiderbarOpened}
          onClick={() => {
            dispatch(toggleDesktopSidebar());
          }}
          visibleFrom="sm"
          size="sm"
        />
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
              <Anchor href={`/folder/${folder.id}`} key={index}>
                {folder.name.trim() || "Untitled"}
              </Anchor>
            ))}

          {!!activeDocument &&
            documentPath?.map((item, index) => (
              <Anchor
                key={index}
                href={`/${item.type === "document" ? "doc" : "folder"}/${
                  item.id
                }`}
              >
                {(item.type === "document"
                  ? item.title.trim()
                  : item.name.trim()) || "Sans titre"}
              </Anchor>
            ))}
        </Breadcrumbs>
      </Group>
      <Group>
        <ToggleColor />
      </Group>
    </Group>
  );
}
