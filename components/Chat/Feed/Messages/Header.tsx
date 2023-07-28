import React from 'react';
import { Conversation } from 'lib/types';
import { useRouter } from 'next/router';
import { formatUsernames } from '@/lib/util';

export default function Header({
  conversationId,
  userId,
  conversations,
}: {
  conversationId: string;
  userId: string;
  conversations: Conversation[] | undefined;
}) {
  const router = useRouter();

  const conversation = conversations?.find((c) => c.id === conversationId);

  if (conversationId && !conversation) router.replace('/app');

  return (
    <div className="flex flex-row items-center gap-6 border-b border-gray-3 px-4 py-5 md:px-0">
      <button className={`md:hidden ${conversationId ? 'block' : 'hidden'}`} onClick={() => router.push('/app')}>
        <i className="fas fa-angle-left mr-2" />
        Back
      </button>

      {conversationId && !conversation && <>Conversation Not Found</>}
      {conversation && (
        <div className="mx-6 flex flex-row gap-4">
          <div className="text-zinc-400">To:</div>
          <div className="font-semibold">{formatUsernames(conversation.participants, userId)}</div>
        </div>
      )}
    </div>
  );
}
