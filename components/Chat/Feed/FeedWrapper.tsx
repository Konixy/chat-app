import React, { useEffect, useState } from 'react';
import { ChatType } from '..';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import { Message } from 'lib/types';

export default function FeedWrapper({ session, conversations }: ChatType) {
  const router = useRouter();
  const [messages, setMessages] = useState<(Message & { loading?: boolean })[]>([]);
  const {
    query: { convId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  function addMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function editMessage(messageId: string, message: Message) {
    setMessages((prev) => {
      const i = prev.findIndex((m) => m.id === messageId);
      prev[i] = message;
      return [...prev];
    });
  }

  useEffect(() => {
    setMessages([]);
  }, [convId]);

  return (
    <div className={`${convId ? 'flex' : 'hidden'} grow flex-col justify-between overflow-hidden md:flex`}>
      {convId && typeof convId === 'string' ? (
        <>
          <Header conversationId={convId as string} userId={userId} conversations={conversations} />
          <Messages convId={convId} userId={userId} messages={messages} setMessages={setMessages} />
          <MessageInput session={session} conversationId={convId as string} addMessage={addMessage} editMessage={editMessage} />
        </>
      ) : (
        <>No Conversation Selected</>
      )}
    </div>
  );
}
