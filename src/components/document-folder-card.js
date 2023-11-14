import { documentsApi, foldersApi } from "@/api";
import { Card, Menu, Text, Group, rem, ActionIcon } from "@mantine/core";
import { IconFileText, IconFolder } from "@tabler/icons-react";
import { IconDots, IconTrash, IconEye } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function DocumentFolderCard(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const onDeleteClick = (type, id) => {
    if (type === "folder") {
      if (confirm("Ready to delete this folder?")) {
        dispatch(
          foldersApi.updateFolder({
            id,
            deleted: true,
          })
        );
      }
    } else {
      if (confirm("Ready to delete this document?")) {
        dispatch(
          documentsApi.updateDocument({
            id,
            deleted: true,
          })
        );
      }
    }
  };

  const onRenameClick = (type, id) => {
    if (type === "folder") {
      const folderName = prompt("Please input folder name")
      if(!folderName) return ;

      dispatch(
        foldersApi.updateFolder({
          name: folderName,
          id
        })
      )
    } else {
      const documentName = prompt("Please input document name")
      if(!documentName) return;

      dispatch(
        documentsApi.updateDocument({
          title: documentName,
          id
        })
      )
    }
  }

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="flex-end">
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots style={{ width: rem(16), height: rem(16) }} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconEye style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => onRenameClick(props.type, props.id)}
            >
              Rename
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              color="red"
              onClick={() => onDeleteClick(props.type, props.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      {props.type === "folder" ? (
        <IconFolder
          style={{ width: rem(100), height: rem(100) }}
          stroke={1.5}
          color="var(--mantine-color-yellow-filled"
          onClick={() => router.push(`/folder/${props.id}`)}
        />
      ) : (
        <IconFileText
          style={{ width: rem(100), height: rem(100) }}
          stroke={1.5}
          color="var(--mantine-color-blue-filled"
          onClick={() => router.push(`/doc/${props.id}`)}
        />
      )}
      <Text size="xs" truncate="end">
        {props.name}
      </Text>
    </Card>
  );
}
