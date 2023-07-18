import React, { useEffect } from 'react';
import ConversationList from './ConversationList';
import { ChatType } from '..';
import ConversationOperations from 'graphql/operations/conversation';
import { Conversation } from 'lib/types';
import { useQuery } from '@apollo/client';

export default function ConversationsWrapper({ session }: ChatType) {
  const { data: convsData, error: convsError } = useQuery<{ conversations: Conversation[] }>(ConversationOperations.Query.conversations);

  useEffect(() => {
    console.log(convsError);
  }, [convsError]);

  return (
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} conversations={convsData && [...convsData.conversations]} />
      {/* <ConversationList session={session} conversations={undefined} /> */}
    </div>
  );
}
