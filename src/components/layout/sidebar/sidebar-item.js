import classes from "./sidebar-item.module.css";
import Link from "next/link";
export default function SidebarItem({ href, title, icon: SidebarIcon}) {
  return (
    <div className={classes.link}>
      <SidebarIcon size={20} className={classes.linkIcon} stroke={1.5} />
      <Link href={href} className={classes.linkInner}>
        {title}
      </Link>
    </div>
  );
}
