import type { ConversationPopulated, Message } from '../../Lyna-api/src/lib/types';
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

export type Conversation = ConversationPopulated;

export type ConversationsMap = Items<string, Conversation>;

export { Message };
