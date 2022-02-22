import express from 'express'
import helmet from 'helmet'
import { config } from './config/envConfig'

import graphQlServer from './server'

const port = config.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))

graphQlServer(app, port).catch((err) =>
  config.ENV === 'production'
    ? console.log('SERVER ERROR', err.message ?? 'An Error occured')
    : console.log('SERVER ERROR', err)
)

export default app