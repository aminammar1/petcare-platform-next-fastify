import mongoose from 'mongoose'

const claimVetSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    insuranceNumber: String,
    petName: String,
    petGender: String,
    dob: String,
    country: String,
    fullAddress: String,
    issue: String,
  },
  { timestamps: true }
)

const ClaimVet = mongoose.model('ClaimVet', claimVetSchema)
export default ClaimVet
