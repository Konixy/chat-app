import React from 'react';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import { Session } from 'next-auth';
import { ConversationsMap } from 'lib/types';
import { ApolloError } from '@apollo/client';

export default function FeedWrapper({
  session,
  conversations,
  conversationsLoading,
  conversationsError,
}: {
  session: Session;
  conversations: ConversationsMap;
  conversationsLoading: boolean;
  conversationsError: ApolloError | undefined;
}) {
  const router = useRouter();

  const {
    query: { convId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  return (
    <div className={`${convId ? 'flex' : 'hidden'} grow flex-col justify-between overflow-hidden md:flex`}>
      {convId && typeof convId === 'string' ? (
        <>
          <Header
            conversationId={convId as string}
            userId={userId}
            conversations={conversations}
            conversationsLoading={conversationsLoading}
            error={conversationsError}
          />
          <Messages convId={convId} conversations={conversations} userId={userId} />
          <MessageInput session={session} conversationId={convId as string} />
        </>
      ) : (
        <>No Conversation Selected</>
      )}
    </div>
  );
}
