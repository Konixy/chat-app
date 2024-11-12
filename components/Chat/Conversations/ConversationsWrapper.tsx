'use client';

import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'lib/utils';
import { ApolloError } from '@apollo/client';
import { Session } from 'next-auth';
import { useConversations } from '@/lib/useConversations';

export default function ConversationsWrapper({
  session,
  conversationsLoading,
  conversationsError,
}: {
  session: Session;
  conversationsLoading: boolean;
  conversationsError: ApolloError | undefined;
}) {
  const [windowWidth, setWindowWidth] = useState(1400);

  const minXwidth = 350;
  const maxXwidth = windowWidth / 2;
  const sizeOnSmall = 100;

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

  useEffect(() => {
    function updateWindowDimensions() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (windowWidth < 768 && isSmall) {
      setIsSmall(false);
    } else if (windowWidth >= 768 && !isSmall) {
      if (wrapperSizeX < minXwidth / 2) {
        setWrapperSizeX(sizeOnSmall);
        setIsSmall(true);
      } else if (wrapperSizeX < minXwidth) {
        setWrapperSizeX(minXwidth);
        setIsSmall(false);
      }
    }
  }, [windowWidth]);

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

  function collapse(state: boolean = true) {
    setWrapperSizeX(state ? 100 : 400);
    setIsSmall(state);
  }

  return (
    <div
      style={{ width: `${wrapperSizeX}px`, minWidth: `${wrapperSizeX}px` }}
      className={`conversationsWrapper ${router.query.convId ? 'hidden' : 'block'} md:w-[${wrapperSizeX}px] w-full resize-x bg-background px-3 py-6 md:block`}
    >
      <ConversationList
        session={session}
        loading={conversationsLoading}
        error={conversationsError}
        onViewConversation={onViewConversation}
        isSmall={isSmall}
        collapse={collapse}
      />
      <button
        onMouseDown={dragHandler}
        style={{ left: `${wrapperSizeX - 2}px` }}
        className="absolute top-0 z-50 hidden h-full w-[4px] cursor-col-resize opacity-0 md:block"
      ></button>
    </div>
  );
}
