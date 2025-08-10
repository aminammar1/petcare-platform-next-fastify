import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true },
    cardOwnerName: { type: String, required: true },
    country: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    Offername: { type: String },
    insuranceId: { type: String },
  },
  { timestamps: true }
)

const Offer = mongoose.model('Offer', offerSchema)
export default Offer
