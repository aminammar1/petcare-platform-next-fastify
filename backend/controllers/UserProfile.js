import User from '../models/User.js'

export async function getUserInfo(req, res) {
  try {
    // Get the email from the URL path parameters
    const email = req.params.email

    if (!email) {
      return res
        .code(400)
        .send({ success: false, message: 'Email is required' })
    }

    const user = await User.findOne(
      { email },
      { firstName: 1, lastName: 1, email: 1 }
    ).lean()

    if (!user) {
      return res.code(404).send({ success: false, message: 'User not found' })
    }

    return res.send({ success: true, user })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to retrieve user data' })
  }
}
