import { config } from 'dotenv'
import type { Schema } from 'joi'
import path from 'path'

export const loadEnv = (schema: Schema) => {
  config({ path: path.join(__dirname, '../../.env') })

  const { value, error } = schema.validate(process.env)

  if (error) {
    throw new Error(`Environment Variable Error: ${error.message}`)
  }

  return value
}
