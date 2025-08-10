import Reclamation from '../models/Reclamation.js'

export async function saveReclamation(req, res) {
  try {
    const { email, message } = req.body
    await Reclamation.create({ email, message })
    return res.send({
      success: true,
      message: 'Reclamation data saved successfully',
    })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to save reclamation data' })
  }
}
