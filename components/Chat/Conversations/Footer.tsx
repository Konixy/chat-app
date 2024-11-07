import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, MessageCirclePlus } from 'lucide-react';
import type { Session } from 'next-auth';
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
import UserAvatar from '@/components/UserAvatar';
import Link from 'next/link';
import { CircleUser, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function ConversationFooter({
  session,
  isSmall,
  openModal,
}: {
  session: Session;
  isSmall: boolean;
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex ${isSmall ? 'flex-col gap-4' : 'mx-4 flex-row-reverse'} mt-4 items-center justify-between`}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className={`${isSmall ? 'size-12' : '-ml-20 size-16'} rounded-full`} onClick={() => openModal(true)}>
              <MessageCirclePlus className={isSmall ? 'size-5' : 'size-6'} />
              <span className="sr-only">New conversation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isSmall ? 'right' : 'top'} sideOffset={isSmall ? 10 : 5} className="bg-secondary text-foreground dark:bg-secondary-foreground">
            New conversation
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {isSmall ? (
            <button className="flex flex-row items-center rounded-full p-1 outline-none transition-colors hover:bg-accent hover:text-foreground dark:text-secondary dark:hover:bg-card-foreground/20 dark:hover:text-foreground">
              <UserAvatar user={session.user} className="size-8" />
            </button>
          ) : (
            <button
              className={`group flex flex-row items-center rounded-full py-2 pl-2 pr-3 outline-none transition-colors hover:bg-muted/50 ${open && 'bg-muted/50'} dark:text-secondary`}
            >
              <UserAvatar user={session.user} className="mr-2 size-12" />
              <div className="ml-2 text-left">
                <div className="text-base font-semibold text-foreground">{session.user.name}</div>
                <div className="text-sm text-foreground/50">{session.user.username}</div>
              </div>
              <ChevronUp className={`ml-3 size-5 text-secondary ${open ? 'rotate-180 opacity-100' : 'opacity-0'} transition-all group-hover:opacity-100`} />
            </button>
          )}
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
