import Offer from '../models/Offer.js'

export async function getOfferName(req, res) {
  try {
    const email = req.params.email

    if (!email) {
      return res
        .code(400)
        .send({ success: false, message: 'Email is required' })
    }

    const offer = await Offer.findOne(
      { email },
      { Offername: 1, _id: 0 }
    ).lean()

    if (!offer) {
      return res.code(404).send({ success: false, message: 'Offer not found' })
    }

    return res.send({ success: true, offername: offer.Offername })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to retrieve offer name' })
  }
}
