import React, { useState } from 'react';
import ConversationModal from './CreateConversationModal';
import { Session } from 'next-auth';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import ConversationsLoader from './ConversationsLoader';
import { useConversations } from '@/lib/useConversations';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';

export default function ConversationList({
  session,
  loading,
  error,
  onViewConversation,
  isSmall,
}: {
  session: Session;
  loading: boolean;
  error: ApolloError | undefined;
  onViewConversation: (conversationId: string, hasSeenAllMessages?: boolean) => void;
  isSmall: boolean;
}) {
  const [isModalOpen, openModal] = useState(false);
  const router = useRouter();
  const { conversations } = useConversations();

  if (error)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <i className="fas fa-cloud-exclamation text-6xl" />
        <div className="text-center text-3xl">Failed to fetch conversations</div>
        <div className="text-foreground/50">
          {error.name}: {error.message}
        </div>
        <Button className="font-semibold" onClick={() => router.reload()}>
          <i className="fas fa-arrow-rotate-right mr-2" /> Reload page
        </Button>
      </div>
    );

  return loading ? (
    <ConversationsLoader isSmall={isSmall} />
  ) : (
    <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="outline" className="ml-auto rounded-full" onClick={() => openModal(true)}>
              <i className="fas fa-message-plus text-base" />
              <span className="sr-only">New conversation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary">New conversation</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ConversationModal session={session} open={isModalOpen} setOpen={openModal} />

      <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
        {conversations.size > 0 ? (
          Array.from(conversations.values())
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                userId={session.user.id}
                onEditConversation={() => console.log('edit conversation')}
                onDeleteConversation={() => console.log('delete conversation')}
                onLeaveConversation={() => console.log('leave conversation')}
                onViewConversation={onViewConversation}
                selectedConversationId={router.query.convId as string | undefined}
                hasSeenAllMessages={conv.participants.find((p) => p.user.id === session.user.id)?.hasSeenAllMessages}
                isSmall={isSmall}
              />
            ))
        ) : (
          <div className="text-center">You don&apos;t have any conversations</div>
        )}
      </div>
    </div>
  );
}
