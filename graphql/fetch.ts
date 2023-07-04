import axios, { AxiosResponse } from 'axios';
import { DocumentNode } from 'graphql';

interface FetchOptions {
  variables?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

interface Response {
  success?: boolean;
  error?: string;
}

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export default async function fetch<T = Record<string, Response>>(query: DocumentNode, options?: FetchOptions): Promise<AxiosResponse<{ data: T }>> {
  const response = axios.post(
    process.env.NEXT_PUBLIC_GRAPHQL_URI as string,
    {
      query: getGqlString(query),
      variables: options?.variables,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );
  return response;
}
