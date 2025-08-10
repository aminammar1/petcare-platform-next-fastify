import mongoose from 'mongoose'

const reclamationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

const Reclamation = mongoose.model('Reclamation', reclamationSchema)
export default Reclamation
