import React, { useState } from 'react';
import ConversationModal from './Modal';
import { Session } from 'next-auth';
import { Conversation } from '@/lib/types';
import ConversationItem from './ConversationItem';

export default function ConversationList({ session, conversations }: { session: Session; conversations: Conversation[] | undefined }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[100%]">
      <button className="btn-block btn mb-4" onClick={() => setIsOpen(true)}>
        Find or start a conversation
      </button>
      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      {conversations ? (
        <div>
          {conversations
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((e) => (
              <ConversationItem conversation={e} key={e.id} userId={session.user.id} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {[0, 1, 2, 3, 4, 5].map((e) => (
            <div key={e} className="skeleton h-16 rounded-md"></div>
          ))}
        </div>
      )}
    </div>
  );
}
