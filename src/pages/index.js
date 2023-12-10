import Head from "next/head";
import { Hero } from "@/components/index/hero";
import { Features } from "@/components/index/features";

export default function Home() {
  return (
    <>
      <Head>
        <title>CoFlowy</title>
        <meta name="description" content="Share & collaborate your documents" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Features />
    </>
  );
}
