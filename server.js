const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')

const path = require('path')
const http = require('http')

require('./models/connect')()

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './typeDefs')))

const models = require('./models')
const keys = require('./config')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) return {}
    const user = await require('./middleware/userAuth')(req.headers['authorization'])
    return { models, user }
  }
})

const app = express()
app.use('*', cors())

server.applyMiddleware({ app, path: '/graphql' })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'))
  })
}

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
httpServer.listen(keys.PORT_BACKEND, () => console.log('SERVER UP'))
