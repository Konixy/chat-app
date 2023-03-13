import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function User() {
  const { data } = useSession();
  return data ? <UserDropdown user={data} /> : <button onClick={() => signIn('google')}>Sign in with Google</button>;
}

function UserDropdown({ user }: { user: Session }) {
  return <>My messages</>;
}
