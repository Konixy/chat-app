import React from 'react';
import { useRouter } from 'next/router';
import { formatUsernames } from 'lib/utils';
import { ApolloError } from '@apollo/client';
import { useConversations } from 'lib/useConversations';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Header({
  conversationsLoading,
  conversationId,
  userId,
  error,
}: {
  conversationsLoading: boolean;
  conversationId: string;
  userId: string;
  error: ApolloError | undefined;
}) {
  const router = useRouter();
  const { conversations } = useConversations();

  const conversation = conversations.get(conversationId);

  const convNotFound = !!(conversationId && !conversationsLoading && !conversation && !error);

  if (error) return null;
  return (
    <>
      <Button
        variant="outline"
        className={`absolute ml-4 mt-[28px] pl-2 md:hidden ${conversationId ? 'block' : 'hidden'}`}
        onClick={() => router.push('/app')}
        childrenClassName="flex flex-row items-center"
      >
        <ChevronLeft className="mr-1.5 size-5" />
        Back
      </Button>
      <div className="flex w-full flex-row items-center justify-center gap-6 border-b border-muted px-4 py-5 md:justify-start md:px-0">
        {convNotFound && <div className="mx-6">Conversation Not Found</div>}
        {conversationsLoading && <div className="mx-6">Loading...</div>}
        {conversation && (
          <div className="mx-10 flex h-12 flex-row items-center justify-center gap-4 text-center">
            {conversation.participants.length > 2 ? (
              <div
                className={`flex ${
                  conversation.participants.length === 3 ? '-space-x-4' : conversation.participants.length === 4 ? '-space-x-6' : '-space-x-8'
                } overflow-hidden`}
              >
                <UserAvatar
                  user={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user}
                  className="inline-block size-12 border-2 border-background"
                />
                {/* <div className={`${conversation.participants.length > 4 ? '-ml-8' : '-ml-6'} avatar ring-0`}> */}
                <UserAvatar
                  user={conversation.participants.filter((p) => p.user.id !== userId)[1]?.user}
                  className="inline-block size-12 border-2 border-background"
                />
                {conversation.participants.length > 3 && (
                  <UserAvatar
                    user={conversation.participants.filter((p) => p.user.id !== userId)[2]?.user}
                    className="inline-block size-12 border-2 border-background"
                  />
                )}
                {conversation.participants.length > 4 && (
                  // <div className="avatar -ml-8 ring-0">
                  //  <div className="text-lg font-semibold">+{conversation.participants.length - 3}</div>
                  //</div>
                  <UserAvatar
                    user={{ name: `+${conversation.participants.length - 4}`, username: 'null' }}
                    literralName
                    className="inline-block size-12 border-2 border-background"
                  />
                )}
              </div>
            ) : (
              <UserAvatar user={conversation.participants.filter((p) => p.user.id !== userId)[0]?.user} className="size-12" />
            )}

            {conversation.participants.length === 2 ? (
              <div className="flex flex-col text-left">
                <div className="text-lg font-semibold">{conversation.participants.filter((p) => p.user.id !== userId)[0]?.user.name}</div>
                <div className="text-md text-muted-foreground">{formatUsernames(conversation.participants, userId)}</div>
              </div>
            ) : (
              <div className="text-lg font-semibold">{formatUsernames(conversation.participants, userId)}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
