import React, { useState } from 'react';
import ConversationModal from './CreateConversationModal';
import { Session } from 'next-auth';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import { ApolloError, useMutation } from '@apollo/client';
import ConversationsLoader from './ConversationsLoader';
import { useConversations } from '@/lib/useConversations';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from 'components/ui/tooltip';
import SearchConversation from './SearchConversation';
import ConversationOperations from 'graphql/operations/conversation';
import toast from 'react-hot-toast';
import AddParticipantModal from './AddParticipantsModal';
import { Conversation } from '@/lib/types';
import { toast as sonner } from 'sonner';
import { CloudOff, MessageCirclePlus, RotateCw, UserPlus2 } from 'lucide-react';

export default function ConversationList({
  session,
  loading,
  error,
  onViewConversation,
  isSmall,
  collapse,
}: {
  session: Session;
  loading: boolean;
  error: ApolloError | undefined;
  onViewConversation: (conversationId: string, hasSeenAllMessages?: boolean) => void;
  isSmall: boolean;
  collapse: () => void;
}) {
  const [isModalOpen, openModal] = useState(false);
  const [addParticipantModalConversation, setAddParticipantModalConversation] = useState<Conversation | null>(null);
  const router = useRouter();
  const { conversations } = useConversations();
  const [leaveConversationMutation] = useMutation<{ leaveConversation: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.leaveConversation,
  );
  const [deleteConversationMutation] = useMutation<{ deleteConversation: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.deleteConversation,
  );

  function onDeleteConversation(conversationId: string) {
    toast.promise(deleteConversationMutation({ variables: { conversationId } }), {
      loading: 'Deleting conversation...',
      success: 'Conversation deleted!',
      error: 'An error occured',
    });
  }

  function onLeaveConversation(conversationId: string) {
    sonner.promise(leaveConversationMutation({ variables: { conversationId } }), {
      loading: 'Leaving conversation...',
      success: 'Successfully leaved conversation!',
      error: 'An error occured',
    });

    // toast.promise(leaveConversationMutation({ variables: { conversationId } }), {
    //   loading: 'Leaving conversation...',
    //   success: 'Successfully leaved conversation!',
    //   error: 'An error occured',
    // });
  }

  async function onAddParticipant(conversation: Conversation) {
    setAddParticipantModalConversation(conversation);
  }

  if (error)
    return (
      <div className="flex size-full flex-col items-center justify-center space-y-4">
        <CloudOff className="size-20" />

        <div className="text-center text-3xl">Failed to fetch conversations</div>
        <div className="text-foreground/50">
          {error.name}: {error.message}
        </div>
        <Button onClick={() => router.reload()} childrenClassName="flex flex-row items-center">
          <RotateCw className="mr-2 size-4" />
          Reload page
        </Button>
      </div>
    );

  return loading ? (
    <ConversationsLoader isSmall={isSmall} />
  ) : (
    <div className="flex h-full flex-col justify-between">
      <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
        <SearchConversation isSmall={isSmall} collapse={collapse} />
        {conversations.size > 0
          ? Array.from(conversations.values())
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  userId={session.user.id}
                  onEditConversation={() => console.log('edit conversation')}
                  onDeleteConversation={onDeleteConversation}
                  onLeaveConversation={onLeaveConversation}
                  onViewConversation={onViewConversation}
                  onAddParticipant={onAddParticipant}
                  selectedConversationId={router.query.convId as string | undefined}
                  hasSeenAllMessages={conv.participants.find((p) => p.user.id === session.user.id)?.hasSeenAllMessages}
                  isSmall={isSmall}
                />
              ))
          : !isSmall && <div className="text-center">You don&apos;t have any conversations</div>}
      </div>

      <AddParticipantModal activeConversation={addParticipantModalConversation} setActiveConversation={setAddParticipantModalConversation} />

      <div className={`flex ${isSmall ? 'flex-col' : 'mx-6 flex-row'} items-center justify-between gap-4`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className={`${isSmall ? 'size-12' : 'size-16'} rounded-full`} onClick={() => openModal(true)}>
                <UserPlus2 className={isSmall ? 'size-5' : 'size-6'} />
                <span className="sr-only">Add friend</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary-foreground text-foreground">Add friend</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className={`${isSmall ? 'size-12' : 'size-16'} rounded-full`} onClick={() => openModal(true)}>
                <MessageCirclePlus className={isSmall ? 'size-5' : 'size-6'} />
                <span className="sr-only">New conversation</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-secondary-foreground text-foreground">New conversation</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ConversationModal session={session} open={isModalOpen} setOpen={openModal} />
      </div>
    </div>
  );
}
