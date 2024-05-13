import { Separator } from '@/components/ui/separator';
import UserOperations from '@/graphql/operations/user';
import { ApiUser } from '@/lib/types';
import { useLazyQuery } from '@apollo/client';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile({ profileUserId, session }: { profileUserId: string; session: Session }) {
  const router = useRouter();
  const [user, setUser] = useState<(Required<Omit<ApiUser, 'username' | 'image'>> & { username?: string; image?: string }) | null>();
  const [getUser] = useLazyQuery<{ getUser: ApiUser }>(UserOperations.Queries.getUser);

  useEffect(() => {
    if (profileUserId === session.user.id) router.replace('/app/profile/me');
    else if (profileUserId === 'me') {
      setUser(session.user);
    } else {
      fetchUser();
    }
  }, [profileUserId]);

  async function fetchUser() {
    setUser(null);
    getUser({ variables: { id: profileUserId } }).then((r) => {
      if (r.error) {
        toast.error(`${r.error.name}: ${r.error.message}`);
        console.log(r.error);
      } else {
        setUser(r.data?.getUser);
      }
    });
  }

  return !user ? (
    <>Loading...</>
  ) : (
    <div className="flex h-full flex-col">
      <div className="flex flex-row justify-center">
        <div>{user.name}</div>
        <div>{user.username}</div>
        <div>{user.id}</div>
      </div>
    </div>
  );
}
