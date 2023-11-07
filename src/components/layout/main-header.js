import { Breadcrumbs, Anchor } from "@mantine/core";

export default function MainHeader() {
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

  return <Breadcrumbs>{items}</Breadcrumbs>;
}
