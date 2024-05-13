import BackBtn from '@/components/BackBtn';
import Chat from '@/components/Chat/Chat';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function Profile() {
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();
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
      <BackBtn url="/app" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThreeDots width={50} height={50} color={theme === 'dark' ? 'white' : 'black'} />
      </div>
    </>
  );
}
