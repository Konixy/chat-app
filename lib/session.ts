import { getSession } from 'next-auth/react';
import type { NextPageContext } from 'next/types';

export const SSRFetchSession = async (context: NextPageContext) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
