import Reminder from '../models/Reminder.js'

export async function saveReminder(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      renewalMonth,
      currentInsurance,
      country,
    } = req.body
    await Reminder.create({
      firstName,
      lastName,
      email,
      phone,
      renewalMonth,
      currentInsurance,
      country,
    })
    return res.send({
      success: true,
      message: 'Reminder data saved successfully',
    })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to save reminder data' })
  }
}
