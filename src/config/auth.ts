import { AuthenticationError } from "apollo-server-core"
import { MiddlewareFn } from "type-graphql"
import { config } from "./envConfig"
import jwt from 'jsonwebtoken'

export interface MyContext {
  req: Request
  res: Response
  payload?: {
    user_id: object | string
    env: 'development' | 'staging' | 'production'
    user_type: string
  }
}

export const authChecker: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new AuthenticationError('Unauthorized access')
  }

  try {
    const token = (authorization as string).split(' ')[1]
    const payload = jwt.verify(token, config.JWT_SECRET) as any
    context.payload = payload
  } catch (error) {
    throw new AuthenticationError('Please login again')
  }

  return next()
}