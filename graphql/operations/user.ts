import { gql } from '@apollo/client';

export const UserFields = `
  id
  username
  image
  name
  createdAt
`;

const UserOperations = {
  Queries: {
    getUsers: gql`
      query GetUsers {
        getUsers {
          ${UserFields}
        }
      }
    `,
    getUser: gql`
      query GetUser($id: String!) {
        getUser(id: $id) {
          ${UserFields}
        }
      }
    `,
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

export default UserOperations;
