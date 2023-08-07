import React, { useState } from 'react';
import ConversationList from './ConversationList';
import { useRouter } from 'next/router';
import { SetAction, useLocalStorage } from 'lib/util';
import { ApolloError, useMutation } from '@apollo/client';
import ConversationOperations from 'graphql/operations/conversation';
import toast from 'react-hot-toast';
import { Session } from 'next-auth';
import { Conversation, ConversationsMap } from '@/lib/types';

const minXwidth = 350;
const maxXwidth = typeof window !== 'undefined' ? window.innerWidth / 2 : 700;
const sizeOnSmall = 100;

export default function ConversationsWrapper({
  session,
  conversations,
  conversationsLoading,
  conversationsError,
  setConversation,
}: {
  session: Session;
  conversations: ConversationsMap;
  conversationsLoading: boolean;
  conversationsError: ApolloError | undefined;
  setConversation: SetAction<string, Conversation>;
}) {
  const router = useRouter();
  const {
    user: { id: userId },
  } = session;
  const [wrapperSizeX, setWrapperSizeX] = useLocalStorage('conversationWrapperSizeX', 400);
  const [isSmall, setIsSmall] = useState(wrapperSizeX < minXwidth);
  const [markConversationAsRead] = useMutation<{ markConversationAsRead: boolean }, { conversationId: string }>(
    ConversationOperations.Mutations.markConversationAsRead,
    {
      onError: (err) => {
        toast.error(err.message);
        console.log(err);
      },
    },
  );

  async function onViewConversation(conversationId: string, hasSeenAllMessages?: boolean) {
    router.push(`/app/${conversationId}`);

    if (hasSeenAllMessages) return;

    await markConversationAsRead({
      variables: {
        conversationId,
      },
    });
    setConversation(conversationId, (prev) => {
      if (!prev) return prev;
      const prevCopy = prev;
      const participantIndex = prevCopy.participants.findIndex((p) => p.user.id === userId);
      if (participantIndex === -1) return prevCopy;
      const participantCopy = prevCopy.participants;
      participantCopy[participantIndex].hasSeenAllMessages = true;
      prevCopy.participants = participantCopy;
      return prevCopy;
    });
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
      className={`conversationsWrapper ${
        router.query.convId ? 'hidden' : 'block'
      } md:w-[${wrapperSizeX}px] w-full resize-x bg-backgroundSecondary px-3 py-6 md:block`}
    >
      <ConversationList
        session={session}
        conversations={conversations}
        loading={conversationsLoading}
        error={conversationsError}
        onViewConversation={onViewConversation}
        isSmall={isSmall}
      />
      <button
        onMouseDown={dragHandler}
        style={{ left: `${wrapperSizeX - 2}px` }}
        className="absolute top-0 z-50 hidden h-full w-[4px] cursor-w-resize opacity-0 md:block"
      ></button>
    </div>
  );
}
