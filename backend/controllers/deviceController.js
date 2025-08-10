import Payment from '../models/Payment.js'

export async function checkDeviceId(req, res) {
  try {
    const { deviceId } = req.body

    if (!deviceId) {
      return res
        .code(400)
        .send({ success: false, message: 'Device ID is required' })
    }

    const device = await Payment.findOne({
      deviceId: parseInt(deviceId),
    }).lean()

    if (device) {
      return res.send({ success: true, message: 'Device ID is valid' })
    } else {
      return res
        .code(404)
        .send({ success: false, message: 'Device ID not found' })
    }
  } catch (error) {
    console.error('Error checking device ID:', error)
    return res
      .code(500)
      .send({ success: false, message: 'Failed to check device ID' })
  }
}
