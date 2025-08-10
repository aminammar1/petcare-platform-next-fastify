import UserInfo from '../models/UserInfo.js'

export async function saveUserInfo(req, res) {
  try {
    // Destructure email and photo from the request body
    const { email, photo } = req.body

    if (!email || !photo) {
      return res
        .code(400)
        .send({ success: false, message: 'Email and photo URL are required' })
    }

    await UserInfo.create({ email, photo })
    return res
      .code(201)
      .send({ success: true, message: 'User information saved successfully' })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to save user information' })
  }
}
