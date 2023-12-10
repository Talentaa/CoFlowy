import {
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  ScrollArea,
} from "@mantine/core";
import UserButton from "./user-button";
import classes from "./main-sidebar.module.css";
import SidebarItem from "./sidebar-item";
import { IconHome, IconShare, IconHelp, IconFolder, IconPlus } from "@tabler/icons-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { foldersApi } from "@/api";

export default function MainSidebar() {
  const session = useSession();
  const dispatch = useDispatch();
  const {
    folders,
    isLoading: isLoadingFolders,
    error: foldersError,
  } = useSelector((store) => store.folders);

  const {
    documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useSelector((store) => store.documents);

  useEffect(() => {
    if (foldersError) {
      console.error(foldersError);
    }
    if (documentsError) {
      console.error(documentsError);
    }
  }, [foldersError, documentsError]);

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton />
      </div>
      <div className={classes.section}>
        <div className={classes.items}>
          <SidebarItem title="Home" icon={IconHome} href="/home" />
          <SidebarItem title="Shares" icon={IconShare} href="/shares" />
          <SidebarItem title="Likes" icon={IconHelp} href="/likes" />
        </div>
      </div>

      <div className={classes.section}>
        <Group className={classes.foldersHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Folders
          </Text>
          <Tooltip label="Create a folder" withArrow position="right">
            <ActionIcon
              variant="default"
              size={18}
              onClick={() => {
                const folderNmae = prompt("Please input folder name");
                if (!folderNmae) return;
                dispatch(foldersApi.insertFolder({ name: folderNmae }));
              }}
            >
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
        <ScrollArea.Autosize mah={400} mx="auto" className={classes.items}>
          {folders &&
            folders
              .filter((folder) => !folder.parent_id)
              .map(({ id, name }) => (
                <SidebarItem key={id} href={`/folder/${id}`} title={name} icon={IconFolder} />
              ))}
        </ScrollArea.Autosize>
      </div>
    </nav>
  );
}
