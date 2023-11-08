import {
  TextInput,
  Code,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  ScrollArea,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import UserButton from "./user-button";
import classes from "./main-sidebar.module.css";
import SidebarItem from "./sidebar-item";
import { IconHome, IconShare, IconHelp } from "@tabler/icons-react";

const links = [
  { label: "doc1", href: "/doc/1" },
  { label: "folder1", href: "/folder/1" },
  { label: "doc2", href: "/doc/2" },
  { label: "folder2", href: "/folder/2" },
];

export default function MainSidebar() {
  const folders = links.map((collection) => (
    <SidebarItem
      key={collection.label}
      title={collection.label}
      icon={collection.icon}
      href={collection.href}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton />
      </div>

      {/* <TextInput
        placeholder="Search"
        size="xs"
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      /> */}

      <div className={classes.section}>
        <div className={classes.items}>
          <SidebarItem title="Home" icon={IconHome} href="/home" />
          <SidebarItem title="Shares" icon={IconShare} href="/shares" />
          <SidebarItem title="Help" icon={IconHelp} href="/help" />
        </div>
      </div>

      <div className={classes.section}>
        <Group className={classes.foldersHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Folders
          </Text>
          <Tooltip label="Create a folder" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
        <ScrollArea.Autosize mah={400} mx="auto" className={classes.items}>
          {folders}
        </ScrollArea.Autosize>
      </div>
    </nav>
  );
}
