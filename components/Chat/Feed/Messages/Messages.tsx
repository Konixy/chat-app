import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import MessageOperations from 'graphql/operations/message';
import { Message } from 'lib/types';
import toast from 'react-hot-toast';

export default function Messages({ userId, convId }: { userId: string; convId: string }) {
  const { data, loading, error, subscribeToMore } = useQuery<{ messages: Message[] }, { conversationId: string }>(MessageOperations.Query.messages, {
    variables: { conversationId: convId },
    onError: ({ message }) => {
      toast.error(message);
      console.log(message);
    },
  });

  useEffect(() => {
    data && console.log(data);
  }, [data]);

  return (
    <div className="flex flex-col justify-end overflow-hidden">
      {loading && <>Loading...</>}
      {data?.messages && (
        <div className="flex h-full flex-col-reverse overflow-y-scroll">
          {data.messages.map((message) => (
            // <MessageItem />
            <div key={message.id}>{message.body}</div>
          ))}
        </div>
      )}
    </div>
  );
}
