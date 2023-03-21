import { Session } from 'next-auth/core/types';
import React from 'react';

export default function Chat({ session }: { session: Session }) {
  return <div>chat for {session.user.username}</div>;
}
