import { Avatar, Button } from '@nextui-org/react';
import Header from 'components/Header';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Header />
      <div className="my-20 flex flex-row justify-center text-center">
        {data?.user ? (
          <>
            {data.user.image ? <Avatar src={data.user.image} /> : <Avatar text={data.user.name as string} />}
            <Link href="/app">My messages</Link>
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
