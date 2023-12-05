import React from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import { NextPageContext } from 'next/types';
import BackBtn from 'components/BackBtn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from 'components/ui/button';
import { useTheme } from 'next-themes';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    if (data?.user) {
      setIsLoading(true);
      router.push('/app');
    }
  }, [data]);

  return (
    <>
      <BackBtn url="/" />
      <div className="h-[100vh]">
        <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
          <div className="mb-10 flex w-full flex-row justify-center text-center">
            <Image src={theme === 'dark' ? '/icons/white-logo.svg' : '/icons/black-logo.svg'} alt="Lyna" width={50} height={50} />
            <div className="font-metana ml-4 text-6xl font-bold">Chat</div>
          </div>
          <Button
            className="w-64"
            onClick={() => {
              signIn('google');
              setIsLoading(true);
            }}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <i className="fab fa-google mr-2" /> Login or Signup with Google
          </Button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
