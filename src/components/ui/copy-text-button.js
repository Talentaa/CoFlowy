import { CopyButton, Tooltip, rem, Button } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export default function CopyTextButton(props) {
  return (
    <CopyButton value={props.value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
          <Button
            color={copied ? "teal" : "gray"}
            variant="subtle"
            onClick={copy}
          >
            {props.value}
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
}
