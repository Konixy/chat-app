import React, { useEffect } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { Conversation, Message, MessageWithLoading } from 'lib/types';
import ConversationOperations from 'graphql/operations/conversation';
import MessageOperations from 'graphql/operations/message';
import { useConversations } from 'lib/useConversations';
import { Items } from 'lib/util';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

// trouver un moyens de ne pas monter et démonter ce component a chaque changement de conversation

export type ConversationMap = Items<string, Conversation>;

export type MessageMap = Items<
  {
    id: string;
    conversationId: string;
  },
  MessageWithLoading
>;

export default function Chat({ session }: { session: Session }) {
  const router = useRouter();
  const {
    conversationsActions: { set: setConversation, markAsRead: markConversationAsRead },
    messages,
    messagesActions: { editMessage, addMessage },
  } = useConversations();

  const [fetchConversations, { loading: convsLoading, error: convsError }] = useLazyQuery<{ conversations: Conversation[] }>(
    ConversationOperations.Query.conversations,
    {
      onError(err) {
        console.log(err);
      },
      onCompleted(r) {
        console.log('conversations query completed');
        r.conversations.forEach((e) => {
          setConversation(e.id, e);
        });
      },
      // fetchPolicy: 'no-cache',
    },
  );

  useEffect(() => {
    console.log('inside useEffect');
    fetchConversations();
    return () => console.log('component unmount');
  }, []);

  useSubscription<{ newMessage: Message }>(MessageOperations.Subscription.newMessage, {
    onError(err) {
      toast.error('Network Error');
      console.log(err);
    },
    onData({ data }) {
      const newMessage = data.data?.newMessage;
      if (newMessage) {
        if (messages[newMessage.conversationId] && messages[newMessage.conversationId].find((m) => m.id === newMessage.id))
          editMessage(newMessage.conversationId, newMessage.id, { ...newMessage, loading: false });
        else addMessage(newMessage.conversationId, newMessage);
      }
    },
  });

  useSubscription<{ conversationUpdated: Conversation }>(ConversationOperations.Subscriptions.conversationUpdated, {
    onError(err) {
      toast.error('Network Error');
      console.log(err);
    },
    onData({ data }) {
      const newConversation = data.data?.conversationUpdated;

      console.log('new conversation', newConversation);

      if (newConversation) {
        if (
          newConversation.id === router.query.convId &&
          newConversation.participants.find((p) => p.user.id === session.user.id)?.hasSeenAllMessages === false
        ) {
          setConversation(newConversation.id, newConversation);
          markConversationAsRead(newConversation.id, session.user.id);
        } else setConversation(newConversation.id, newConversation);
      }
    },
  });

  return (
    <div className="flex h-[100vh] flex-row">
      <ConversationsWrapper session={session} conversationsLoading={convsLoading} conversationsError={convsError} />
      <FeedWrapper session={session} conversationsLoading={convsLoading} conversationsError={convsError} />
    </div>
  );
}
