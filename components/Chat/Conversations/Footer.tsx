import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChevronUp, MessageCirclePlus } from 'lucide-react';
import type { Session } from 'next-auth';
import UserAvatar from '@/components/UserAvatar';
import { useState } from 'react';
import ConversationFooterMenu from './FooterMenu';

export default function ConversationFooter({
  session,
  isSmall,
  openModal,
}: {
  session: Session;
  isSmall: boolean;
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

      <ConversationFooterMenu isSmall={isSmall} open={open} setOpen={setOpen}>
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
      </ConversationFooterMenu>
    </div>
  );
}
