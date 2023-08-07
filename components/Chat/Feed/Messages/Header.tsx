import React from 'react';
import { ConversationsMap } from 'lib/types';
import { useRouter } from 'next/router';
import { formatUsernames } from '@/lib/util';
import { ApolloError } from '@apollo/client';

export default function Header({
  conversations,
  conversationsLoading,
  conversationId,
  userId,
  error,
}: {
  conversations: ConversationsMap;
  conversationsLoading: boolean;
  conversationId: string;
  userId: string;
  error: ApolloError | undefined;
}) {
  const router = useRouter();

  const conversation = conversations.get(conversationId);

  const convNotFound = !!(conversationId && !conversationsLoading && !conversation && !error);

  if (convNotFound) router.replace('/app');

  if (error) return null;
  return (
    <div className="flex flex-row items-center gap-6 border-b border-gray-3 px-4 py-5 md:px-0">
      <button className={`md:hidden ${conversationId ? 'block' : 'hidden'}`} onClick={() => router.push('/app')}>
        <i className="fas fa-angle-left mr-2" />
        Back
      </button>

      {convNotFound && <div className="mx-6">Conversation Not Found</div>}
      {conversationsLoading && <div className="mx-6">Loading...</div>}
      {conversation && (
        <div className="mx-6 flex flex-row gap-4">
          <div className="text-zinc-400">To:</div>
          <div className="font-semibold">{formatUsernames(conversation.participants, userId)}</div>
        </div>
      )}
    </div>
  );
}
