import Offer from '../models/Offer.js'
import {
  sendInsuranceConfirmationEmail,
  generateInsuranceId,
} from './insuranceEmailService.js'

async function savePayment2(req, res) {
  try {
    const {
      email,
      cardNumber,
      expirationDate,
      cvv,
      cardOwnerName,
      country,
      totalPrice,
      Offername,
    } = req.body

    // Generate an insurance ID
    const insuranceId = generateInsuranceId()

    // Save payment data to the database
    await Offer.create({
      email,
      cardNumber,
      expirationDate,
      cvv,
      cardOwnerName,
      country,
      totalPrice,
      Offername, // Include offer name in the payment data
      insuranceId, // Include insurance ID in the payment data
    })

    // Send confirmation email
    await sendInsuranceConfirmationEmail(
      email,
      totalPrice,
      insuranceId,
      Offername
    )

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

export { savePayment2 }
