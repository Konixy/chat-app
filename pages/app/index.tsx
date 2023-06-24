import Chat from 'components/Chat';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Auth from 'components/Auth';

export default function App() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function reloadSession() {}

  return data?.user.username ? <Chat /> : <Auth session={data} reloadSession={reloadSession} />;
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
