import React from 'react';
import { Conversation } from 'lib/types';
import Link from 'next/link';

export default function ConversationItem({ conversation, userId }: { conversation: Conversation; userId: string }) {
  return (
    <Link href={`/app/${conversation.id}`} className="relative flex rounded-md p-4 hover:bg-gray-3">
      {conversation.participants
        .filter((e) => e.user.id !== userId)
        .map((e) => e.user.username)
        .join(', ')}
    </Link>
  );
}
