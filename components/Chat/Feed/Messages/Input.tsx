import { Session } from 'next-auth';
import React, { useState } from 'react';

export default function MessageInput({ session, conversationId }: { session: Session; conversationId: string }) {
  const [body, setBody] = useState('');

  return (
    <div className="w-full px-4 py-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
