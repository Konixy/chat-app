import React from 'react';
import type { User } from './index';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Button } from '@/components/ui/button';

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
        <div key={user.id} className="flex flex-row items-center rounded-xl border px-4 py-3">
          <div className="flex flex-row items-center">
            <Avatar className="mr-3 flex items-center">
              <AvatarImage src={user.image || undefined} alt={user.name as string} width={40} height={40} />
              <AvatarFallback>{user.name?.split(' ').map((e) => e.split('')[0])}</AvatarFallback>
            </Avatar>
            <span>{user.username}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="ml-3 text-zinc-400">{user.name}</span>
            <Button
              type="button"
              variant={participants.find((e) => e.id === user.id) ? 'secondary' : 'default'}
              className={`${participants.find((e) => e.id === user.id) ? 'btn-error' : 'btn-primary'} btn`}
              onClick={() => (participants.find((e) => e.id === user.id) ? removeParticipant(user.id) : addParticipant(user))}
            >
              {participants.find((e) => e.id === user.id) ? <>Remove</> : <>Select</>}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
