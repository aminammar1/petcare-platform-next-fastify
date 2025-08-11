'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import products from '../app/products'
import styles from '../Styles/Strap.module.css'
import { api } from '@/lib/api'

const Tracker = () => {
  const [cartItems, setCartItems] = useState([])
  const [rating, setRating] = useState(0)

  // Retrieve the Tracker product from the products array
  const trackerProduct = products.find((product) => product.slug === 'strap')

  // State for tracking the quantity
  const [quantity, setQuantity] = useState(1)

  // Check if trackerProduct exists before accessing its properties
  if (!trackerProduct) {
    return <div>Product not found</div>
  }
  const totalPrice = trackerProduct.price * quantity

  // Handler for increasing quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  // Handler for decreasing quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  const addToCart = (itemName, quantity) => {
    console.log(`Adding to cart: ${itemName}, Quantity: ${quantity}`)

    const itemsToAdd = Array.from({ length: quantity }, () => itemName)
    setCartItems((prevItems) => [...prevItems, ...itemsToAdd])

    api
      .post('/add_to_card', { itemName, quantity })
      .then((response) => {
        console.log(response.data.message)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:changed'))
        }
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error)
      })
  }

  const handleRatingChange = (value) => {
    setRating(value)
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.image}>
          <Image
            src={trackerProduct.imageUrl}
            alt={trackerProduct.name}
            width={500}
            height={500}
            className={styles.productImage}
            sizes="(max-width: 768px) 100vw, 500px"
            quality={100}
            priority
          />
        </div>
        <div className={styles.details}>
          <h1>{trackerProduct.name}</h1>
          <div className={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={
                  index < rating ? styles.filledStar : styles.emptyStar
                }
                onClick={() => handleRatingChange(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <p className={styles.additional_text}>
            Replacement VELCRO® Brand straps for PetPulse Dog GPS Tracker.
            <br />
            Strap width 32mm.
            <br />
            Includes 4 x standard length straps (110mm).
          </p>
          <p>Category: {trackerProduct.categoryName}</p>
          <p>Total Price: ${totalPrice}</p>
          {/* Add more details as needed */}
          <div className={styles.counter}>
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
          <button
            className={styles.button}
            onClick={() => addToCart('Strap', quantity)}
          >
            Add to Cart
          </button>
          {/* Include the payment image */}
          <Image
            src={'/image/paimentcollection.png'}
            alt="Accepted Payment Methods"
            width={600}
            height={100}
            className={styles.paymentImage}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      </div>
    </div>
  )
}

export default Tracker
