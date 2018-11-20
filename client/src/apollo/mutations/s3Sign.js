import gql from 'graphql-tag'

export const S3_SIGN = gql`
  mutation($filename: String, $filetype: String) {
    s3Sign(filename: $filename, filetype: $filetype) {
      requestUrl
      avatarUrl
    }
  }
`
