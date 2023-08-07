import { QueryResult, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import MessageOperations from 'graphql/operations/message';
import { ConversationsMap, Message } from 'lib/types';
import MessageItem from './MessageItem';
import { useRouter } from 'next/router';
import MessagesLoader from './MessagesLoader';

export function cleanMessages(array: Message[]): Message[] {
  const uniqueArray: Message[] = [];
  array.forEach((e) => {
    if (!uniqueArray.find((f) => f.id === e.id)) {
      uniqueArray.push(e);
    }
  });
  return uniqueArray;
}

export default function Messages({
  userId,
  convId,
  conversations, // messages,
} // setMessages,
: {
  userId: string;
  convId: string;
  conversations: ConversationsMap;
  // messages: (Message & { loading?: boolean })[];
  // setMessages: SetMessages;
}) {
  const [fetchMessagesQuery, { data, loading, error }] = useLazyQuery<{ messages: Message[] }, { conversationId: string }>(MessageOperations.Query.messages, {
    onError: (err) => {
      console.log(err);
    },
  });
  const router = useRouter();

  function fetchMessages(conversationId: string) {
    fetchMessagesQuery({ variables: { conversationId } }).then((r) => {
      // setMessages(conversationId, (prev) => [...cleanMessages([...prev, ...(r.data?.messages || [])])]);
      subscribeToMoreMessages(conversationId, r);
    });
  }

  useEffect(() => {
    fetchMessages(convId);
  }, [convId]);

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

        // setMessages(conversationId, (prev) => [...cleanMessages([...prev, newMessage])]);

        return { messages: [...cleanMessages([...prev.messages, newMessage])] };
      },
    });
  }

  if (error)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-6 text-center">
        <i className="fas fa-cloud-exclamation text-9xl" />
        <div className="text-5xl">Failed to fetch messages</div>
        <div className="text-lg">Please check your internet connection</div>
        <div className="text-zinc-500">
          {error.name}: {error.message}
        </div>
        <button className="btn btn-primary items-center text-base font-semibold" onClick={() => router.reload()}>
          <i className="fas fa-arrow-rotate-right mr-2" /> Reload page
        </button>
      </div>
    );

  const isGroup = (conversations.get(convId)?.participants.length || 2) > 2;

  return (
    <div className="flex h-full flex-col justify-end overflow-hidden">
      {loading && <MessagesLoader isGroup={isGroup} key={convId} />}
      {data && (
        <div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
          {[...data.messages]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((message) => (
              <MessageItem key={message.id} message={message} sentByMe={message.sender.id === userId} isGroup={isGroup} />
            ))}
        </div>
      )}
    </div>
  );
}
