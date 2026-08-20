import 'dotenv/config'

const requiredEnvironmentVariables = ['MONGODB_URI']

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`)
  }
}

const port = Number(process.env.PORT || 5000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  mongodbUri: process.env.MONGODB_URI,
}
