import React from 'react';
import Navbar from 'components/Navbar';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <Navbar />
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
