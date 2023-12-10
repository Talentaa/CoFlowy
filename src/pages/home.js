import Layout from "@/components/layout/layout";
import { useSelector } from "react-redux";
import { useMemo, useEffect } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  ActionIcon,
  Collapse,
  Flex,
  Group,
  Stack,
  Text,
  Divider,
} from "@mantine/core";
import { IconSwitchVertical } from "@tabler/icons-react";
import DocumentFolderCard from "@/components/ui/document-folder-card";
import { useDisclosure } from "@mantine/hooks";

export default function Home() {

  const [foldersOpened, { toggle: toggleFolders }] = useDisclosure(true);
  const [documentsOpened, { toggle: toggleDocuments }] = useDisclosure(true);

  const {
    documents,
  } = useSelector((state) => state.documents);

  const {
    folders,
  } = useSelector((state) => state.folders);

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
      createPagesBrowserClient()
        .from("documents")
        .select("id")
        .in(
          "id",
          recentDocuments.map((d) => d.id)
        )
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            return;
          }
        });
    }
  }, [documents]);

  return (
    <>
      <Stack justify="flex-start">
        <Group>
          <Text fw={700}>Recent Folders</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs">{recentFolders.length} folders</Text>
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
            {recentFolders?.map((folder) => (
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
          <Text fw={700}>Recent Documents</Text>
        </Group>
        <Group justify="space-between">
          <Text size="xs">{recentDocuments.length} documents</Text>
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
            {recentDocuments?.map((document) => (
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

Home.Layout = Layout;
