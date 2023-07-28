import type { ConversationPopulated, Message } from '../../Lyna-api/src/lib/types';
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

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export { Message };
