import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
    {
    itemName: { type: String, required: true },
    },
    { timestamps: true }
)

const CartItem =  mongoose.model('CartItem', cartItemSchema)
export default CartItem
