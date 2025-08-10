import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) return mongoose.connection
  const uri = process.env.DATABASE_URI || process.env.MONGODB_URI
  if (!uri) throw new Error('DATABASE_URI is not set')

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || undefined,
  })
  isConnected = true
  return mongoose.connection
}

export const disconnectDB = async () => {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
}

export default mongoose
