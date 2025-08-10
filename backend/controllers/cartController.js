import CartItem from '../models/CartItem.js'

export async function retrieveCartIems(req, res) {
  try {
    const items = await CartItem.find({}).lean()
    return res.send({ success: true, items })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to fetch cart items' })
  }
}
