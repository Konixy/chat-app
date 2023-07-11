import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NextPageContext } from 'next/types';
import React, { useEffect } from 'react';
import Chat from 'components/Chat';
import { Session } from 'next-auth';

export default function Index() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  useEffect(() => {
    if (!session?.user.username) router.push('/app');
  }, [session]);

  return <Chat session={session as Session} userId={router.query.userId as string | undefined} />;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
