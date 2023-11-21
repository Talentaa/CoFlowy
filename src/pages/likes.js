import Layout from "@/components/layout/layout";
import { Group, Text, Tooltip, ActionIcon, Flex, Collapse, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createSelector } from "@reduxjs/toolkit";
import { IconSwitchVertical } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import DocumentFolderCard from "@/components/ui/document-folder-card";

const selectDocuments = createSelector(
  [(state) => state.documents.documents],
  (documents) => documents.filter((f) => f.favorite)
);

export default function Likes() {
  const [documentsOpened, { toggle: toggleDocuments }] = useDisclosure(true);
  const documents = useSelector(selectDocuments);
  return (
    <Stack justify="flex-start">
      <Group>
        <Text fw={700}>Documents</Text>
      </Group>
      <Group justify="space-between">
        <Text size="xs">{documents?.length} likes</Text>
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
          {documents?.map((document) => (
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
  );
}

Likes.Layout = Layout;
