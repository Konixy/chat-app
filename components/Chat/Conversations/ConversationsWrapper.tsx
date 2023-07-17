import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import { ChatType } from '..';
import fetchQl from 'graphql/fetch';
import ConversationOperations from 'graphql/operations/conversation';
import { Conversation } from '@prisma/client';

export default function ConversationsWrapper({ session }: ChatType) {
  const [convsData, setConvsData] = useState<Conversation[] | undefined>();
  const [convsError, setConvsError] = useState<string | undefined>();
  const [convsLoading, setConvsLoading] = useState(true);

  useEffect(() => {
    setConvsLoading(true);
    fetchQl<{ conversations: Conversation[] }>(ConversationOperations.Query.conversations)
      .then((r) => {
        const data = r.data.data.conversations;

        setConvsLoading(false);
        setConvsData(data);
        console.log(data);
      })
      .catch((err) => {
        setConvsLoading(false);
        setConvsData(undefined);
        setConvsError(err.message);
        console.log(err);
      });
  }, []);

  return (
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} />
    </div>
  );
}
