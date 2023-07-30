import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import MessageOperations from 'graphql/operations/message';
import { Message } from 'lib/types';
import toast from 'react-hot-toast';

export default function Messages({
  userId,
  convId,
  messages,
  setMessages,
}: {
  userId: string;
  convId: string;
  messages: (Message & { loading?: boolean })[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { loading, error, subscribeToMore } = useQuery<{ messages: Message[] }, { conversationId: string }>(MessageOperations.Query.messages, {
    variables: { conversationId: convId },
    onError: ({ message }) => {
      toast.error(message);
      console.log(message);
    },
    onCompleted: (data) => {
      console.log('messages query result', data);
      setMessages((prev) => [...prev, ...data.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    },
  });

  return (
    <div className="flex flex-col justify-end overflow-hidden">
      {loading && <>Loading...</>}
      {messages && (
        <div className="flex h-full flex-col-reverse overflow-y-scroll">
          {messages
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((message) => (
              // <MessageItem />
              <div key={message.id} className={message.loading ? 'text-zinc-400' : ''}>
                {message.sender.username}: {message.body}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
