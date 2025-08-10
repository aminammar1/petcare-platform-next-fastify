import User from '../models/User.js'
import UserInfo from '../models/UserInfo.js'

export async function deleteUser(req, res) {
  try {
    const email = req.params.email

    if (!email) {
      return res
        .code(400)
        .send({ success: false, message: 'Email is required' })
    }

    const userDeleteResult = await User.deleteOne({ email })
    const userinfoDeleteResult = await UserInfo.deleteOne({ email })

    if (
      userDeleteResult.deletedCount === 0 &&
      userinfoDeleteResult.deletedCount === 0
    ) {
      return res.code(404).send({ success: false, message: 'User not found' })
    }

    return res.send({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to delete user' })
  }
}
