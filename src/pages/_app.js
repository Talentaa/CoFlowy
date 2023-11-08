import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Provider as ReduxProvider} from "react-redux";
import store from "@/store";

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  const Layout = Component.Layout || (({ children }) => children);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider>
        <ReduxProvider store={store}>
          <Notifications />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ReduxProvider>
      </MantineProvider>
    </SessionContextProvider>
  );
}
