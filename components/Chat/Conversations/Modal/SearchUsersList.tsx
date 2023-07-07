import React from 'react';
import type { Data as User } from './index';

export default function SearchUsersList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-col">
      {users?.map((e) => (
        <div key={e.id}>{e.username}</div>
      ))}
    </div>
  );
}
