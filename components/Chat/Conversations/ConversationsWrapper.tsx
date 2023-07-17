import React, { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import { ChatType } from '..';
import fetchQl from 'graphql/fetch';
import ConversationOperations from 'graphql/operations/conversation';
import { Conversation } from 'lib/types';

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
  }, [session.user]);

  return (
    <div className="w-[100%] bg-backgroundSecondary px-3 py-6 md:w-[400px]">
      <ConversationList session={session} conversations={convsData || []} conversationsLoading={convsLoading} />
    </div>
  );
}
