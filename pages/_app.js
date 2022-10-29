import "../styles/globals.css";
import Head from "next/head";
import { FileContextProvider } from "../src/Context/FileContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PDF Sign</title>
      </Head>
      <FileContextProvider>
        <Component {...pageProps} />
      </FileContextProvider>
    </>
  );
}

export default MyApp;
