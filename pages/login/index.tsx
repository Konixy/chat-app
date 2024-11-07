import React from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import { NextPageContext } from 'next/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from 'components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
      <div className="h-[100vh]">
        <div className="absolute right-1/2 top-1/2 inline-block -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center text-center">
          <div className="mb-10 flex w-full flex-row justify-center text-center">
            <Image src={'/icons/white-logo.svg'} alt="Chat" width={50} height={50} className="hidden dark:block" />
            <Image src={'/icons/black-logo.svg'} alt="Chat" width={50} height={50} className="block dark:hidden" />
            <div className="font-metana ml-4 text-6xl font-bold">Chat</div>
          </div>
          <Button
            className="w-64 pl-3"
            onClick={() => {
              signIn('google');
              setIsLoading(true);
            }}
            childrenClassName="flex flex-row items-center"
            disabled={isLoading}
            isLoading={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="mr-3 size-4 fill-primary-foreground">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Login or Signup with Google
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 flex w-full flex-col items-center gap-4 text-center text-secondary-foreground dark:text-secondary">
        <div className="flex flex-row items-center gap-2">
          <a
            href="https://github.com/Konixy/chat-app"
            target="_blank"
            rel="noreferrer"
            role="button"
            className="flex size-9 items-center justify-center rounded-md p-1 transition-colors hover:bg-muted dark:hover:bg-secondary-foreground dark:hover:text-white"
          >
            <GitHubLogoIcon className="size-5" />
          </a>
          <ThemeToggle className="hover:bg-muted dark:hover:bg-secondary-foreground" variant="ghost" allign="center" />
        </div>
        <div>
          A NextJS full-stack chat app by{' '}
          <a href="https://github.com/Konixy" target="_blank" rel="noreferrer" className="font-bold hover:underline">
            Konixy
          </a>
          .
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
