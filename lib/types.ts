import type { ConversationPopulated } from '../../Lyna-api/src/lib/types';

export type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
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
