import mongoose from 'mongoose'

export async function connectToDatabase(uri) {
  try {
    mongoose.set('bufferCommands', false)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    })
    console.log('MongoDB connection established')
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error })
  }
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect()
}
