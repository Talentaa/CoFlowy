import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { documentsApi, foldersApi } from "@/api";
import {
  ActionIcon,
  Collapse,
  Divider,
  Flex,
  Group,
  Text,
  Tooltip,
  Stack,
} from "@mantine/core";
import { createSelector } from "@reduxjs/toolkit";

import DocumentFolderCard from "@/components/ui/document-folder-card";
import { useDisclosure } from "@mantine/hooks";
import { IconSwitchVertical, IconPlus } from "@tabler/icons-react";

const selectSubfolders = createSelector(
  [
    (state) => state.folders.folders,
    (state) => state.folders.isLoading,
    (state, folderId) => folderId,
  ],
  (folders, isLoading, folderId) => ({
    subfolders: folders.filter((f) => f.parent_id === folderId),
    isLoadingFolder: isLoading,
    folder: folders.find((f) => f.id === folderId),
  })
);

const selectSubdocuments = createSelector(
  [(state) => state.documents.documents, (state, folderId) => folderId],
  (documents, folderId) =>
    documents.filter((d) => !d.parent_id && d.folder_id === folderId)
);

export default function Folder() {
  const [foldersOpened, { toggle: toggleFolders }] = useDisclosure(true);
  const [documentsOpened, { toggle: toggleDocuments }] = useDisclosure(true);

  const router = useRouter();
  const { folderId } = router.query;
  const dispatch = useDispatch();

  const { subfolders, folder, isLoadingFolder } = useSelector((state) =>
    selectSubfolders(state, folderId)
  );

  const subdocuments = useSelector((state) =>
    selectSubdocuments(state, folderId)
  );

  console.log(subdocuments, subfolders, folder, isLoadingFolder);

  const onClickAddDocument = async (folderId) => {
    const res = await dispatch(
      documentsApi.insertDocument({ folder_id: folderId })
    );

    if (res.payload) {
      router.push(`/doc/${res.payload.id}`);
    }
  };

  const onClickAddFolder = async (folderId) => {
    const folderName = prompt("Please input folder name");
    if (!folderName) return;

    dispatch(
      foldersApi.insertFolder({ name: folderName, parent_id: folderId })
    );
  };

  return (
    <>
      <Stack justify="flex-start">
        <Group>
          <Text fw={700}>Folders</Text>
          <Tooltip label="Create a new folder">
            <ActionIcon
              onClick={() => onClickAddFolder(folderId)}
              variant="filled"
              color="green"
              radius="xl"
              size="sm"
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group justify="space-between">
          <Text size="xs">{subfolders.length} folders</Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            size="sm"
            onClick={toggleFolders}
          >
            <IconSwitchVertical />
          </ActionIcon>
        </Group>
        <Collapse in={foldersOpened}>
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {subfolders?.map((folder) => (
              <DocumentFolderCard
                key={folder.id}
                id={folder.id}
                name={folder.name}
                type="folder"
              />
            ))}
          </Flex>
        </Collapse>
        <Divider my="sm" />
        <Group>
          <Text fw={700}>Documents</Text>
          <Tooltip label="Create a new document">
            <ActionIcon
              onClick={() => onClickAddDocument(folderId)}
              variant="filled"
              color="green"
              radius="xl"
              size="sm"
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group justify="space-between">
          <Text size="xs">{subdocuments.length} documents</Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            size="sm"
            onClick={toggleDocuments}
          >
            <IconSwitchVertical />
          </ActionIcon>
        </Group>
        <Collapse in={documentsOpened}>
          <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {subdocuments?.map((document) => (
              <DocumentFolderCard
                id={document.id}
                key={document.id}
                name={document.title || "Untitled"}
                type="document"
              />
            ))}
          </Flex>
        </Collapse>
      </Stack>
    </>
  );
}

Folder.Layout = Layout;
