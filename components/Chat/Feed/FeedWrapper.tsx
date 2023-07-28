import React from 'react';
import { ChatType } from '..';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';

export default function FeedWrapper({ session, conversations }: ChatType) {
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
          <Header conversationId={convId as string} userId={userId} conversations={conversations} />
          <Messages convId={convId} userId={userId} />
          <MessageInput session={session} conversationId={convId as string} />
        </>
      ) : (
        <>No Conversation Selected</>
      )}
    </div>
  );
}
