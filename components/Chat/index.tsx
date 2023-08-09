import React, { useEffect } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';
import { Conversation } from 'lib/types';
import ConversationOperations from 'graphql/operations/conversation';
import { useConversations } from 'lib/useConversations';

export default function Chat({ session }: { session: Session }) {
  const {
    conversations,
    actions: { set: setConversation },
  } = useConversations();

  const {
    // data: convsData,
    loading: convsLoading,
    error: convsError,
    subscribeToMore,
  } = useQuery<{ conversations: Conversation[] }>(ConversationOperations.Query.conversations, {
    onError: (err) => {
      console.log(err);
    },
    onCompleted: (r) => {
      r.conversations.forEach((e) => {
        setConversation(e.id, e);
      });
    },
  });

  function subscribeToNewConversations() {
    return subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData }: { subscriptionData: { data: { conversationCreated: Conversation } } }) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        setConversation(newConversation.id, newConversation);

        return prev;
      },
    });
  }

  useEffect(() => {
    const unsubscribe = subscribeToNewConversations();

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-[100vh] flex-row">
      <ConversationsWrapper
        session={session}
        conversations={conversations}
        conversationsLoading={convsLoading}
        conversationsError={convsError}
        setConversation={setConversation}
      />
      <FeedWrapper session={session} conversations={conversations} conversationsLoading={convsLoading} conversationsError={convsError} />
    </div>
  );
}
