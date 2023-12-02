/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from 'react';
import { Conversation, Message, MessageWithLoading } from './types';
import { Actions, Items, useMap } from './utils';
import { useMutation } from '@apollo/client';
import ConversationOperations from 'graphql/operations/conversation';
import toast from 'react-hot-toast';

export type MessagesObjectMap = { [conversationId: string]: Message[] };

const ConversationsContext = createContext<{
  conversations: Items<string, Conversation>;
  conversationsActions: Actions<string, Conversation> & {
    markAsRead: (conversationId: string, userId: string) => void;
  };
  messages: MessagesObjectMap;
  messagesActions: {
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (conversationId: string, newMessage: MessageWithLoading) => void;
    editMessage: (conversationId: string, messageId: string, updatedMessage: MessageWithLoading) => void;
  };
}>({
  conversations: new Map<string, Conversation>(),
  conversationsActions: {
    remove: () => {},
    reset: () => {},
    set: () => {},
    setAll: () => {},
    markAsRead: () => {},
  },
  messages: {},
  messagesActions: {
    setMessages: () => {},
    addMessage: () => {},
    editMessage: () => {},
  },
});

export const useConversations = () => useContext(ConversationsContext);

export function ConversationsProvider({ children }: React.PropsWithChildren) {
  const [conversations, conversationsActions] = useMap<string, Conversation>();
  const [messagesState, setMessagesState] = useState<MessagesObjectMap>({});
  const [markConversationAsReadMutation] = useMutation<{ markConversationAsRead: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.markConversationAsRead,
    {
      onError: (err) => {
        toast.error(err.message);
        console.log(err);
      },
    },
  );

  function setMessages(conversationId: string, messages: Message[]) {
    setMessagesState({ ...messagesState, [conversationId]: messages });
  }

  function addMessage(conversationId: string, newMessage: MessageWithLoading) {
    const updatedMessages = [...(messagesState[conversationId] || []), newMessage];
    setMessagesState({ ...messagesState, [conversationId]: updatedMessages });
  }

  const editMessage = (conversationId: string, messageId: string, updatedMessage: MessageWithLoading) => {
    const updatedMessages = (messagesState[conversationId] || []).map((message) => (message.id === messageId ? { ...message, ...updatedMessage } : message));
    setMessagesState({ ...messagesState, [conversationId]: updatedMessages });
  };

  async function markConversationAsRead(conversationId: string, userId: string) {
    console.log('marking conversation as read.');
    conversationsActions.set(conversationId, (prev) => {
      if (!prev) return prev;

      const newPrev: Conversation = JSON.parse(JSON.stringify(prev));

      newPrev.participants = newPrev.participants.map((participant) => {
        if (participant.user.id === userId) {
          return {
            ...participant,
            hasSeenAllMessages: true,
          };
        }
        return participant;
      });

      return newPrev;
    });
    await markConversationAsReadMutation({
      variables: {
        conversationId,
      },
    });
  }

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        conversationsActions: { ...conversationsActions, markAsRead: markConversationAsRead },
        messages: messagesState,
        messagesActions: { setMessages, addMessage, editMessage },
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
