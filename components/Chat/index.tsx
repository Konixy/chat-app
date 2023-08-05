import React, { useEffect, useState } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';
import { Conversation } from 'lib/types';
import ConversationOperations from 'graphql/operations/conversation';
import toast from 'react-hot-toast';

export type ChatType = {
  session: Session;
  conversations: Conversation[] | undefined;
};

export default function Chat({ session }: { session: Session }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const {
    data: convsData,
    error: convsError,
    subscribeToMore,
  } = useQuery<{ conversations: Conversation[] }>(ConversationOperations.Query.conversations, {
    onError: (err) => {
      toast.error(err.message);
      console.log(err);
    },
    onCompleted: (r) => {
      setConversations(r.conversations);
    },
  });

  function setConversation(conversationId: string, value: ((prev: Conversation) => Conversation) | Conversation) {
    setConversations((prevAll) => {
      const prev = conversations.find((c) => c.id === conversationId);
      if (!prev) return prevAll;
      const conv = value instanceof Function ? value(prev) : value;

      const i = prevAll.findIndex((c) => c.id === conversationId);
      prevAll[i] = conv;
      return prevAll;
    });
  }

  function subscribeToNewConversations() {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        if (prev.conversations.find((e) => e.id === newConversation.id)) return prev;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  }

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <div className="flex h-[100vh] flex-row">
      <ConversationsWrapper session={session} conversations={conversations} setConversation={setConversation} />
      <FeedWrapper session={session} conversations={conversations} />
    </div>
  );
}
