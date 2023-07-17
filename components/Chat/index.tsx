import React from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';

export type ChatType = {
  session: Session;
};

export default function Chat({ session }: ChatType) {
  return (
    <div className="flex h-[100vh]">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </div>
  );
}
