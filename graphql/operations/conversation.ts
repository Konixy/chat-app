import { gql } from '@apollo/client';

const ConversationFields = `
  conversations {
    id
    participants {
      user {
        id
        username
      }
      hasSeenAllMessages
    }
    latestMessage {
      id
      sender {
        id
        username
      }
      body
      createdAt
    }
    updatedAt
  }
`;

const user = {
  Query: {
    conversations: gql`
      query Conversations {
        ${ConversationFields}
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
  },
  Subscriptions: {},
};

export default user;
