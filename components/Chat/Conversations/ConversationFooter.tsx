import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UserPlus2, MessageCirclePlus } from 'lucide-react';
import type { Session } from 'next-auth';
import ConversationFooterMenu from './ConversationFooterMenu';

export default function ConversationFooter({
  session,
  isSmall,
  openModal,
}: {
  session: Session;
  isSmall: boolean;
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={`flex ${isSmall ? 'flex-col gap-4' : 'mx-4 flex-row'} mt-4 items-center justify-between`}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className={`${isSmall ? 'size-12' : 'size-16'} rounded-full`}>
              <UserPlus2 className={isSmall ? 'size-5' : 'size-6'} />
              <span className="sr-only">Add friend</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-foreground dark:bg-secondary-foreground">Add friend</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!isSmall && <ConversationFooterMenu session={session} isSmall={isSmall} />}

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className={`${isSmall ? 'size-12' : 'size-16'} rounded-full`} onClick={() => openModal(true)}>
              <MessageCirclePlus className={isSmall ? 'size-5' : 'size-6'} />
              <span className="sr-only">New conversation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-foreground dark:bg-secondary-foreground">New conversation</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isSmall && <ConversationFooterMenu session={session} isSmall={isSmall} />}
    </div>
  );
}
