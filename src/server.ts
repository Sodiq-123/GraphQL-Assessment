import 'reflect-metadata'
import { GraphQLError } from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { Application } from 'express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import depthLimit from 'graphql-depth-limit'
import { buildSchema } from 'type-graphql'
import http from 'http'

import './config/db'
import './events'
import resolvers from './graphql/resolver/index'
import { config } from './config/envConfig'

const graphQlServer = async (app: Application, PORT: string | number) => {

  // Graphl Server
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: false,
    validate: false,
    dateScalarMode: 'isoDate'
  })
  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    schema,
    introspection: config.INTROSPECTION,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    validationRules: [depthLimit(10)],
    formatError: (error: GraphQLError): any => {
      if (error.extensions && error.extensions.code === 'INTERNAL_SERVER_ERROR') {
        error.message = 'Something went wrong'
      }
      return config.ENV === 'production' ? error.message : error
    }
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, path: '/graphql' })

  httpServer.listen(PORT, () => {
    console.log(`Server is Listening on Port ${PORT}`)
  })
}

export default graphQlServer
