import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import MessageOperations from 'graphql/operations/message';
import MessageItem from './MessageItem';
import { useRouter } from 'next/router';
import MessagesLoader from './MessagesLoader';
import { useConversations } from '@/lib/useConversations';
import { Message } from 'lib/types';
import { Button } from '@/components/ui/button';
import { CloudOff, RotateCw } from 'lucide-react';

// export function cleanMessages(array: Message[]): Message[] {
//   const uniqueArray: Message[] = [];
//   array.forEach((e) => {
//     if (!uniqueArray.find((f) => f.id === e.id)) {
//       uniqueArray.push(e);
//     }
//   });
//   return uniqueArray;
// }

export default function Messages({ userId, convId }: { userId: string; convId: string }) {
  const {
    conversations,
    messages: allMessages,
    messagesActions: { setMessages },
  } = useConversations();
  const messages = allMessages[convId];
  const [fetchMessagesQuery, { loading, error }] = useLazyQuery<{ messages: Message[] }, { conversationId: string }>(MessageOperations.Query.messages, {
    onError: (err) => {
      console.log(err);
      if (err.message === 'Conversation Not Found') router.push('/app');
    },
  });
  const router = useRouter();

  function fetchMessages(conversationId: string) {
    fetchMessagesQuery({ variables: { conversationId } }).then((r) => {
      if (r.data?.messages) setMessages(conversationId, r.data?.messages);
    });
  }

  useEffect(() => {
    if (!allMessages[convId]) fetchMessages(convId);
  }, [convId]);

  if (error)
    return (
      <div className="flex size-full flex-col items-center justify-center space-y-6 text-center">
        <CloudOff className="size-28" />
        <div className="text-5xl">Failed to fetch messages</div>
        <div className="text-lg">Please check your internet connection</div>
        <div className="text-foreground/50">
          {error.name}: {error.message}
        </div>
        <Button className="items-center text-base" onClick={() => router.reload()} childrenClassName="flex flex-row items-center">
          <RotateCw className="mr-2 size-5" />
          Reload page
        </Button>
      </div>
    );

  const conversation = conversations.get(convId);
  const isGroup = (conversation?.participants.length || 2) > 2;
  let seenMessage = '';

  if (conversation?.latestMessage?.sender.id === userId) {
    if (isGroup) {
      const conversationParticipants = conversation.participants.filter((p) => p.user.id !== userId);
      const conversationParticipantsHasSeenAllMessages = conversationParticipants.filter((p) => p.hasSeenAllMessages);
      if (conversationParticipantsHasSeenAllMessages.length === 0) seenMessage = '';
      else
        seenMessage = `Seen by ${conversationParticipantsHasSeenAllMessages.length === conversationParticipants.length ? 'everyone' : conversationParticipantsHasSeenAllMessages.map((p) => p.user.username).join(', ')}`;
    } else {
      console.log(conversation.participants.filter((p) => p.user.id !== userId)[0]);
      if (conversation.participants.filter((p) => p.user.id !== userId)[0].hasSeenAllMessages) seenMessage = 'Seen';
    }
  }

  return (
    <div className="flex h-full flex-col justify-end overflow-hidden">
      {loading && <MessagesLoader isGroup={isGroup} key={convId} />}
      {messages && (
        <>
          <div className="flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden">
            {[...messages]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((message) => (
                <MessageItem key={message.id} message={message} sentByMe={message.sender.id === userId} isGroup={isGroup} />
              ))}
          </div>
          <div className="mr-4 text-right text-sm text-zinc-400">{seenMessage}</div>
        </>
      )}
    </div>
  );
}

// function subscribeToMoreMessages(
//   conversationId: string,
//   r: QueryResult<
//     {
//       messages: Message[];
//     },
//     {
//       conversationId: string;
//     }
//   >,
// ) {
//   return r.subscribeToMore({
//     document: MessageOperations.Subscription.newMessage,
//     variables: {
//       conversationId,
//     },
//     updateQuery: (
//       prev,
//       {
//         subscriptionData,
//       }: {
//         subscriptionData: {
//           data: {
//             messageSent: Message;
//           };
//         };
//       },
//     ) => {
//       if (!subscriptionData) return prev;

//       const newMessage = subscriptionData.data.messageSent;

//       // setMessages(conversationId, (prev) => [...cleanMessages([...prev, newMessage])]);

//       return { messages: [...cleanMessages([...prev.messages, newMessage])] };
//     },
//   });
// }
