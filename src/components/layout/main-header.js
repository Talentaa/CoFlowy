import { Breadcrumbs, Anchor } from "@mantine/core";
import ToggleColor from "../ui/toggle-color";
import { toggleDesktopSidebar, toggleMobileSidebar } from "@/store/ui";
import { Burger, Group } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

export default function MainHeader() {
  const dispatch = useDispatch();
  const { desktopSiderbarOpened, mobileSiderbarOpened } = useSelector(
    (state) => state.ui
  );

  const data = [
    { title: "Mantine", href: "#" },
    { title: "Mantine hooks", href: "#" },
    { title: "use-id", href: "#" },
  ];
  const items = data.map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger
          opened={desktopSiderbarOpened}
          onClick={() => {
            dispatch(toggleDesktopSidebar());
          }}
          visibleFrom="sm"
          size="sm"
        />
        <Burger
          opened={mobileSiderbarOpened}
          onClick={() => {
            dispatch(toggleMobileSidebar());
          }}
          hiddenFrom="sm"
          size="sm"
        />
        <Breadcrumbs>{items}</Breadcrumbs>
      </Group>
      <Group>
        <ToggleColor />
      </Group>
    </Group>
  );
}
