import ClaimVet from '../models/ClaimVet.js'

export async function saveClaim(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      insuranceNumber,
      petName,
      petGender,
      dob,
      country,
      fullAddress,
      issue,
    } = req.body
    await ClaimVet.create({
      firstName,
      lastName,
      email,
      phone,
      insuranceNumber,
      petName,
      petGender,
      dob,
      country,
      fullAddress,
      issue,
    })
    return res.send({ success: true, message: 'Claim data saved successfully' })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to save claim data' })
  }
}
