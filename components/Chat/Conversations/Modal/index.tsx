/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import ConversationOperations from 'graphql/operations/conversation';
import Loader from 'components/Loader';
import SearchUsersList from './SearchUsersList';
import { toast } from 'react-hot-toast';
import { User as PrismaUser } from '@prisma/client';
import Participants from './Participants';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

export type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'image'>;

export default function Modal({ session, isOpen, setIsOpen }: { session: Session; isOpen: boolean; setIsOpen: (state: boolean) => void }) {
  const [value, setValue] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const router = useRouter();
  const [data, setData] = useState<User[] | undefined>();
  const [searchUsers, { loading, error }] = useLazyQuery<{ searchUsers: User[] }>(UserOperations.Queries.searchUsers);
  const [createConversationMutation, { loading: convLoading }] = useMutation<{ createConversation: { conversationId: string } }, { participantsIds: string[] }>(
    ConversationOperations.Mutations.createConversation,
  );

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    searchUsers({ variables: { query: value } })
      .then((r) => {
        if (r.error) {
          toast.error(r.error.message);
          console.log(r.error);
        }

        setData(r.data?.searchUsers);
      })
      .catch((e) => {
        console.log(e);
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
    const participantsIds: string[] = [session.user.id, ...participants.map((e) => e.id)];

    createConversationMutation({ variables: { participantsIds } })
      .then((r) => {
        if (r.errors) {
          toast.error(r.errors[0].message);
          console.log(r.errors[0]);
        } else if (r.data) {
          const data = r.data.createConversation;
          const { conversationId } = data;
          router.push(`/app/${conversationId}`);
        }

        setValue('');
        setParticipants([]);
        setIsOpen(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.message);
      });
  }

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [error]);

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
