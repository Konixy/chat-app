import { gql } from '@apollo/client';

const user = {
  Queries: {
    searchUsers: gql`
      query SearchUsers($query: String!) {
        searchUsers(query: $query) {
          id
          username
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
