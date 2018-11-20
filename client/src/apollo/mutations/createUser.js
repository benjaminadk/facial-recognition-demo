import gql from 'graphql-tag'

export const CREATE_USER = gql`
  mutation($username: String, $avatar: String) {
    createUser(username: $username, avatar: $avatar) {
      success
      message
      user {
        jwt
      }
    }
  }
`
