import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { config } from './envConfig'
  ; (<any>mongoose).Promise = bluebird

try {
  mongoose.connect(config.DB)
} catch (error) {
  console.log('ERROR CONNECTING TO DATABASE', error.message)
  throw error
}

// Message if Successfully Connected to DB
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to DB')
})
