import { gql } from '@apollo/client';
import { UserFields } from './user';

export const MessageFields = `
  id
  sender {
    ${UserFields}
  }
  body
  conversationId
  createdAt
  updatedAt
`;

const messages = {
  Query: {
    messages: gql`
      query Messages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage($id: String!, $conversationId: String!, $senderId: String!, $body: String!) {
        sendMessage(id: $id, conversationId: $conversationId, senderId: $senderId, body: $body)
      }
    `,
  },
  Subscription: {
    newMessage: gql`
      subscription NewMessage {
        newMessage {
          ${MessageFields}
        }
      }
    `,
  },
};

export default messages;
