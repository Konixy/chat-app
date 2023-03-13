import React, { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

export default function Home() {
  const { data } = useSession();

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      {data ? (
        <>
          <Link href="app">My messages</Link>
          <Button flat color="error" auto onClick={() => signOut({ redirect: false, callbackUrl: '/' })}>
            Log out
          </Button>
        </>
      ) : (
        <Button className="bg-blue-500" icon={<i className="fab fa-google" />} as="button" onClick={() => signIn('google')} color="primary" auto>
          Sign in with Google
        </Button>
      )}
    </div>
  );
}
