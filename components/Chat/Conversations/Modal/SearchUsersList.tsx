import React from 'react';
import type { Data as User } from './index';
import Link from 'next/link';

export default function SearchUsersList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-col">
      {users?.map((e) => (
        <Link key={e.id} className="btn-ghost btn flex flex-row" href={`/app/${e.id}`}>
          <span>{e.username}</span>
          <span className="ml-3 text-content3">{e.name}</span>
        </Link>
      ))}
    </div>
  );
}
