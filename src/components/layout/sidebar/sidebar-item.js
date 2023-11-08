import { UnstyledButton } from "@mantine/core";
import classes from "./sidebar-item.module.css";
import Link from "next/link";
import { IconFolder } from "@tabler/icons-react";
export default function SidebarItem({href, title, icon: Icon = IconFolder}) {
  return (
    
      <Link href={href} className={classes.link}>
        <div className={classes.linkInner}>
          <Icon size={20} className={classes.linkIcon} stroke={1.5} />
          <span>{title}</span>
        </div>
      </Link>
  );
}
