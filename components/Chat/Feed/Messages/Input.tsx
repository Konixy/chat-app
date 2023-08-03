import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Message } from 'lib/types';
import { useMutation } from '@apollo/client';
import MessageOperations from 'graphql/operations/message';

export default function MessageInput({
  session,
  conversationId,
  addMessage,
  editMessage,
}: {
  session: Session;
  conversationId: string;
  addMessage: (convId: string, message: Message) => void;
  editMessage: (convId: string, messageId: string, newMessage: Message) => void;
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
      const messageId = Date.now().toString();
      const message: Message & { loading?: boolean } = {
        senderId: session.user.id,
        sender: { id: session.user.id, username: session.user.username },
        conversationId: convId,
        body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: messageId,
        seenByIds: [session.user.id],
        loading: true,
      };
      addMessage(convId, message);
      setBody('');
      sendMessage({ variables: { id: messageId, body, conversationId: convId, senderId: session.user.id } }).then((r) => {
        const data = r.data?.sendMessage;
        if (data) {
          editMessage(convId, messageId, Object.assign({}, message, { loading: false }));
        }
      });

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
