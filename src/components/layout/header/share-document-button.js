import CopyTextButton from "@/components/ui/copy-text-button";
import Loading from "@/components/ui/loading";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useSession } from "@supabase/auth-helpers-react";
import {
  IconX,
  IconChevronRight,
  IconUser,
  IconCheck,
  IconShare3,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

export default function ShareDocumentButton(props) {
  const { documentId } = props;

  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);

  const [inherited, setInherited] = useState(false);
  const [shareSettings, setShareSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [userQuery, setUserQuery] = useState("");
  const session = useSession();
  const supabase = createPagesBrowserClient();

  const updateShareSettings = async (settings) => {
    if (!shareSettings) {
      const { data: share_settings, error } = await supabase
        .from("shares")
        .insert({ document_id: documentId, ...(settings || {}) })
        .select("*")
        .single();

      if (error) {
        console.error(error);
        return setError(error.message);
      }

      return setShareSettings(share_settings);
    }

    const { data: share_settings, error } = await supabase
      .from("shares")
      .update(settings)
      .match({ id: shareSettings.id })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return setError(error.message);
    }
    setShareSettings(share_settings);
  };

  const handleAddUser = async () => {
    if (!userQuery) {
      return;
    }

    const { data: foundUser, error } = await supabase
      .from("profiles")
      .select("id")
      .or(`username.eq.${userQuery},email.eq.${userQuery}`)
      .maybeSingle();

    if (error) {
      return notifications.show({
        color: "red",
        title: "Error",
        message: "An error occured.",
      });
    }

    if (!foundUser) {
      return notifications.show({
        color: "red",
        title: "Error",
        message: "No user found.",
      });
    }

    if (session?.user.id === foundUser.id) {
      return notifications.show({
        color: "red",
        title: "Error",
        message: "You cannot invite yourself.",
      });
    }

    if (shareSettings?.user_permissions?.[foundUser.id]) {
      return notifications.show({
        color: "red",
        title: "Error",
        message: "This user has already been added.",
      });
    }

    updateShareSettings({
      user_permissions: {
        ...(shareSettings?.user_permissions || {}),
        [foundUser.id]: "read",
      },
    });
    setUserQuery("");
  };

  const setUserPermission = (user_id, permission) => {
    const user_permissions = { ...shareSettings?.user_permissions };

    if (["edit", "read"].includes(permission)) {
      user_permissions[user_id] = permission;
    } else {
      delete user_permissions[user_id];
    }

    updateShareSettings({
      user_permissions,
    });
  };

  useEffect(() => {
    async function fetchShareSettings() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("documents")
        .select("share_settings (*)")
        .eq("id", documentId)
        .single();

      setLoading(false);

      if (error) {
        console.error(error);
        return setError(error.message);
      }

      const share_settings = data?.share_settings;
      if (share_settings) {
        setInherited(documentId !== share_settings.document_id);
        setShareSettings(share_settings);
      }
    }

    if (modalOpened) {
      fetchShareSettings();
    }

    return () => {
      setShareSettings(null);
    };
  }, [modalOpened, documentId]);

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={modalClose}
        title="Share with others"
        size="lg"
        radius="md"
      >
        {loading ? (
          <Loading />
        ) : !!error ? (
          <div>An error occurred: {error} </div>
        ) : inherited ? (
          <div>
            <Text>{`/doc/${shareSettings?.documentId}`}</Text>
          </div>
        ) : (
          <>
            <Text>Share link</Text>
            <CopyTextButton value={window.location.href} />
            <Space h="md" />
            <Text>Anyone with the link</Text>
            <Select
              checkIconPosition="left"
              data={[
                { value: "none", label: "No permission" },
                { value: "read", label: "Can read" },
                { value: "edit", label: "Can edit" },
              ]}
              defaultValue={shareSettings?.anyone_permission || "none"}
              onChange={(value) => {
                updateShareSettings({
                  anyone_permission: value,
                });
              }}
            />
            <Space h="md" />
            <Text>Add users</Text>
            <TextInput
              placeholder="Username or email"
              leftSection={<IconUser />}
              rightSectionWidth={42}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rightSection={
                <Button radius="md" onClick={handleAddUser}>
                  Add
                </Button>
              }
            />
            <Stack>
              {Object.entries(shareSettings?.user_permissions || [])
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([user_id, permission]) => (
                  <Group justify="space-between" key={user_id}>
                    <Text>{user_id}</Text>
                    <Menu shadow="md">
                      <Menu.Target>
                        <Button
                          variant="subtle"
                          rightSection={<IconChevronRight />}
                        >
                          {permission === "edit" ? "Can edit" : "Can read"}
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          rightSection={
                            permission === "read" ? <IconCheck /> : null
                          }
                          onClick={() => {
                            setUserPermission(user_id, "read");
                          }}
                        >
                          Can read
                        </Menu.Item>

                        <Menu.Item
                          rightSection={
                            permission === "edit" ? <IconCheck /> : null
                          }
                          onClick={() => {
                            setUserPermission(user_id, "edit");
                          }}
                        >
                          Can edit
                        </Menu.Item>

                        <Menu.Item
                          rightSection={<IconX />}
                          color="red"
                          onClick={() => {
                            setUserPermission(user_id, "none");
                          }}
                        >
                          Remove user
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                ))}
            </Stack>
          </>
        )}
      </Modal>
      <ActionIcon variant="subtle" onClick={modalOpen}>
        <IconShare3 />
      </ActionIcon>
    </>
  );
}
