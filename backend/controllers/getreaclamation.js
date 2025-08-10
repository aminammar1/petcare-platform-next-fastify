import Reclamation from '../models/Reclamation.js'

export async function getReclamations(req, res) {
  try {
    const reclamations = await Reclamation.find({}).lean()
    return res.send({ success: true, data: reclamations })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to get reclamation data' })
  }
}
