import React, { useEffect } from 'react';
import ConversationList from './ConversationList';
import { ChatType } from '..';
import ConversationOperations from 'graphql/operations/conversation';
import { Conversation } from 'lib/types';
import { useQuery } from '@apollo/client';

export default function ConversationsWrapper({ session }: ChatType) {
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
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} conversations={convsData && [...convsData.conversations]} />
      {/* <ConversationList session={session} conversations={undefined} /> */}
    </div>
  );
}
