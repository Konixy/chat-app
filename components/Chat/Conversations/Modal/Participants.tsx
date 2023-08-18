import React from 'react';
import { User } from '.';

export default function Participants({
  participants,
  removeParticipant,
  disabled,
}: {
  participants: User[];
  removeParticipant: (userId: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-8 flex flex-row flex-wrap gap-2 overflow-auto">
      {participants.map((user) => (
        <div className="flex flex-row items-center gap-2 rounded-full bg-zinc-800 px-5 py-2" key={user.id}>
          <div className="text-sm">{user.username}</div>
          <button className="text-zinc-400 transition-all hover:text-zinc-300" onClick={() => removeParticipant(user.id)} disabled={disabled}>
            <i className="far fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
