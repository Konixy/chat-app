import React, { useState } from 'react';
import ConversationModal from './Modal';
import { ChatType } from '..';

export default function ConversationList({ session, userId }: ChatType) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-[100%]">
      <button className="btn-block btn mb-4" onClick={() => setIsOpen(true)}>
        Find or start a conversation
      </button>
      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
