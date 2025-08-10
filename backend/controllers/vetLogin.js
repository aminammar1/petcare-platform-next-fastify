import User from '../models/User.js'

export async function vetLogin(req, res) {
  try {
    // Get the email from the URL path parameters
    const email = req.params.email

    if (!email) {
      return res
        .code(400)
        .send({ success: false, message: 'Email is required', role: null })
    }

    const user = await User.findOne({ email }, { role: 1 }).lean()

    if (!user) {
      return res
        .code(404)
        .send({ success: false, message: 'User not found', role: null })
    }

    // Check if the user role is either "vet" or "user"
    if (user.role === 'vet') {
      return res.send({
        success: true,
        message: 'Access granted',
        role: user.role,
      })
    }
    return res
      .code(403)
      .send({ success: false, message: 'Access denied', role: user.role })
  } catch (error) {
    return res
      .code(500)
      .send({
        success: false,
        message: 'Failed to check user role',
        role: null,
      })
  }
}
