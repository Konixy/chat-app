import React from 'react';
import { useRouter } from 'next/router';
import Header from './Messages/Header';
import MessageInput from './Messages/Input';
import Messages from './Messages/Messages';
import { Session } from 'next-auth';
import { ApolloError } from '@apollo/client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useConversations } from '@/lib/useConversations';

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
  const theme = useTheme();
  const { conversations } = useConversations();

  const {
    query: { convId },
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
      ) : (
        <div className={`ml-4 ${conversations.size > 0 ? 'mt-28' : 'mt-10'}`}>
          <div>
            <Image src={`/icons/${theme.resolvedTheme === 'dark' ? 'white' : 'black'}-arrow.png`} alt="arrow" width={33} height={88} />
          </div>
          <div className="-mt-4 ml-12 font-lato text-2xl font-bold">
            {conversations.size > 0 ? 'Select a conversation and start chatting!' : 'Create a conversation and start chatting!'}
          </div>
        </div>
      )}
    </div>
  );
}
