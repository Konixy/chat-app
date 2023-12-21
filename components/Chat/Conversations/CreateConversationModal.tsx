import React, { useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import ConversationOperations from 'graphql/operations/conversation';
import { toast } from 'react-hot-toast';
import { User as PrismaUser } from '@prisma/client';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from 'components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'components/ui/command';
import UserAvatar from '@/components/UserAvatar';

export type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'image'>;

export default function ConversationModal({
  session,
  open,
  setOpen,
}: {
  session: Session;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [participants, setParticipants] = useState<User[]>([]);
  const router = useRouter();
  const { data: users, loading, error, fetchMore } = useQuery<{ getUsers: User[] }>(UserOperations.Queries.getUsers);
  const [createConversationMutation, { loading: convLoading }] = useMutation<{ createConversation: { conversationId: string } }, { participantsIds: string[] }>(
    ConversationOperations.Mutations.createConversation,
  );

  useEffect(() => {
    if (open) fetchMore({});
  }, [open]);

  async function createConversation() {
    const participantsIds: string[] = [session.user.id, ...participants.map((e) => e.id)];

    createConversationMutation({ variables: { participantsIds } })
      .then((r) => {
        if (r.errors) {
          r.errors.forEach((e) => {
            toast.error(e.message);
            console.log(e);
          });
        } else if (r.data) {
          const data = r.data.createConversation;
          const { conversationId } = data;
          router.push(`/app/${conversationId}`);
        }

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

  // console.log(Array(200).fill({ id: String(Date.now()), name: nanoid() as string, username: nanoid() as string } as User));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Create a conversation or a group by selecting multiple users</DialogDescription>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t">
          <CommandInput placeholder="Search user..." disabled={loading || convLoading} />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup className="p-2">
              {users &&
                users.getUsers &&
                users.getUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (participants.includes(user)) {
                        return setParticipants(participants.filter((selectedUser) => selectedUser !== user));
                      }

                      return setParticipants([...users.getUsers].filter((u) => [...participants, user].includes(u)));
                    }}
                  >
                    <UserAvatar user={user} />
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>
                    {participants.includes(user) ? <i className="fas fa-check ml-auto flex text-xl text-primary" /> : null}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
          {participants.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {participants.map((user) => (
                <UserAvatar key={user.id} user={user} className="inline-block border-2 border-background" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select users to add to this conversation.</p>
          )}
          <Button
            disabled={participants.length < 1 || convLoading}
            isLoading={loading || convLoading}
            onClick={() => {
              createConversation();
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
