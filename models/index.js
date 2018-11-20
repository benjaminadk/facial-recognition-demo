const mongoose = require('mongoose')
require('./user')
const User = mongoose.model('user')

module.exports = {
  User
}
