import { gql } from '@apollo/client';
import { MessageFields } from './message';

const ConversationFields = `
  id
  participants {
    user {
      id
      username
      image
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
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          ${ConversationFields}
        }
      }
    `,
  },
};

export default conversations;
