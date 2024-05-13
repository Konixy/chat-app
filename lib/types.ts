import { ISODateString } from 'next-auth';

export type User = {
  id: string;
  username?: string;
  name: string;
  image?: string | null;
  createdAt: ISODateString;
  email: string;
  emailVerified?: boolean;
};

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export type ApiUser = {
  id: string;
  username?: string;
  name: string;
  image?: string;
  createdAt: ISODateString;
};

export type Conversation = {
  id: string;
  name?: string;
  participants: {
    id: string;
    user: ApiUser;
    hasSeenAllMessages: boolean;
  }[];
  latestMessage?: Message;
  updatedAt: ISODateString;
};

export type Message = {
  id: string;
  sender: ApiUser;
  body: string;
  conversationId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type MessageWithLoading = Message & { loading?: boolean; failed?: boolean };
