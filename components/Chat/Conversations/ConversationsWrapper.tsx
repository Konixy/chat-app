import React, { useState } from 'react';
import ConversationList from './ConversationList';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'lib/utils';
import { ApolloError } from '@apollo/client';
import { Session } from 'next-auth';
import { useConversations } from '@/lib/useConversations';

const minXwidth = 350;
const maxXwidth = typeof window !== 'undefined' ? window.innerWidth / 2 : 700;
const sizeOnSmall = 100;

export default function ConversationsWrapper({
  session,
  conversationsLoading,
  conversationsError,
}: {
  session: Session;
  conversationsLoading: boolean;
  conversationsError: ApolloError | undefined;
}) {
  const router = useRouter();
  const {
    conversationsActions: { markAsRead: markConversationAsRead },
  } = useConversations();
  const {
    user: { id: userId },
  } = session;
  const [wrapperSizeX, setWrapperSizeX] = useLocalStorage('conversationWrapperSizeX', 400);
  const [isSmall, setIsSmall] = useState(wrapperSizeX < minXwidth);

  async function onViewConversation(conversationId: string, hasSeenAllMessages?: boolean) {
    router.push(`/app/${conversationId}`);

    if (hasSeenAllMessages) return;

    markConversationAsRead(conversationId, userId);
  }

  const dragHandler = (mouseDownEvent: React.MouseEvent<HTMLButtonElement>) => {
    const startSize = wrapperSizeX;
    const startPosition = mouseDownEvent.pageX;

    function onMouseMove(mouseMoveEvent: unknown) {
      let newSize = startSize - startPosition + (mouseMoveEvent as React.MouseEvent).pageX;
      if (newSize < minXwidth / 2) {
        newSize = sizeOnSmall;
        setIsSmall(true);
      } else if (newSize < minXwidth) {
        newSize = minXwidth;
        setIsSmall(false);
      } else if (newSize > maxXwidth) {
        newSize = maxXwidth;
        setIsSmall(false);
      } else {
        setIsSmall(false);
      }

      setWrapperSizeX(newSize);
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  return (
    <div
      style={{ width: `${wrapperSizeX}px`, minWidth: `${wrapperSizeX}px` }}
      className={`conversationsWrapper ${router.query.convId ? 'hidden' : 'block'} md:w-[${wrapperSizeX}px] w-full resize-x bg-background px-3 py-6 md:block`}
    >
      <ConversationList session={session} loading={conversationsLoading} error={conversationsError} onViewConversation={onViewConversation} isSmall={isSmall} />
      <button
        onMouseDown={dragHandler}
        style={{ left: `${wrapperSizeX - 2}px` }}
        className="absolute top-0 z-50 hidden h-full w-[4px] cursor-col-resize opacity-0 md:block"
      ></button>
    </div>
  );
}
