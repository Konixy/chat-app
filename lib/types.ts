import { ISODateString } from 'next-auth';
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

export type ApiUser = {
  name?: string;
  username: string;
  image?: string;
  id: string;
};

export type Conversation = {
  id: string;
  participants: {
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
