import React, { useEffect, useState } from 'react';
import ConversationsWrapper from './Conversations/ConversationsWrapper';
import FeedWrapper from './Feed/FeedWrapper';
import { Session } from 'next-auth';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { Conversation, Message, MessageWithLoading } from 'lib/types';
import ConversationOperations from 'graphql/operations/conversation';
import MessageOperations from 'graphql/operations/message';
import { useConversations } from 'lib/useConversations';
import { Items } from 'lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Separator } from '../ui/separator';
import Head from 'next/head';

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
    conversationsActions: { set: setConversation, markAsRead: markConversationAsRead, remove: removeConversation },
    conversations,
    messages,
    messagesActions: { editMessage, addMessage },
  } = useConversations();
  const [focus, setFocus] = useState(true);
  const {
    user: { id: userId },
  } = session;
  const [title, setTitle] = useState('Inbox');

  const [fetchConversations, { loading: convsLoading, error: convsError }] = useLazyQuery<{ conversations: Conversation[] }>(
    ConversationOperations.Query.conversations,
    {
      onError(err) {
        console.log(err);
      },
      onCompleted(r) {
        r.conversations.forEach((e) => {
          setConversation(e.id, e);
        });
      },
    },
  );

  useEffect(() => {
    fetchConversations();
  }, []);

  useSubscription<{ newMessage: Message }>(MessageOperations.Subscription.newMessage, {
    onError(err) {
      toast.error('NewMessage Subscription Error');
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
      toast.error('ConversationUpdated Subscription Error');
      console.log(err);
    },
    onData({ data }) {
      const newConversation = data.data?.conversationUpdated;

      if (newConversation) {
        setConversation(newConversation.id, newConversation);
        if (
          newConversation.id === router.query.convId &&
          newConversation.participants.find((p) => p.user.id === session.user.id)?.hasSeenAllMessages === false &&
          focus
        ) {
          markConversationAsRead(newConversation.id, session.user.id);
        }
      }
    },
  });

  useSubscription<{ conversationDeleted: { id: string } }>(ConversationOperations.Subscriptions.conversationDeleted, {
    onError(err) {
      toast.error('ConversationDeleted Subscription Error');
      console.log(err);
    },
    onData({ data }) {
      const deletedConversationId = data.data?.conversationDeleted.id;

      if (deletedConversationId) {
        removeConversation(deletedConversationId);
        if (router.query.convId === deletedConversationId) router.replace('/app');
      }
    },
  });

  useSubscription<{ conversationParticipantDeleted: { participantId: string; oldConversation: Conversation; newConversation: Conversation } }>(
    ConversationOperations.Subscriptions.conversationParticipantDeleted,
    {
      onError(err) {
        toast.error('ConversationParticipantDeleted Subscription Error');
        console.log(err);
      },
      onData({ data }) {
        console.log(data);
        if (data.data?.conversationParticipantDeleted) {
          // eslint-disable-next-line no-unsafe-optional-chaining
          const { oldConversation, newConversation, participantId } = data.data?.conversationParticipantDeleted;
          console.log(data.data.conversationParticipantDeleted);
          console.log(conversations.get(oldConversation.id)); //?.participants.find((p) => p.user.id === userId)?.id
          if (participantId === conversations.get(oldConversation.id)?.participants.find((p) => p.user.id === userId)?.id) {
            removeConversation(oldConversation.id);
            router.push('/app');
          } else setConversation(newConversation.id, newConversation);
        }
      },
    },
  );

  useEffect(() => {
    const onFocusIn = () => {
      setFocus(true);
      if (router.query.convId && conversations.get(router.query.convId as string)) {
        markConversationAsRead(router.query.convId as string, session.user.id);
      }
    };

    const onFocusOut = () => {
      setFocus(false);
    };

    window.addEventListener('focus', onFocusIn);
    window.addEventListener('blur', onFocusOut);

    return () => {
      window.removeEventListener('focus', onFocusIn);
      window.removeEventListener('blur', onFocusOut);
    };
  }, [router.query.convId]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unreadConversationNumber = Array.from(conversations, ([_, value]) => value)
      .map((e) => !e.participants.find((p) => p.user.id === userId)?.hasSeenAllMessages)
      .filter(Boolean).length;

    setTitle(`${unreadConversationNumber > 0 ? `(${unreadConversationNumber})・ ` : ''}Inbox`);
  }, [conversations]);

  return (
    <div className="flex h-[100vh] flex-row">
      <Head>
        <title>{title}</title>
      </Head>
      <ConversationsWrapper session={session} conversationsLoading={convsLoading} conversationsError={convsError} />
      <Separator orientation="vertical" />
      <FeedWrapper session={session} conversationsLoading={convsLoading} conversationsError={convsError} />
    </div>
  );
}
