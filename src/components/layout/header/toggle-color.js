import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import classes from "./toggle-color.module.css";

export default function ToggleColor() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="subtle"
    >
      <IconSun className={classes.light} stroke={1.5} />
      <IconMoon className={classes.dark} stroke={1.5} />
    </ActionIcon>
  );
}
