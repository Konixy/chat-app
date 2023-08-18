/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import ConversationOperations from 'graphql/operations/conversation';
import SearchUsersList from './SearchUsersList';
import { toast } from 'react-hot-toast';
import { User as PrismaUser } from '@prisma/client';
import Participants from './Participants';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription } from 'components/ui/dialog';

export type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'image'>;

export default function Modal({ session, isSmall }: { session: Session; isSmall: boolean }) {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isSmall ? (
          <Button className="mb-7 rounded-full text-xl font-thin text-zinc-400 transition hover:text-zinc-300" onClick={() => setOpen(true)} disabled={loading}>
            <i className="fas fa-pen-to-square" />
          </Button>
        ) : (
          <Button className="mb-4 w-full" disabled={loading}>
            Find or start a conversation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-5 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Create a conversation or a group by selecting multiple users</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSearch}>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 inline-flex items-center text-muted-foreground">
              <i className="fas fa-magnifying-glass" />
            </span>
            <Input
              className="w-full pl-10"
              type="search"
              name="search"
              placeholder="Search for a user or a group"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              disabled={loading || convLoading}
            />
          </div>

          <Button className="w-full" type="submit" disabled={!value || loading || convLoading} isLoading={loading}>
            Search
          </Button>

          {data &&
            (data.length > 0 ? (
              <SearchUsersList users={data} participants={participants} addParticipant={addParticipant} removeParticipant={removeParticipant} />
            ) : (
              <div className="text-center">Aucun résultat</div>
            ))}

          {participants.length > 0 && (
            <>
              <Participants participants={participants} removeParticipant={removeParticipant} disabled={convLoading} />
              <Button type="button" variant="secondary" disabled={convLoading || loading} onClick={() => createConversation()} isLoading={convLoading}>
                Create conversation
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
