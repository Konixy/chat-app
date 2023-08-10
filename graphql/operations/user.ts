import { gql } from '@apollo/client';

export const UserFields = `
  id
  username
  image
  name
`;

const user = {
  Queries: {
    searchUsers: gql`
      query SearchUsers($query: String!) {
        searchUsers(query: $query) {
          ${UserFields}
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};

export default user;
