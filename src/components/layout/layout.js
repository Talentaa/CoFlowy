import { AppShell, Burger, Group } from "@mantine/core";
import MainSidebar from "./main-sidebar";
import MainHeader from "./main-header";

import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
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
