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
    <div className={`mt-8 ${participants.length > 3 ? 'grid grid-flow-row' : 'flex flex-row'} gap-2 overflow-auto`}>
      {participants.map((user, index) => (
        <div
          // eslint-disable-next-line tailwindcss/classnames-order
          className={`flex flex-row items-center gap-2 rounded-full bg-gray-5 px-5 py-2 ${
            participants.length > 3 && `[grid-column:${index + 1};] [grid-row:${Math.round((index + 1) / 3)};]`
          }`}
          key={user.id}
        >
          <div className="text-sm">{user.username}</div>
          <button className="text-zinc-400 transition-all hover:text-zinc-300" onClick={() => removeParticipant(user.id)} disabled={disabled}>
            <i className="far fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
