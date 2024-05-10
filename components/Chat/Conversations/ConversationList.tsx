import React, { useEffect, useState } from 'react';
import ConversationModal from './CreateConversationModal';
import type { Session } from 'next-auth';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import { ApolloError, useMutation } from '@apollo/client';
import ConversationsLoader from './ConversationsLoader';
import { useConversations } from '@/lib/useConversations';
import { Button } from '@/components/ui/button';
import SearchConversation from './SearchConversation';
import ConversationOperations from 'graphql/operations/conversation';
import toast from 'react-hot-toast';
import AddParticipantModal from './AddParticipantsModal';
import { Conversation } from '@/lib/types';
import { CloudOff, RotateCw } from 'lucide-react';
import ConversationFooter from './ConversationFooter';
import { formatUsernames } from '@/lib/utils';

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
  collapse: (state?: boolean) => void;
}) {
  const [isModalOpen, openModal] = useState(false);
  const [addParticipantModalConversation, setAddParticipantModalConversation] = useState<Conversation | null>(null);
  const router = useRouter();
  const { conversations } = useConversations();
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [leaveConversationMutation] = useMutation<{ leaveConversation: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.leaveConversation,
  );
  const [deleteConversationMutation] = useMutation<{ deleteConversation: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.deleteConversation,
  );

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilteredConversations(Array.from(conversations.values()));
  }, [conversations]);

  useEffect(() => {
    if (searchQuery === '') setFilteredConversations(Array.from(conversations.values()));
    else {
      setFilteredConversations(
        Array.from(conversations.values()).filter((c) => {
          if (c.name) {
            return c.name?.toLowerCase().includes(searchQuery.toLowerCase());
          } else {
            return formatUsernames(c.participants, session.user.id).toLowerCase().includes(searchQuery.toLowerCase());
          }
        }),
      );
    }
  }, [searchQuery]);

  function onDeleteConversation(conversationId: string) {
    toast.promise(deleteConversationMutation({ variables: { conversationId } }), {
      loading: 'Deleting conversation...',
      success: 'Conversation deleted!',
      error: 'An error occured',
    });
  }

  function onLeaveConversation(conversationId: string) {
    toast.promise(leaveConversationMutation({ variables: { conversationId } }), {
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
      <div className="-mb-20 flex h-full flex-col overflow-y-hidden">
        <div className={'w-full pt-1' + (isSmall ? ' flex flex-col items-center' : '')}>
          <SearchConversation isSmall={isSmall} collapse={collapse} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <div className={'w-full overflow-y-scroll pb-10' + (isSmall ? ' flex flex-col items-center' : '')}>
          {conversations.size > 0
            ? (isSmall ? Array.from(conversations.values()) : filteredConversations)
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
            : !isSmall && <div className="mt-6 text-center text-muted-foreground">You don&apos;t have any conversations</div>}
        </div>
      </div>

      <div className="pointer-events-none z-20 bg-gradient-to-t from-background pt-20"></div>

      <AddParticipantModal activeConversation={addParticipantModalConversation} setActiveConversation={setAddParticipantModalConversation} />

      <ConversationModal session={session} open={isModalOpen} setOpen={openModal} />

      <ConversationFooter session={session} isSmall={isSmall} openModal={openModal} />
    </div>
  );
}
