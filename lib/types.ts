import { ISODateString } from 'next-auth';
import { Items } from './util';
export type User = {
  name?: string | null;
  email?: string | null;
  emailVerified: boolean | null;
  image?: string | null;
  id?: string | null;
  username?: string | null;
};

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export type Conversation = {
  id: string;
  participants: {
    user: {
      id: string;
      username: string;
      image?: string;
    };
    hasSeenAllMessages: boolean;
  }[];
  latestMessage?: Message;
  updatedAt: ISODateString;
};

export type ConversationsMap = Items<string, Conversation>;

export type Message = {
  id: string;
  sender: {
    id: string;
    username: string;
    image?: string;
  };
  body: string;
  conversationId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type MessageWithLoading = Message & { loading?: boolean; failed?: boolean };
