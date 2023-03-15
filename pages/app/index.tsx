import React from 'react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

export default function App() {
  const { data } = useSession();

  return <>{data?.user?.name}</>;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
