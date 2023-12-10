import Layout from "@/components/layout/layout";
import { Avatar, Button, Box, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { userApi } from "@/api";
import * as userStore from "@/store/user"
export default function Settings() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: { ...user },
  });

  return (
    <Box maw={340} mx="auto">
      <Avatar src={user?.avatar_url} size={120} radius={120} mx="auto" />

      <TextInput
        label="Avatar"
        placeholder="please input a valid url"
        {...form.getInputProps("avatar_url")}
      />
      <TextInput
        label="Username"
        placeholder="Username"
        mt="md"
        {...form.getInputProps("username")}
      />
      <TextInput
        label="Email"
        mt="md"
        disabled
        {...form.getInputProps("email")}
      />

      <Button
        variant="default"
        mt="md"
        onClick={() => {
          console.log(form.values);
          dispatch(userApi.updateUser(form.values));
          dispatch(userStore.updateUser(form.values));
          
        }}
      >
        Save
      </Button>
    </Box>
  );
}

Settings.Layout = Layout;
