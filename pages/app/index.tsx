import React from 'react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Chat from 'components/Chat';

export default function App() {
  const { data } = useSession();

  return <Chat />;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
