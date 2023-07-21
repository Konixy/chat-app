import React from 'react';
import { ChatType } from '..';
import { useRouter } from 'next/router';
import Header from './Messages/Header';

export default function FeedWrapper({ session, conversations }: ChatType) {
  const router = useRouter();
  const {
    query: { convId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  return (
    <div className={`${convId ? 'flex' : 'hidden'} grow flex-col justify-between overflow-hidden md:flex`}>
      <Header conversationId={convId as string | undefined} userId={userId} conversations={conversations} />
    </div>
  );
}
