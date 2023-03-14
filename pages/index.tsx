import React, { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Loading } from '@nextui-org/react';

export default function Home() {
  const { data } = useSession();

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="my-20 flex flex-row justify-center text-center">
      {data ? (
        <>
          <Link href="app">My messages</Link>
          <Button flat color="error" auto onClick={() => signOut({ redirect: false, callbackUrl: '/' })}>
            Log out
          </Button>
        </>
      ) : data === undefined ? (
        <Button color="primary" disabled className="px-4">
          <Loading color="currentColor" size="sm" />
        </Button>
      ) : (
        <Button className="bg-blue-500" icon={<i className="fab fa-google" />} as="button" onClick={() => signIn('google')} color="primary" auto>
          Sign in with Google
        </Button>
      )}
    </div>
  );
}
