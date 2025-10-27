import "../styles/globals.css";
import Analytics from "../components/Analytics";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </>
  );
}
