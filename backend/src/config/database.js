import mongoose from 'mongoose'

export async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri)
    console.log('MongoDB connection established')
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error })
  }
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect()
}
