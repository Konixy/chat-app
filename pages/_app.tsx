import React from 'react';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {},
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {},
  },
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Lyna ・ The chat app you&apos;re looking for</title>
      </Head>
      <SessionProvider session={session}>
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className,
          }}
        >
          <NextUIProvider>
            <Component {...pageProps} />
          </NextUIProvider>
        </NextThemesProvider>
      </SessionProvider>
    </>
  );
}
