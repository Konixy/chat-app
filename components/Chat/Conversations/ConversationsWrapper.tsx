import React from 'react';
import ConversationList from './ConversationList';
import { ChatType } from '..';

export default function ConversationsWrapper({ session, userId }: ChatType) {
  return (
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} userId={userId} />
    </div>
  );
}
