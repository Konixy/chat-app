import React from 'react';
import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from 'graphql/apollo-client';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Lyna ・ Just a chat app</title>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
