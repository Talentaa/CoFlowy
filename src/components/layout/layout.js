import { AppShell, Burger, Group } from "@mantine/core";
import MainSidebar from "./sidebar/main-sidebar";
import MainHeader from "./header/main-header";

import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

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
