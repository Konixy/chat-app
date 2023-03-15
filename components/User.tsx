import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { User } from 'lib/types';
import { StyledLink } from '@nextui-org/react';

export default function User() {
  const { data } = useSession();
  return data && data.user ? <UserDropdown user={data.user} /> : <StyledLink onClick={() => signIn('google')}>Sign in with Google</StyledLink>;
}

function UserDropdown({ user }: { user: User }) {
  return <>{user.name}</>;
}
