import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ThemeToggle } from './ui/theme-toggle';
import { buttonVariants } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { CircleUser, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

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
          <Image src="/icons/white-logo.svg" alt="Logo" width={30} height={30} className="hidden dark:block" />
          <Image src="/icons/black-logo.svg" alt="Logo" width={30} height={30} className="block dark:hidden" />
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
                <UserAvatar user={session.user} className="-ml-2 mr-2 size-8" />
                {session.user.name}
                <CaretDownIcon className="ml-0.5 size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/app/profile/me">
                  <CircleUser className="mr-2 size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/app/settings">
                  <Settings className="mr-2 size-4" />
                  Account settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(signOut({ redirect: true, callbackUrl: '/login' }), {
                    loading: 'Logging out...',
                    success: 'Successfully logged out!',
                    error: 'An error occured',
                  });
                }}
                className="cursor-pointer focus:bg-destructive/75"
              >
                <LogOut className="mr-2 size-4" />
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
