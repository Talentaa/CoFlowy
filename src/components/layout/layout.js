import { AppShell } from "@mantine/core";
import MainSidebar from "./sidebar/main-sidebar";
import MainHeader from "./header/main-header";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { fetchFolders } from "@/api/folders";
import { fetchDocuments } from "@/api/documents";
import * as documentsStore from "@/store/documents";
import * as foldersStore from "@/store/folders";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRef } from "react";

export default function Layout({ children }) {
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const realtimeChannelRef = useRef(null);

  useEffect(() => {
    if(!user && router.route !== "/doc/[docId]") {
      router.push("/auth")
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      dispatch(fetchFolders());
      dispatch(fetchDocuments());

      const realtimeEventHandlers = [
        {
          event: "document.INSERT",
          handler: (payload) => {
            console.log("document.INSERT", payload);
            dispatch(documentsStore.insertDocument(payload.data));
          },
        },
        {
          event: "document.UPDATE",
          handler: (payload) => {
            console.log("document.UPDATE", payload);
            dispatch(documentsStore.updateDocument(payload.data));
          },
        },
        {
          event: "document.DELETE",
          handler: (payload) => {
            console.log("document.DELETE", payload);
            dispatch(documentsStore.deleteDocument(payload.data));
          },
        },
        {
          event: "folder.INSERT",
          handler: (payload) => {
            console.log("folder.INSERT", payload);
            dispatch(foldersStore.insertFolder(payload.data));
          },
        },
        {
          event: "folder.UPDATE",
          handler: (payload) => {
            console.log("folder.UPDATE", payload);
            dispatch(foldersStore.updateFolder(payload.data));
          },
        },
        {
          event: "folder.DELETE",
          handler: (payload) => {
            console.log("folder.DELETE", payload);
            dispatch(foldersStore.deleteFolder(payload.data));
          },
        },
      ];

      const realtimeChannel = createPagesBrowserClient().channel("db-changes");

      realtimeEventHandlers.forEach(({ event, handler }) => {
        realtimeChannel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "realtime_events",
            filter: `event_type=eq.${event}`,
          },
          (payload) => {
            handler(payload.new);
          }
        );
      });

      realtimeChannel.subscribe();
      realtimeChannelRef.current = realtimeChannel;
    }

    return () => {
      dispatch(documentsStore.setDocuments([]));
      dispatch(foldersStore.setFolders([]));

      if (realtimeChannelRef.current) {
        createPagesBrowserClient().removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [!!user]);

  return (
    <AppShell
      layout="alt"
      header={{ height: 63 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {
          mobile: !mobileSiderbarOpened,
          desktop: !desktopSiderbarOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <MainHeader />
      </AppShell.Header>
      <AppShell.Navbar>
        <MainSidebar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
