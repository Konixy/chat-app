import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ThemeToggle } from './ui/theme-toggle';
import { useTheme } from 'next-themes';
import { buttonVariants } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { resolvedTheme: theme } = useTheme();

  const items = [
    { name: 'Home', url: '/' },
    {
      name: 'My chat',
      url: '/app',
    },
    {
      name: 'Terms Of Uses',
      url: '/tos',
    },
  ];

  return (
    <div className="mx-20 my-6 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-center">
        <Link href="/" className="mr-6 flex translate-y-[-3px] flex-row items-center justify-center">
          <Image src={theme === 'dark' ? '/icons/white-logo.svg' : '/icons/black-logo.svg'} alt="Logo" width={30} height={30} />
          <div className="font-metana ml-2 items-center text-3xl font-bold">Chat</div>
        </Link>
        <div className="flex flex-row items-center">
          {items.map((e, i) => (
            <Link
              key={i}
              className={`px-2 transition-colors ${router.pathname === e.url ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/80'}`}
              href={e.url}
            >
              {e.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <ThemeToggle />
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex select-none flex-row items-center justify-center px-4 text-sm text-foreground/80 outline-none transition-colors hover:text-foreground">
                <UserAvatar user={session.user} className="-ml-2 mr-2 h-8 w-8" />
                {session.user.name}
                <i className="fas fa-caret-down ml-2 text-base" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/app/me">
                  <i className="fas fa-user mr-2"></i>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/app/settings">
                  <i className="fas fa-gear mr-2"></i>
                  Account settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: '/login' }).then(() => {
                    toast.success('Successfully logged out.');
                  });
                }}
                className="cursor-pointer"
              >
                <i className="fas fa-right-from-bracket mr-2"></i>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" className={buttonVariants()}>
            Sign up
          </Link>
        )}
      </div>
    </div>
  );
}
