import CartItem from '../models/CartItem.js'

export async function addToCart(req, res) {
  try {
    const { itemName, quantity = 1 } = req.body || {}
    if (!itemName || quantity < 1)
      return res.code(400).send({ success: false, message: 'Invalid payload' })
    const docs = Array.from({ length: quantity }, () => ({ itemName }))
    await CartItem.insertMany(docs)
    return res.send({
      success: true,
      message: `${quantity} ${itemName}(s) added to cart successfully`,
    })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to add item to cart' })
  }
}
