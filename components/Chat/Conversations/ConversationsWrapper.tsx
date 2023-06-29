import { Session } from 'next-auth';
import React from 'react';
import ConversationList from './ConversationList';

export default function ConversationsWrapper({ session }: { session: Session }) {
  return (
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} />
    </div>
  );
}
