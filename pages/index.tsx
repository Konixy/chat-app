import Header from 'components/Header';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Header />
      <div className="my-20 flex flex-row justify-center text-center">
        {data?.user ? (
          <>
            {data.user.image ? <Image src={data.user.image} alt={data.user.name as string} width={96} height={96} /> : <div>{data.user.name}</div>}
            <Link href="/app">My messages</Link>
            <button className="" onClick={() => signOut({ redirect: false, callbackUrl: '/' })}>
              Log out
            </button>
          </>
        ) : (
          <button className="bg-blue-500" onClick={() => signIn('google')}>
            <i className="fab fa-google" /> Sign in with Google
          </button>
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
