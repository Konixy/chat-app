import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next/types';
import React from 'react';

export default function Index() {
  const router = useRouter();
  return <div>{router.query.userId}</div>;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
