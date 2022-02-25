import Joi from 'joi'

import { loadEnv } from '../helpers/loadEnv'

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('development', 'staging', 'production').required(),
    PORT: Joi.number().port().default(5000),
    DB_URL: Joi.string().required(),
    SECRET_KEY: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    APP_URL: Joi.string().required(),
    EMAIL: Joi.string().email().required(),
    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_SUBDOMAIN: Joi.string().required(),
  })
  .unknown()

const env = loadEnv(schema)

// Variables
const envVars = env.NODE_ENV as 'development' | 'staging' | 'production'

export const config = {
  ENV: envVars,
  PORT: env.PORT as number,
  INTROSPECTION: envVars === 'production' ? false : true,
  DB: env.DB_URL,
  SECRET_KEY: env.SECRET_KEY,
  JWT_SECRET: env.JWT_SECRET,
  EMAIL: env.EMAIL,
  EMAIL_PASSWORD: env.EMAIL_PASSWORD,
  APP_URL: env.APP_URL,
  MAILGUN_API_KEY: env.MAILGUN_API_KEY,
  MAILGUN_SUBDOMAIN: env.MAILGUN_SUBDOMAIN,
}
