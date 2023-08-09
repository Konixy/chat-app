import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageWithLoading } from 'lib/types';
import { useMutation } from '@apollo/client';
import MessageOperations from 'graphql/operations/message';
import { cleanMessages } from './Messages';
import { nanoid } from 'nanoid';

export default function MessageInput({
  session,
  conversationId, // addMessage,
  // editMessage,
}: {
  session: Session;
  conversationId: string;
  // addMessage: (convId: string, message: Message) => void;
  // editMessage: (convId: string, messageId: string, newMessage: Message) => void;
}) {
  const [body, setBody] = useState('');
  const [validate, setValidate] = useState(false);
  const [sendMessage] = useMutation<{ sendMessage: boolean }, { id: string; conversationId: string; senderId: string; body: string }>(
    MessageOperations.Mutation.sendMessage,
    {
      onError: (err) => {
        console.log(err);
        toast.error(err.message);
      },
    },
  );

  async function onSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate) return;

    try {
      const convId = conversationId;
      const messageId = nanoid();
      const message: MessageWithLoading = {
        id: messageId,
        sender: {
          id: session.user.id,
          username: session.user.username,
          image: session.user.image as string | undefined,
        },
        conversationId: convId,
        body,
        // seenByIds: [session.user.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        loading: true,
      };
      // addMessage(convId, message);
      setBody('');
      sendMessage({
        variables: { id: messageId, body, conversationId: convId, senderId: session.user.id },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<{ messages: MessageWithLoading[] }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as { messages: MessageWithLoading[] };

          cache.writeQuery<{ messages: MessageWithLoading[] }, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [...cleanMessages([message, ...existing.messages])],
            },
          });
        },
      });
      // .then((r) => {
      //   const data = r.data?.sendMessage;
      //   if (data) {
      //     editMessage(convId, messageId, Object.assign({}, message, { loading: false }));
      //   }
      // });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('onSendMessage ERROR', error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    setValidate(!!body.match(/^.*\S.*$/gm));
  }, [body]);

  return (
    <div className="w-full px-4 py-6">
      <form onSubmit={onSendMessage} className="flex flex-row items-center">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input input-block transition focus:border-2 focus:border-gray-7 focus:shadow-none"
          placeholder="New message"
        />
        <button
          type="submit"
          className="absolute right-0 mr-8 text-blue-500 transition hover:text-blue-400 active:text-blue-300 disabled:text-blue-300 disabled:hover:text-blue-300"
          disabled={!validate}
        >
          <i className="fas fa-paper-plane text-lg" />
        </button>
      </form>
    </div>
  );
}
