import Chat from '../models/Chat.js'

export const getOrCreateChatRoom = async (room) => {
  let chat = await Chat.findOne({ room })
  if (!chat) {
    chat = await Chat.create({ room, messages: [] })
  }
  return chat.toObject()
}

export const addMessageToRoom = async (room, username, message) => {
  await Chat.updateOne(
    { room },
    {
      $push: {
        messages: {
          $each: [{ username, message, timestamp: new Date() }],
          $slice: -500,
        },
      },
    },
    { upsert: true }
  )
}
