import Layout from "@/components/layout/layout";
import { Group, Text, Divider, Stack, Table } from "@mantine/core";
import moment from "moment";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { IconFile } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function stringifyDate(date) {
  return `${moment(new Date(date)).format("DD/MM/YYYY")} at ${moment(
    new Date(date)
  ).format("HH:mm")}`;
}

export default function Home() {
  const [sharedByMeDocuments, setSharedByMeDocuments] = useState([]);
  const [sharedWithMeDocuments, setSharedWithMeDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    createPagesBrowserClient()
      .from("documents_shared_by_user")
      .select("*")
      .then(({ data, error }) => {
        if (data) {
          setSharedByMeDocuments(data);
        } else {
          console.error(error);
          setError(error.message);
        }
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    createPagesBrowserClient()
      .from("documents_shared_with_user")
      .select("*")
      .then(({ data, error }) => {
        if (data) {
          setSharedWithMeDocuments(data);
        } else {
          console.error(error);
          setError(error.message);
        }
        setIsLoading(false);
      });
  }, []);

  return (
    <Stack justify="flex-start">
      <Group>
        <Text fw={700}>Shared By me</Text>
      </Group>
      <Group justify="space-between">
        <Text size="xs">{sharedByMeDocuments.length} documents</Text>
      </Group>
      <Table highlightOnHover verticalSpacing="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Title</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Visiblity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sharedByMeDocuments?.map((document) => (
            <Table.Tr
              key={document.id}
              onClick={() => {
                router.push(`/doc/${document.id}`);
              }}
            >
              <Table.Td>
                <IconFile />
              </Table.Td>
              <Table.Td>{document.title || "Untitled"}</Table.Td>
              <Table.Td>{stringifyDate(document.share_created_at)}</Table.Td>
              <Table.Td>{document.public ? "Public" : "Private"}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Divider my="sm" />
      <Group>
        <Text fw={700}>Shared With me</Text>
      </Group>
      <Group justify="space-between">
        <Text size="xs">{sharedWithMeDocuments.length} documents</Text>
      </Group>
      <Table highlightOnHover verticalSpacing="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Title</Table.Th>
            <Table.Th>Shared by</Table.Th>
            <Table.Th>Permission</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sharedWithMeDocuments?.map((document) => (
            <Table.Tr
              key={document.id}
              onClick={() => {
                router.push(`/doc/${document.id}`);
              }}
            >
              <Table.Td>
                <IconFile />
              </Table.Td>
              <Table.Td>{document.title || "Untitled"}</Table.Td>
              <Table.Td>{document.owner_username}</Table.Td>
              <Table.Td>{document.permission}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}

Home.Layout = Layout;
