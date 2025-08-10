import UserInfo from '../models/UserInfo.js'

export async function getUserImage(req, res) {
  try {
    const email = req.params.email

    if (!email) {
      return res
        .code(400)
        .send({ success: false, message: 'Email is required' })
    }

    const user = await UserInfo.findOne({ email }, { photo: 1, _id: 0 }).lean()

    if (!user || !user.photo) {
      return res
        .code(404)
        .send({ success: false, message: 'User image not found' })
    }

    return res.send({ success: true, photo: user.photo })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to retrieve user image' })
  }
}
