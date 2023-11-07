import {
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  ScrollArea,
} from "@mantine/core";
import {
  IconBulb,
  IconUser,
  IconCheckbox,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import UserButton from "../ui/user-button";
import classes from "./main-sidebar.module.css";
import Link from "next/link";

const links = [
  { icon: IconBulb, label: "Home" },
  { icon: IconCheckbox, label: "Shares" },
  { icon: IconUser, label: "Help" },
];

const collections = [
  { emoji: "👍", label: "Home", href: "/home" },
  { emoji: "🚚", label: "Help", href: "/help" },
  { emoji: "💸", label: "Shares", href: "/shares" },
  { emoji: "💰", label: "doc1", href: "/doc/1" },
  { emoji: "✨", label: "folder1", href: "/folder/1" },
  { emoji: "🛒", label: "doc2", href: "/doc/1" },
  { emoji: "📅", label: "folder2", href: "/folder/1" },
  { emoji: "🙈", label: "Debts", href: "/home" },
  { emoji: "💁‍♀️", label: "Customers", href: "/home" },
];

export default function MainSidebar() {
  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <Link
      href={collection.href}
      key={collection.label}
      className={classes.collectionLink}
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.emoji}
      </span>{" "}
      {collection.label}
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton />
      </div>

      <TextInput
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
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
        <ScrollArea.Autosize
          mah={400}
          mx="auto"
          className={classes.collections}
        >
          {collectionLinks}
        </ScrollArea.Autosize>
      </div>
    </nav>
  );
}
