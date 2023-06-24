import { getSession, signIn, useSession } from 'next-auth/react';
import { NextPageContext } from 'next/types';
import BackBtn from 'components/BackBtn';
import { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      setIsLoading(true);
      router.push('/');
    }
  }, [data]);

  return (
    <>
      <BackBtn />
      <div className="h-[100vh]">
        <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
          <div className="text-4xl">Lyna</div>
          <button
            className="btn-primary btn w-64"
            onClick={() => {
              signIn('google');
              setIsLoading(true);
            }}
          >
            {isLoading ? (
              <Oval width={25} color="#fff" secondaryColor="#f0f0f0" />
            ) : (
              <>
                <i className="fab fa-google mr-2" /> Login or Signup with Google
              </>
            )}
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
