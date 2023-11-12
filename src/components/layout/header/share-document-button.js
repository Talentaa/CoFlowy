import CopyTextButton from "@/components/ui/copy-text-button";
import {
  ActionIcon,
  Button,
  Input,
  Modal,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useSession } from "@supabase/auth-helpers-react";
import { IconLink } from "@tabler/icons-react";
import { IconShare3 } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ShareDocumentButton(props) {
  const { documentId, children } = props;

  const [modalOpened, { open: modalOpen, close: modalClose }] =
    useDisclosure(false);

  const [inherited, setInherited] = useState(false);
  const [shareSettings, setShareSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [userQuery, setUserQuery] = useState("");
  const [addUserFieldError, setAddUserFieldError] = useState();
  const session = useSession();
  const supabase = createPagesBrowserClient();

  const { documentInheritedFrom } = useSelector((state) => ({
    documentInheritedFrom: state.documents.documents.find(
      (d) => d.id === shareSettings?.document_id
    ),
  }));

  const disableInheritance = async () => {
    const { error } = await supabase
      .from("documents")
      .update({ share_settings: null })
      .match({ id: documentId })
      .single();

    if (error) {
      console.error(error);
      return setError(error.message);
    }

    setShareSettings(null);
    setInherited(false);
  };

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

  const deleteShareSettings = async () => {
    const { error } = await supabase
      .from("shares")
      .delete()
      .match({ id: shareSettings.id });

    if (error) {
      console.error(error);
      return setError(error.message);
    }

    setShareSettings(null);
  };

  const handleAddUser = async () => {
    setAddUserFieldError("");

    if (!userQuery) {
      return;
    }

    const { data: foundUser, error } = await supabase
      .from("profiles")
      .select("id")
      .or(`username.eq.${userQuery},email.eq.${userQuery}`)
      .maybeSingle();

    if (error) {
      return setAddUserFieldError("An error occured.");
    }

    if (!foundUser) {
      return setAddUserFieldError("No user found.");
    }

    if (session?.user.id === foundUser.id) {
      return setAddUserFieldError("You cannot invite yourself.");
    }

    if (shareSettings?.user_permissions?.[foundUser.id]) {
      setAddUserFieldError("This user has already been added.");
      return;
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
          <div>Loading</div>
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
                console.log(value);
                updateShareSettings({
                  anyone_permission: value,
                });
              }}
            />
            <Space h="md" />
            <Text>Add users</Text>
            <TextInput
              placeholder="Username or email"
              leftSection={<IconLink />}
            />
          </>
        )}
      </Modal>
      <ActionIcon variant="subtle" onClick={modalOpen}>
        <IconShare3 />
      </ActionIcon>
    </>
  );
}