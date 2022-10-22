import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";

import "../utils/styles/globals.css";
import "../utils/styles/nprogress.css";


Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Job Tracker Web Application" />
        <title>Job Tracker</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;

// import '../utils/styles/globals.css'
// import type { AppProps } from 'next/app'

// function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />
// }

// export default MyApp

// <meta name="viewport" content="width=device-width, initial-scale=1" />
// <title>Job Tracker</title>
