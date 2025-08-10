import Payment from '../models/Payment.js'
import { sendConfirmationEmail } from './emailService.js'

function generateRandomDeviceId() {
  return Math.floor(1000000000 + Math.random() * 9000000000) // Generate a random 10-digit number
}

async function savePayment(req, res) {
  try {
    const {
      email,
      cardNumber,
      expirationDate,
      cvv,
      cardOwnerName,
      country,
      totalPrice,
    } = req.body

    const deviceId = generateRandomDeviceId() // Generate random numeric device ID

    await Payment.create({
      email,
      cardNumber,
      expirationDate,
      cvv,
      cardOwnerName,
      country,
      totalPrice,
      deviceId,
    })

    await sendConfirmationEmail(email, totalPrice, deviceId) // Send email with device ID

    return res.send({
      success: true,
      message: 'Payment data saved and confirmation email sent successfully',
    })
  } catch (error) {
    console.error('Error saving payment data:', error)
    return res
      .code(500)
      .send({ success: false, message: 'Failed to save payment data' })
  }
}

export { savePayment }
