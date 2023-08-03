import React, { useEffect, useState } from 'react';
import { ChatType } from '..';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import { Message } from 'lib/types';

type AllMessages = { convId: string; messages: (Message & { loading?: boolean })[] }[];

export type SetMessages = (convId: string, value: Message[] | ((prevState: Message[]) => Message[])) => void;

export default function FeedWrapper({ session, conversations }: ChatType) {
  const router = useRouter();
  const [allMessages, setAllMessages] = useState<AllMessages>([]);
  const {
    query: { convId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  function setMessages(convId: string, value: Message[] | ((prevState: Message[]) => Message[])): void {
    setAllMessages((prevAll) => {
      const prevIndex = prevAll.findIndex((m) => m.convId === convId);
      let prev: { convId: string; messages: Message[] } = { convId, messages: [] };
      if (prevIndex !== -1) {
        prev = prevAll[prevIndex];
      }
      const v = value instanceof Function ? value(prev.messages) : value;
      // prevAll[prevIndex === -1 ? 0 : prevIndex] = { convId, messages: v };
      const newPrev: AllMessages = [...prevAll];
      if (prevIndex === -1) {
        newPrev.push({ convId, messages: v });
      } else {
        newPrev[prevIndex] = { convId, messages: v };
      }

      const result: AllMessages = [];

      newPrev.forEach((e) => {
        if (!result.find((m) => m.convId === e.convId)) result.push(e);
      });

      return [...result];
    });
  }

  function addMessage(convId: string, message: Message) {
    setMessages(convId, (prev) => [...prev, message]);
  }

  function editMessage(convId: string, messageId: string, message: Message) {
    setMessages(convId, (prev) => {
      const i = prev.findIndex((m) => m.id === messageId);
      prev[i] = message;
      return [...prev];
    });
  }

  // useEffect(() => {
  //   setMessages([]);
  // }, [convId]);

  return (
    <div className={`${convId ? 'flex' : 'hidden'} grow flex-col justify-between overflow-hidden md:flex`}>
      {convId && typeof convId === 'string' ? (
        <>
          <Header conversationId={convId as string} userId={userId} conversations={conversations} />
          <Messages
            convId={convId}
            conversations={conversations}
            userId={userId}
            messages={allMessages.find((m) => m.convId === convId)?.messages || []}
            setMessages={setMessages}
          />
          <MessageInput session={session} conversationId={convId as string} addMessage={addMessage} editMessage={editMessage} />
        </>
      ) : (
        <>No Conversation Selected</>
      )}
    </div>
  );
}
