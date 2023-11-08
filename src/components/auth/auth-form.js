import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Title,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Container,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import classes from "./auth-form.module.css";
import { IconBrandGithub } from "@tabler/icons-react";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function AuthForm(props) {
  const [type, toggle] = useToggle(["signIn", "signUp"]);
  const supabase = useSupabaseClient();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 8
          ? "Password should include at least 8 characters"
          : null,
    },
  });

  const handleSubmit = async (email, password) => {
    if (type == "signIn") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        notifications.show({
          message: signInError.message,
          autoClose: 3000,
          color: "red"
        })
        return;
      }
    } else if (type == "signUp") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        notifications.show({
          message: signUpError.message,
          autoClose: 3000,
          color: "red",
        });
        return;
      }
    }
  };

  const signInWithGithub = async (e) => {
    e.preventDefault();
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (signInError) {
      notifications.show({
        message: signInError.message,
        autoClose: 3000,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome to CoFlowy
      </Title>

      <Paper radius="md" p="xl" mt={30} withBorder {...props}>
        <Group grow mb="md" mt="md">
          <Button
            variant="default"
            radius="xl"
            leftSection={<IconBrandGithub />}
            onClick={signInWithGithub}
          >
            Github
          </Button>
          <Button
            variant="default"
            radius="xl"
            leftSection={<IconBrandGoogle />}
          >
            Google
          </Button>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form
          onSubmit={form.onSubmit(({ email, password }) =>
            handleSubmit(email, password)
          )}
        >
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 8 characters"
              }
              radius="md"
            />

            {type === "signUp" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "signUp"
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
