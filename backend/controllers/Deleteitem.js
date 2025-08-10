import CartItem from '../models/CartItem.js'

export async function deleteCartItem(req, res) {
  try {
    const { id } = req.params
    const result = await CartItem.deleteOne({ _id: id })
    if (result.deletedCount > 0)
      return res.send({ success: true, message: 'Item deleted successfully' })
    return res.code(404).send({ success: false, message: 'Item not found' })
  } catch (error) {
    return res
      .code(500)
      .send({ success: false, message: 'Failed to delete item from cart' })
  }
}
