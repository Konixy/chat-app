import Header from 'components/Header';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

export default function Home() {
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="my-20 flex flex-row justify-center text-center">
        <div className="text-6xl font-semibold">An awesome chat app</div>
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
