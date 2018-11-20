const jwt = require('jsonwebtoken')
const keys = require('../config')
const aws = require('aws-sdk')
const { promisify } = require('util')

module.exports = {
  Query: {
    userById: async (root, { userId }, { models }) => await models.User.findById(userId)
  },

  Mutation: {
    autoLogin: async (root, args, { models, user }) => {
      if (user) {
        return {
          success: true,
          message: '',
          user
        }
      } else {
        return {
          success: false,
          message: 'invalid auth token',
          user: null
        }
      }
    },

    createUser: async (root, { username, avatar }, { models }) => {
      const exists = await models.User.findOne({ username })
      if (exists) {
        return {
          success: false,
          message: 'User already exists',
          user: null
        }
      }

      try {
        const user = new models.User({
          username,
          avatar
        })
        const savedUser = await user.save()
        const token = jwt.sign(
          {
            id: savedUser._id
          },
          keys.JWT_SECRET,
          { expiresIn: '30d' }
        )
        savedUser.jwt = token
        await savedUser.save()
        return {
          success: true,
          message: 'User created successfully',
          user: savedUser
        }
      } catch (error) {
        console.log(error)
        return {
          success: false,
          message: 'Error creating User',
          user: null
        }
      }
    },

    s3Sign: async (root, { filename, filetype }, context) => {
      const s3 = new aws.S3({
        signatureVersion: 'v4',
        region: 'us-west-2',
        accessKeyId: keys.AWS_ID,
        secretAccessKey: keys.AWS_SECRET
      })
      const s3Bucket = 'facial-rec-test'
      const s3Params = {
        Bucket: s3Bucket,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: 'public-read'
      }
      const requestUrl = await s3.getSignedUrl('putObject', s3Params)
      const avatarUrl = `https://${s3Bucket}.s3.amazonaws.com/${filename}`
      return { requestUrl, avatarUrl }
    },

    loginUser: async (root, { username }, { models }) => {
      const s3Bucket = 'facial-rec-test'
      const source = `${username}-original`
      const target = `${username}-attempt`
      const rekognition = new aws.Rekognition({
        apiVersion: '2016-06-27',
        region: 'us-west-2',
        accessKeyId: keys.AWS_ID,
        secretAccessKey: keys.AWS_SECRET
      })
      const params = {
        SimilarityThreshold: 90,
        SourceImage: {
          S3Object: {
            Bucket: s3Bucket,
            Name: source
          }
        },
        TargetImage: {
          S3Object: {
            Bucket: s3Bucket,
            Name: target
          }
        }
      }

      const compare = promisify(rekognition.compareFaces.bind(rekognition))

      try {
        const data = await compare(params)
        console.log(data)
        if (!data.FaceMatches) {
          return {
            success: false,
            message: 'Facial Recognition does not detect match',
            user: null
          }
        } else {
          return {
            success: true,
            message: `Facial Recognition Match: ${data.FaceMatches[0].Similarity}%`,
            user: null
          }
        }
      } catch (error) {
        return {
          success: false,
          message: 'Facial Recognition Error',
          user: null
        }
      }
    }
  }
}
