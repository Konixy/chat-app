/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import ConversationModal from './Modal';
import { Session } from 'next-auth';
import { Conversation } from '@/lib/types';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';

export default function ConversationList({
  session,
  conversations,
  onViewConversation,
}: {
  session: Session;
  conversations: Conversation[] | undefined;
  onViewConversation: (conversationId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-[100%]">
      <button className="btn-block btn mb-4" onClick={() => setIsOpen(true)}>
        Find or start a conversation
      </button>
      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      {conversations ? (
        <div>
          {conversations.length > 0 ? (
            conversations
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((e) => (
                <ConversationItem
                  conversation={e}
                  key={e.id}
                  userId={session.user.id}
                  onEditConversation={() => console.log('edit conversation')}
                  onDeleteConversation={() => console.log('delete conversation')}
                  onLeaveConversation={() => console.log('leave conversation')}
                  onClick={onViewConversation}
                  selectedConversationId={router.query.convId as string | undefined}
                  hasSeenAllMessages={router.query.convId === e.id ? true : false}
                />
              ))
          ) : (
            <div className="text-center">You don&apos;t have any conversations</div>
          )}
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
