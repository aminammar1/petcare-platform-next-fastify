import ClaimVet from '../models/ClaimVet.js'

export async function getAllClaimVetData(req, res) {
  try {
    const claimVetData = await ClaimVet.find({}).lean()
    if (!claimVetData || claimVetData.length === 0) {
      return res
        .code(404)
        .send({
          success: false,
          message: 'No data found in Claim_vet collection',
        })
    }
    return res.send({ success: true, data: claimVetData })
  } catch (error) {
    return res
      .code(500)
      .send({
        success: false,
        message: 'Failed to retrieve data from Claim_vet collection',
      })
  }
}
