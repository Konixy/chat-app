import Chat from 'components/Chat';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Auth from 'components/Auth';

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

  return session?.user.username ? <Chat /> : <Auth reloadSession={reloadSession} />;
  // return <Auth session={data} reloadSession={reloadSession} />;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
