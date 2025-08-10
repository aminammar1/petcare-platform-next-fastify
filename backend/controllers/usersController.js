import User from '../models/User.js'

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).lean()
    if (!users.length) return res.code(404).send({ message: 'No users found' })
    return res.send({ requestedBy: req.userId || null, users })
  } catch (error) {
    return res.code(500).send({ message: 'Internal Server Error' })
  }
}
