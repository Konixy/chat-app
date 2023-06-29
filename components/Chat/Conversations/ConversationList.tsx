import React, { useState } from 'react';
import { Session } from 'next-auth';
import ConversationModal from './Modal';

export default function ConversationList({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-[100%]">
      <button className="btn-block btn mb-4" onClick={() => setIsOpen(true)}>
        Find or start a conversation
      </button>
      <ConversationModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
