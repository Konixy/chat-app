import { QueryResult, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import MessageOperations from 'graphql/operations/message';
import { Conversation, Message } from 'lib/types';
import toast from 'react-hot-toast';
import MessageItem from './MessageItem';
import { SetMessages } from '../FeedWrapper';

export default function Messages({
  userId,
  convId,
  conversations,
  messages,
  setMessages,
}: {
  userId: string;
  convId: string;
  conversations: Conversation[] | undefined;
  messages: (Message & { loading?: boolean })[];
  setMessages: SetMessages;
}) {
  const [fetchMessagesMutation, { loading, error }] = useLazyQuery<{ messages: Message[] }, { conversationId: string }>(MessageOperations.Query.messages, {
    onError: ({ message }) => {
      toast.error(message);
      console.log(message);
    },
  });

  function fetchMessages(conversationId: string) {
    fetchMessagesMutation({ variables: { conversationId } }).then((r) => {
      setMessages(conversationId, (prev) => [...cleanMessages([...prev, ...(r.data?.messages || [])])]);
      subscribeToMoreMessages(conversationId, r);
    });
  }

  useEffect(() => {
    fetchMessages(convId);
  }, [convId]);

  function cleanMessages(array: Message[]): Message[] {
    const uniqueArray: Message[] = [];
    array.forEach((e) => {
      if (!uniqueArray.find((f) => f.id === e.id)) {
        uniqueArray.push(e);
      }
    });
    return uniqueArray;
  }

  function subscribeToMoreMessages(
    conversationId: string,
    r: QueryResult<
      {
        messages: Message[];
      },
      {
        conversationId: string;
      }
    >,
  ) {
    r.subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: {
              messageSent: Message;
            };
          };
        },
      ) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        setMessages(conversationId, (prev) => [...cleanMessages([...prev, newMessage])]);

        return prev;
      },
    });
  }

  if (error) return null;

  return (
    <div className="flex h-full flex-col justify-end overflow-hidden">
      {loading && <>Loading...</>}
      {messages && (
        <div className="flex h-full flex-col-reverse overflow-y-auto">
          {messages
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                sentByMe={message.sender.id === userId}
                isGroup={conversations ? (conversations.find((c) => c.id === convId) as Conversation).participants.length > 2 : false}
              />
            ))}
        </div>
      )}
    </div>
  );
}
