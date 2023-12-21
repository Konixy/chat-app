import React, { useEffect, useState } from 'react';
import UserOperations from 'graphql/operations/user';
import ConversationOperations from 'graphql/operations/conversation';
import { toast } from 'react-hot-toast';
import { User as PrismaUser } from '@prisma/client';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from 'components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'components/ui/command';
import UserAvatar from '@/components/UserAvatar';
import { Conversation } from '@/lib/types';

export type User = Pick<PrismaUser, 'id' | 'username' | 'name' | 'image'>;

export default function AddParticipantModal({
  activeConversation,
  setActiveConversation,
}: {
  activeConversation: Conversation | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}) {
  const [participants, setParticipants] = useState<User[]>([]);
  const { data: users, loading, error, fetchMore } = useQuery<{ getUsers: User[] }>(UserOperations.Queries.getUsers);
  const [addParticipantsMutation, { loading: mutationLoading }] = useMutation<{ addParticipants: boolean }, { conversationId: string; userIds: string[] }>(
    ConversationOperations.Mutations.addParticipants,
  );

  useEffect(() => {
    if (activeConversation) fetchMore({});
    else setParticipants([]);
  }, [activeConversation]);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [error]);

  if (!activeConversation) return <></>;

  async function addParticipants() {
    if (!activeConversation) return;

    const participantsIds: string[] = [...participants.map((e) => e.id)];

    addParticipantsMutation({
      variables: { conversationId: activeConversation.id, userIds: [...participantsIds] },
      onError(err) {
        toast.error(err.message);
        console.log(JSON.stringify(err, null, 2));
      },
      onCompleted(data) {
        if (!data.addParticipants) {
          toast.error('Failed to add members to the conversation.');
        } else {
          toast.success(`Successfully added ${participants.length} new members to the conversation.`);
          setParticipants([]);
          setActiveConversation(null);
        }
      },
    });
  }

  return (
    <Dialog open={!!activeConversation} onOpenChange={() => setActiveConversation(null)}>
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Add members to {activeConversation.name || 'this conversation'}</DialogDescription>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t">
          <CommandInput placeholder="Search user..." disabled={loading || mutationLoading} />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup className="p-2">
              {users &&
                users.getUsers &&
                users.getUsers
                  .filter((u) => !activeConversation.participants.find((p) => p.user.id === u.id))
                  .map((user) => (
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
            disabled={participants.length < 1 || mutationLoading}
            isLoading={loading || mutationLoading}
            onClick={() => {
              addParticipants();
            }}
          >
            Add members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
