import React from 'react';
import 'styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client';
import { client } from 'graphql/apollo-client';
import { ConversationsProvider } from 'lib/useConversations';
import { ThemeProvider } from 'next-themes';
import { Toaster as Sonner } from '@/components/ui/sonner';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>NextJS Chat App</title>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <ConversationsProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Component {...pageProps} />
              <Toaster position="top-center" />
              <Sonner />
            </ThemeProvider>
          </ConversationsProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
