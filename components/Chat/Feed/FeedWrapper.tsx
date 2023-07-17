import React from 'react';
import { ChatType } from '..';
import { useRouter } from 'next/router';

export default function FeedWrapper({ session }: ChatType) {
  const {
    query: { convId },
  } = useRouter();

  return <div className={`${convId ? 'flex' : 'hidden'} w-full flex-col border border-red-600 md:flex`}>{convId}</div>;
}
