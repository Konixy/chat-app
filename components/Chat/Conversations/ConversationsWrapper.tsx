import React from 'react';
import ConversationList from './ConversationList';
import { useRouter } from 'next/router';
import { ChatType } from '..';

export default function ConversationsWrapper({ session, conversations }: ChatType) {
  const router = useRouter();

  function onViewConversation(conversationId: string) {
    router.push(`/app/${conversationId}`);
  }

  return (
    <div className={`${router.query.convId ? 'hidden' : 'block'} w-[100%] bg-backgroundSecondary px-3 py-6 md:block md:w-[400px]`}>
      <ConversationList session={session} conversations={conversations && [...conversations]} onViewConversation={onViewConversation} />
      {/* <ConversationList session={session} conversations={undefined} /> */}
    </div>
  );
}
