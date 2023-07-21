import React, { useEffect } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';
import { Conversation } from 'lib/types';
import ConversationOperations from 'graphql/operations/conversation';

export type ChatType = {
  session: Session;
  conversations: Conversation[] | undefined;
};

export default function Chat({ session }: { session: Session }) {
  const { data: convsData, error: convsError, subscribeToMore } = useQuery<{ conversations: Conversation[] }>(ConversationOperations.Query.conversations);

  useEffect(() => {
    if (convsError) console.log(convsError);
  }, [convsError]);

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
    <div className="flex h-[100vh]">
      <ConversationsWrapper session={session} conversations={convsData?.conversations} />
      <FeedWrapper session={session} conversations={convsData?.conversations} />
    </div>
  );
}
