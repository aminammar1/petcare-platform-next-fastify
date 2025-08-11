'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'
import Link from 'next/link'
import styles from '../Styles/cart.module.css'
import productsData from '../app/products'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const response = await api.get('/cart_items')
      setCartItems(response.data.items)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const handlePurchase = (itemName) => {
    window.location.href = `/purchase?item=${encodeURIComponent(itemName)}`
  }

  const handleDelete = async (itemId) => {
    try {
      if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error('Invalid ID format:', itemId)
        return
      }
      await api.delete(`/cart_deleted/${itemId}`)
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      )
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart:changed'))
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const findItemPrice = (itemName) => {
    const product = productsData.find(
      (product) => product.name.toLowerCase() === itemName.toLowerCase()
    )
    return product ? product.price : 0
  }

  const getImage = (itemName) => {
    switch (itemName) {
      case 'Tracker':
        return '/image/monitor.png'
      case 'Tracker_plus':
        return '/image/monitorplus.png'
      case 'Strap':
        return '/image/streatche1.png'
      case 'CR1632 battery':
        return '/image/pille1.png'
      case 'CR2032 battery':
        return '/image/pille2.png'
      case 'Charging pad':
        return '/image/pp.6.gif'
      default:
        return '/image/default.png' // A default image for unknown items
    }
  }

  const consolidateItems = () => {
    const consolidatedItems = []
    cartItems.forEach((item) => {
      const existingItem = consolidatedItems.find(
        (ci) => ci.itemName === item.itemName
      )
      if (existingItem) {
        existingItem.quantity++
      } else {
        consolidatedItems.push({ ...item, quantity: 1 })
      }
    })
    return consolidatedItems
  }

  const calculateTotalPrice = (items) => {
    return items
      .reduce((total, item) => {
        const price = findItemPrice(item.itemName)
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  const consolidatedItems = consolidateItems()
  const totalPrice = calculateTotalPrice(consolidatedItems)

  return (
    <div className={`${styles.bg} px-4 sm:px-6 lg:px-8`}>
      <h1>Cart Items:</h1>
      {consolidatedItems.map((item, index) => (
        <div key={index} className={styles.cartItem}>
          <Image
            src={getImage(item.itemName)}
            alt={item.itemName}
            className={styles.itemImage}
            width={90}
            height={90}
            quality={100}
          />
          <div className={styles.itemDetails}>
            <p>{item.itemName}</p>
            <p>Price: ${findItemPrice(item.itemName)}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
          <button
            className={styles.redDeleteButton}
            onClick={() => handleDelete(item._id)}
          >
            Delete
          </button>
        </div>
      ))}

      <div className={styles.totalPriceContainer}>
        <p>Total Price: ${totalPrice}</p>
        <Link href="/paymentform">
          <button className={styles.purchaseButton}>Purchase</button>
        </Link>
      </div>
    </div>
  )
}
