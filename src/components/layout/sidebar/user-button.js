import { UnstyledButton, Group, Avatar, Text, rem, Menu } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./user-button.module.css";
import { useUser } from "@supabase/auth-helpers-react";
import { IconSettings } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function UserButton() {
  const user = useUser();
  
  const onClickSignOut = async () => {
    const {error} = await createPagesBrowserClient().auth.signOut();
    if(error) {
      console.error(error.message);
    }
  }

  return (
    <Menu shadow="md" width="300px">
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar src={user?.user_metadata.avatar_url} radius="xl" />

            <div style={{ flex: 1 }}>
              <Text c="dimmed" size="xs">
                {user?.email}
              </Text>
            </div>

            <IconChevronRight
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={
            <IconLogout style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={onClickSignOut}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
