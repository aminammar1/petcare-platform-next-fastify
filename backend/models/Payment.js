import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true },
    cardOwnerName: { type: String, required: true },
    country: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    deviceId: { type: Number },
  },
  { timestamps: true }
)

const Payment = mongoose.model('Payment', paymentSchema)
export default Payment
