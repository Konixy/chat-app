import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Chat from 'components/Chat';
import { Session } from 'next-auth';
import BackBtn from 'components/BackBtn';
import { ThreeDots } from 'react-loader-spinner';

export default function Index() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  useEffect(() => {
    if (session && !session.user?.username) router.push('/app');
  }, [session]);

  return session ? (
    <Chat session={session as Session} />
  ) : (
    <>
      <BackBtn />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThreeDots width={50} height={50} color="white" />
      </div>
    </>
  );
}
