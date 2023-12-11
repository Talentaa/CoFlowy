import { Container, Text, Button, Group } from '@mantine/core';
import classes from './hero.module.css';
import { useRouter } from 'next/router';

export function Hero() {
  const router = useRouter();
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            fully featured
          </Text>{' '}
          online collaborative document editor
        </h1>

        <Text className={classes.description} color="dimmed">
        CoFlowy is a suite of open source content editing and real-time collaboration tools for developers building apps like Notion or Google Docs.
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={() => {
              router.push("/auth")
            }}
          >
            Get started
          </Button>
        </Group>
      </Container>
    </div>
  );
}