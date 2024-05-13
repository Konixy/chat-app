import React from 'react';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import type { Session } from 'next-auth';
import type { ApolloError } from '@apollo/client';
import Image from 'next/image';
import { useConversations } from '@/lib/useConversations';
import Profile from './Profile/Profile';

export default function FeedWrapper({
  session,
  conversationsLoading,
  conversationsError,
}: {
  session: Session;
  conversationsLoading: boolean;
  conversationsError: ApolloError | undefined;
}) {
  const router = useRouter();
  const { conversations } = useConversations();

  const {
    query: { convId, userId: profileUserId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  return (
    <div className={`${convId ? 'flex' : 'hidden'} grow flex-col justify-between overflow-hidden md:flex`}>
      {convId && typeof convId === 'string' ? (
        <>
          <Header conversationId={convId as string} userId={userId} conversationsLoading={conversationsLoading} error={conversationsError} />
          <Messages convId={convId} userId={userId} />
          <MessageInput session={session} conversationId={convId as string} />
        </>
      ) : profileUserId && typeof profileUserId === 'string' ? (
        <>
          <Profile profileUserId={profileUserId} session={session} />
        </>
      ) : (
        <div className={`ml-4 ${conversations.size > 0 ? 'mt-28' : 'absolute bottom-36'}`}>
          <div>
            <Image
              src="/icons/white-arrow.png"
              alt="arrow"
              width={33}
              height={88}
              className={'hidden dark:block' + (conversations.size === 0 ? ' -scale-y-100' : '')}
            />
            <Image
              src="/icons/black-arrow.png"
              alt="arrow"
              width={33}
              height={88}
              className={'block dark:hidden' + (conversations.size === 0 ? ' -scale-y-100' : '')}
            />
          </div>
          <div className={`${conversations.size > 0 ? '-mt-4' : 'mt-[-105px]'} ml-12 font-lato text-2xl font-bold`}>
            {conversations.size > 0 ? 'Select a conversation and start chatting!' : 'Create a conversation and start chatting!'}
          </div>
        </div>
      )}
    </div>
  );
}
