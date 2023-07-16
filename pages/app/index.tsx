import Chat from 'components/Chat';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Auth from 'components/Auth';
import { SSRFetchSession } from 'lib/session';
import { ThreeDots } from 'react-loader-spinner';
import BackBtn from '@/components/BackBtn';

export default function App() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function reloadSession() {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  }

  return session?.user ? (
    session?.user.username ? (
      <Chat session={session} userId={undefined} />
    ) : (
      <Auth reloadSession={reloadSession} />
    )
  ) : (
    <>
      <BackBtn />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThreeDots width={50} height={50} color="white" />
      </div>
    </>
  );
}

export const getServerSideProps = SSRFetchSession;
