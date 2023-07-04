import { getSession, signIn, useSession } from 'next-auth/react';
import { NextPageContext } from 'next/types';
import BackBtn from 'components/BackBtn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Loader from 'components/Loader';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      setIsLoading(true);
      router.push('/app');
    }
  }, [data]);

  return (
    <>
      <BackBtn />
      <div className="h-[100vh]">
        <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
          <div className="mb-10 flex flex-row text-center">
            <Image src="/icons/white-logo.svg" alt="" width={30} height={30} />
            <div className="font-metana text-4xl font-bold">Lyna</div>
          </div>
          <button
            className="btn-primary btn w-64"
            onClick={() => {
              signIn('google');
              setIsLoading(true);
            }}
            disabled={isLoading}
          >
            <Loader loading={isLoading}>
              <i className="fab fa-google mr-2" /> Login or Signup with Google
            </Loader>
          </button>
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
