import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
import { Session } from 'next-auth';
import UserAvatar from '@/components/UserAvatar';
import Link from 'next/link';
import { CircleUser, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

export default function ConversationFooterMenu({ session, isSmall }: { session: Session; isSmall: boolean }) {
  const { resolvedTheme, theme, setTheme } = useTheme();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex flex-row items-center rounded-full py-1 ${isSmall ? 'px-1' : 'ml-2 pl-1 pr-3'} outline-none transition-colors hover:bg-accent hover:text-foreground dark:text-secondary dark:hover:bg-card-foreground/20 dark:hover:text-foreground`}
          >
            <UserAvatar user={session.user} className={isSmall ? 'size-8' : 'mr-2 size-7'} />
            {!isSmall && <div className="text-base">{session.user.username}</div>}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={isSmall ? 'mb-2 ml-3' : 'mb-2'} side={isSmall ? 'right' : 'top'}>
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

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              {resolvedTheme === 'dark' ? <Moon className="mr-2 size-4" /> : <Sun className="mr-2 size-4" />}
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme}>
                <DropdownMenuRadioItem className="cursor-pointer" value="dark" onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem className="cursor-pointer" value="light" onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem className="cursor-pointer" value="system" onClick={() => setTheme('system')}>
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

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
    </div>
  );
}
