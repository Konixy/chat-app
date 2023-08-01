/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import ConversationModal from './Modal';
import { Session } from 'next-auth';
import { Conversation } from '@/lib/types';
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function ConversationList({
  session,
  conversations,
  onViewConversation,
  isSmall,
}: {
  session: Session;
  conversations: Conversation[] | undefined;
  onViewConversation: (conversationId: string) => void;
  isSmall: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
      {isSmall ? (
        <button className="mb-7 rounded-full text-xl font-thin text-zinc-400 transition hover:text-zinc-300" onClick={() => setIsOpen(true)}>
          <i className="fas fa-pen-to-square" />
        </button>
      ) : (
        <button className="btn btn-block mb-4" onClick={() => setIsOpen(true)}>
          Find or start a conversation
        </button>
      )}

      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      {conversations ? (
        <div className={['w-full', isSmall && 'flex flex-col items-center'].join(' ')}>
          {conversations.length > 0 ? (
            conversations
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  userId={session.user.id}
                  onEditConversation={() => console.log('edit conversation')}
                  onDeleteConversation={() => console.log('delete conversation')}
                  onLeaveConversation={() => console.log('leave conversation')}
                  onClick={onViewConversation}
                  selectedConversationId={router.query.convId as string | undefined}
                  hasSeenAllMessages={conv.participants.find((p) => p.user.id === session.user.id)?.hasSeenAllMessages}
                  isSmall={isSmall}
                />
              ))
          ) : (
            <div className="text-center">You don&apos;t have any conversations</div>
          )}
        </div>
      ) : (
        <div className="w-full">
          {[...Array(6)].map((_, i) =>
            isSmall ? (
              <div key={i}>skeleton loader</div>
            ) : (
              <div key={i} className="flex w-full flex-row items-center justify-between p-4">
                <div className="skeleton mx-3 h-10 w-10 rounded-full ring-2 ring-gray-7"></div>
                <div className="flex w-[72%] flex-row items-center justify-between">
                  <div className="flex h-full w-[50%] flex-col space-y-2">
                    <div className="skeleton h-5 rounded-lg" style={{ width: `${Math.round(Math.random() * 72 + 56)}px` }}></div>
                    <div className="skeleton h-5 rounded-lg" style={{ width: `${Math.round(Math.random() * 48 + 72)}px` }}></div>
                  </div>
                  <div className="flex h-full items-center">
                    <div className="skeleton h-5 w-24 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
