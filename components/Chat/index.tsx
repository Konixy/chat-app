import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Chat() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session?.user);
  }, [session]);

  return <div>chat</div>;
}
