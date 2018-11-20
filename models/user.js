const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  googleId: {
    type: String,
    default: ''
  },

  email: {
    type: String,
    default: ''
  },

  username: {
    type: String,
    unique: true
  },

  avatar: String,

  jwt: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('user', userSchema)
