import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    renewalMonth: String,
    currentInsurance: String,
    country: String,
  },
  { timestamps: true }
)

const Reminder = mongoose.model('Reminder', reminderSchema)
export default Reminder
