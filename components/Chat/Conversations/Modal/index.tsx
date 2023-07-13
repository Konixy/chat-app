/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useState } from 'react';
import fetchQl from 'graphql/fetch';
import UserOperations from 'graphql/operations/user';
import ConversationOperations from 'graphql/operations/conversation';
import Loader from 'components/Loader';
import SearchUsersList from './SearchUsersList';
import { toast } from 'react-hot-toast';
import { User as PrismaUser } from '@prisma/client';
import Participants from './Participants';
import { CreateConversationData } from 'lib/types';
import { Session } from 'next-auth';

export type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'image'>;

export default function Modal({ session, isOpen, setIsOpen }: { session: Session; isOpen: boolean; setIsOpen: (state: boolean) => void }) {
  const [value, setValue] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [data, setData] = useState<User[] | undefined>();

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    fetchQl<{ searchUsers: User[] }>(UserOperations.Queries.searchUsers, { variables: { query: value } })
      .then((r) => {
        const data = r.data.data.searchUsers;
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        toast.error(e.message);
      });
  }

  function addParticipant(user: User) {
    setParticipants((prev) => [...prev, user]);
    setValue('');
    setData(undefined);
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((e) => e.id !== userId));
  }

  async function createConversation() {
    setConvLoading(true);

    const participantsIds: string[] = [session.user.id, ...participants.map((e) => e.id)];

    fetchQl<CreateConversationData>(ConversationOperations.Mutations.createConversation, { variables: { participantsIds } })
      .then((r) => {
        setConvLoading(false);
        const data = r.data.data.createConversation;
        console.log(data);
      })
      .catch((e) => {
        setConvLoading(false);
        console.log(e);
        toast.error(e.message);
      });
  }

  return (
    <>
      <input type="checkbox" className="display-none modal-state" checked={isOpen} id="conversation-modal" readOnly />
      <div className="modal">
        <span className="modal-overlay" onClick={() => setIsOpen(false)} />
        <div className="modal-content flex w-96 flex-col gap-5">
          <button className="btn-sm btn-circle btn-ghost btn absolute right-2 top-2" onClick={() => setIsOpen(false)}>
            ✕
          </button>
          <div className="text-xl">Search</div>
          <form className="flex flex-col gap-4" onSubmit={onSearch}>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 inline-flex items-center text-content3">
                <i className="fas fa-magnifying-glass" />
              </span>
              <input
                className="input input-block pl-10"
                type="search"
                name="search"
                placeholder="Search for a user or a group"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                disabled={loading || convLoading}
              />
            </div>

            <button className="btn-block btn" type="submit" disabled={!value || loading || convLoading}>
              <Loader loading={loading}>Search</Loader>
            </button>

            {data &&
              (data.length > 0 ? (
                <SearchUsersList users={data} participants={participants} addParticipant={addParticipant} removeParticipant={removeParticipant} />
              ) : (
                <div className="text-center">Aucun résultat</div>
              ))}

            {participants.length > 0 && (
              <>
                <Participants participants={participants} removeParticipant={removeParticipant} disabled={convLoading} />
                <button type="button" className="btn-primary btn" disabled={convLoading || loading} onClick={() => createConversation()}>
                  <Loader loading={convLoading}>Create conversation</Loader>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
