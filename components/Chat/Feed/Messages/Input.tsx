import { Session } from 'next-auth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function MessageInput({ session, conversationId }: { session: Session; conversationId: string }) {
  const [body, setBody] = useState('');

  async function onSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('onSendMessage ERROR', error);
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full px-4 py-6">
      <form onSubmit={onSendMessage}>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input input-block transition focus:border-2 focus:border-gray-7 focus:shadow-none"
          placeholder="New message"
        />
      </form>
    </div>
  );
}
