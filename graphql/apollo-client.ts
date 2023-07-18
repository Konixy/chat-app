import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
  credentials: 'include',
});

const wsLink =
  typeof window !== undefined
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_WEBSOCKET_URL as string,
        }),
      )
    : null;

const link =
  typeof window !== undefined && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        wsLink,
        httpLink,
      )
    : httpLink;

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
