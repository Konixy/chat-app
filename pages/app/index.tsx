import Chat from 'components/Chat';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Auth from 'components/Auth';
import { ThreeDots } from 'react-loader-spinner';
import BackBtn from '@/components/BackBtn';
import { useTheme } from 'next-themes';

export default function App() {
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  function reloadSession() {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  }

  return session?.user ? (
    session?.user.username ? (
      <Chat session={session} />
    ) : (
      <Auth reloadSession={reloadSession} />
    )
  ) : (
    <>
      <BackBtn url="/" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ThreeDots width={50} height={50} color={theme === 'dark' ? 'white' : 'black'} />
      </div>
    </>
  );
}
