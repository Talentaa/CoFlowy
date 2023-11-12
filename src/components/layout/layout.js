import { AppShell, Burger, Group } from "@mantine/core";
import MainSidebar from "./sidebar/main-sidebar";
import MainHeader from "./header/main-header";

import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { fetchFolders } from "@/api/folders";
import { fetchDocuments } from "@/api/documents";
import * as documentsStore from "@/store/documents";
import * as foldersStore from "@/store/folders"

export default function Layout({ children }) {
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if(!user && router.route !== "/doc/[docId]") {
      router.push("/auth")
    }
  }, [user, router])

  useEffect(() => {
    if(user) {
      dispatch(fetchFolders())
      dispatch(fetchDocuments())
    }

    return () => {
      dispatch(documentsStore.setDocuments([]))
      dispatch(foldersStore.setFolders([]))
    }

  }, [!!user])


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
