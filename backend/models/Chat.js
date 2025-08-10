import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const chatSchema = new mongoose.Schema(
  {
    room: { type: String, unique: true, index: true },
    messages: [messageSchema],
  },
  { timestamps: true }
)

const Chat = mongoose.model('Chat', chatSchema)
export default Chat
