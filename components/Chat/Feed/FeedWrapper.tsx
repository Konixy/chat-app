import { Session } from 'next-auth';
import React from 'react';

export default function FeedWrapper({ session, userId }: { session: Session; userId: string | undefined }) {
  return <div>FeedWrapper {userId}</div>;
}
