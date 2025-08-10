import CartItem from '../models/CartItem.js'

export async function getCartItemsCount(req, res) {
  try {
    const count = await CartItem.countDocuments()
    return res.send({ count })
  } catch (error) {
    return res.code(500).send({ error: 'Internal server error' })
  }
}
