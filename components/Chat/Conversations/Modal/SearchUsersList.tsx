import React from 'react';
import type { User } from './index';
import Image from 'next/image';

export const defaultAvatar = '/icons/defaultAvatar.jpg';

export default function SearchUsersList({
  users,
  participants,
  addParticipant,
  removeParticipant,
}: {
  users: User[];
  participants: User[];
  addParticipant: (user: User) => void;
  removeParticipant: (userId: string) => void;
}) {
  return (
    <div className="flex flex-col">
      {users?.map((user) => (
        <div key={user.id} className="flex flex-row items-center rounded-xl px-4 py-3 hover:bg-backgroundSecondary">
          <div className="flex flex-row items-center">
            <div className="avatar-ring avatar avatar-sm mr-3 flex flex-row items-center">
              <Image src={user.image || defaultAvatar} className="bg-gray-9" alt={user.name as string} width={45} height={45} />
            </div>
            <span>{user.username}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="ml-3 text-content3">{user.name}</span>
            <button
              type="button"
              className={`${participants.find((e) => e.id === user.id) ? 'btn-error' : 'btn-primary'} btn`}
              onClick={() => (participants.find((e) => e.id === user.id) ? removeParticipant(user.id) : addParticipant(user))}
            >
              {participants.find((e) => e.id === user.id) ? <>Remove</> : <>Select</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
