import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { NextPageContext } from 'next/types';

export default function Auth() {
  return (
    <div className="h-[100vh]">
      <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
        <button onClick={() => signIn('google')} className="">
          <i className="fab fa-google" />
          Sign in with Google
        </button>
        <Link href="/" className="mt-4" color="text">
          <i className="fas fa-arrow-left mr-2" /> Back to homepage
        </Link>
      </div>
    </div>
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
