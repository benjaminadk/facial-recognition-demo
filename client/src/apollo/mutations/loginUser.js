import gql from 'graphql-tag'

export const LOGIN_USER = gql`
  mutation($username: String) {
    loginUser(username: $username) {
      success
      message
      user {
        id
        username
        email
        jwt
        avatar
        createdAt
      }
    }
  }
`
