import { gql } from '@apollo/client';
import { MessageFields } from './message';
import { UserFields } from './user';

const ConversationFields = `
  id
  participants {
    user {
      ${UserFields}
    }
    hasSeenAllMessages
  }
  latestMessage {
    ${MessageFields}
  }
  updatedAt
`;

const conversations = {
  Query: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantsIds: [String]!) {
        createConversation(participantsIds: $participantsIds) {
          conversationId
        }
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead($conversationId: String!) {
        markConversationAsRead(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          ${ConversationFields}
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id: String
        }
      }
    `,
  },
};

export default conversations;
