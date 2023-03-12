import React from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const { data } = useSession();
  console.log(data);
  return (
    <div>
      <button onClick={() => signIn('google')}>Sign in</button>
    </div>
  );
}
