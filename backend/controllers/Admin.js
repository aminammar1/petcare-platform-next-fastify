import User from '../models/User.js'

export async function A_page(req, res) {
  const users = await User.find({}, { password: 0 }).lean()
  if (!users.length)
    return res.code(404).send({ success: false, message: 'No users found' })
  return res.send({ success: true, users })
}
