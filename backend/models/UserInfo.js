import mongoose from 'mongoose'

const userInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    photo: { type: String },
  },
  { timestamps: true }
)

const UserInfo = mongoose.model('UserInfo', userInfoSchema)
export default UserInfo
