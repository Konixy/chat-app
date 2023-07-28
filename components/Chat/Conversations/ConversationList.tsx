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
}: {
  session: Session;
  conversations: Conversation[] | undefined;
  onViewConversation: (conversationId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-[100%]">
      <button className="btn btn-block mb-4" onClick={() => setIsOpen(true)}>
        Find or start a conversation
      </button>
      <ConversationModal session={session} isOpen={isOpen} setIsOpen={setIsOpen} />
      {conversations ? (
        <div className="w-full">
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
        <div className="flex w-full flex-col space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex w-full flex-row items-center justify-between p-4">
              <div className="skeleton mx-3 h-10 w-10 rounded-full ring-2 ring-gray-7"></div>
              <div className="flex w-[72%] flex-row items-center justify-between">
                <div className="flex h-full w-[50%] flex-col space-y-2">
                  <div className="skeleton h-6 rounded-lg" style={{ width: `${Math.round(Math.random() * 72 + 56)}px` }}></div>
                  <div className="skeleton h-6 rounded-lg" style={{ width: `${Math.round(Math.random() * 48 + 72)}px` }}></div>
                </div>
                <div className="flex h-full items-center">
                  <div className="skeleton h-6 w-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
          <SkeletonLoader count={6} height="[72px]" width="full" />
        </div>
      )}
    </div>
  );
}
