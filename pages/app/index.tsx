import React from 'react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Chat from 'components/Chat';
import Auth from '../auth';

export default function App() {
  const { data } = useSession();

  return data ? <Chat session={data} /> : <Auth />;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
