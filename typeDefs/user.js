const { gql } = require('apollo-server-express')

module.exports = gql`
  type User {
    id: ID
    googleId: String
    email: String
    username: String
    avatar: String
    jwt: String
    createdAt: String
  }

  type UserPayload {
    success: Boolean
    message: String
    user: User
  }

  type S3Payload {
    requestUrl: String
    avatarUrl: String
  }

  type Query {
    userById(userId: ID): User
  }

  type Mutation {
    createUser(username: String, avatar: String): UserPayload
    loginUser(username: String): UserPayload
    s3Sign(filename: String, filetype: String): S3Payload
    autoLogin: UserPayload
  }
`
