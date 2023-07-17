import React from 'react';
import { Conversation } from 'lib/types';

export default function ConversationItem({ conversation, userId }: { conversation: Conversation; userId: string }) {
  return (
    <div>
      {conversation.participants
        .filter((e) => e.user.id !== userId)
        .map((e) => e.user.username)
        .join(', ')}
    </div>
  );
}
