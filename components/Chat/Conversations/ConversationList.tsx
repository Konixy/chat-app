import React from 'react';
import ConversationModal from './Modal';
import { Session } from 'next-auth';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import ConversationsLoader from './ConversationsLoader';
import { useConversations } from '@/lib/useConversations';

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
  const router = useRouter();
  const { conversations } = useConversations();

  if (error)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <i className="fas fa-cloud-exclamation text-6xl" />
        <div className="text-center text-3xl">Failed to fetch conversations</div>
        <div className="text-zinc-500">
          {error.name}: {error.message}
        </div>
        <button className="btn font-semibold" onClick={() => router.reload()}>
          <i className="fas fa-arrow-rotate-right mr-2" /> Reload page
        </button>
      </div>
    );

  return loading ? (
    <ConversationsLoader isSmall={isSmall} />
  ) : (
    <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
      <ConversationModal session={session} isSmall={isSmall} />

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
