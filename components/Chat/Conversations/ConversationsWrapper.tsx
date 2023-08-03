import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import { useRouter } from 'next/router';
import { ChatType } from '..';
import { useLocalStorage } from 'lib/util';
import { useSubscription } from '@apollo/client';
import ConversationOperations from 'graphql/operations/conversation';

const minXwidth = 350;
const sizeOnSmall = 100;

export default function ConversationsWrapper({ session, conversations }: ChatType) {
  const router = useRouter();
  const [wrapperSizeX, setWrapperSizeX] = useLocalStorage('conversationWrapperSizeX', 400);
  const [isSmall, setIsSmall] = useState(wrapperSizeX < minXwidth);

  function onViewConversation(conversationId: string) {
    router.push(`/app/${conversationId}`);
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
      style={{ width: `${wrapperSizeX}px` }}
      className={`${router.query.convId ? 'hidden' : 'block'} md:w-[${wrapperSizeX}px] w-full resize-x bg-backgroundSecondary px-3 py-6 md:block`}
    >
      <ConversationList session={session} conversations={conversations && [...conversations]} onViewConversation={onViewConversation} isSmall={isSmall} />
      <button
        onMouseDown={dragHandler}
        style={{ left: `${wrapperSizeX - 2}px` }}
        className="absolute top-0 z-50 hidden h-full w-[4px] cursor-w-resize opacity-0 md:block"
      ></button>
    </div>
  );
}
