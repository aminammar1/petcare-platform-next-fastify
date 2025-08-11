'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'
import styles from '../Styles/PaymentForm.module.css'
import productsData from '../app/products'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PaymentForm = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState('0.00')

  const fetchCartItems = async () => {
    try {
      const response = await api.get('/cart_items')
      setCartItems(response.data.items || [])
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  useEffect(() => {
    fetchCartItems()
    // Refresh when cart changes elsewhere
    const onCartChanged = () => fetchCartItems()
    if (typeof window !== 'undefined') {
      window.addEventListener('cart:changed', onCartChanged)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cart:changed', onCartChanged)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTotalPrice(calculateTotalPrice())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems])

  const findItemPrice = (itemName) => {
    const adjustedItemName = String(itemName || '').toLowerCase()
    const product = productsData.find((p) =>
      p.name.toLowerCase().includes(adjustedItemName)
    )
    return product ? product.price : 0
  }

  const getImage = (itemName) => {
    const imageMap = {
      Tracker: '/image/monitor.png',
      Tracker_plus: '/image/monitorplus.png',
      Strap: '/image/streatche1.png',
      'CR1632 battery': '/image/pille1.png',
      'CR2032 battery': '/image/pille2.png',
      'Charging pad': '/image/pp.6.gif',
    }
    return imageMap[itemName] || null
  }

  const consolidateItems = () => {
    const consolidated = []
    cartItems.forEach((item) => {
      const existing = consolidated.find((ci) => ci.itemName === item.itemName)
      if (existing) {
        existing.quantity += 1
      } else {
        consolidated.push({ itemName: item.itemName, quantity: 1 })
      }
    })
    return consolidated
  }

  const calculateTotalPrice = () => {
    let total = 0
    const consolidatedCartItems = consolidateItems()
    consolidatedCartItems.forEach((item) => {
      const price = parseFloat(findItemPrice(item.itemName))
      if (!isNaN(price)) {
        total += price * item.quantity
      }
    })
    return total.toFixed(2)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        email: event.target.email.value,
        cardNumber: event.target['card-number'].value,
        expirationDate: event.target['expiration-date'].value,
        cvv: event.target.cvv.value,
        cardOwnerName: event.target['card-owner-name'].value,
        country: event.target.country.value,
        totalPrice: Number(totalPrice),
      }
      await api.post('/save_payment', formData)
      toast.success('Payment successful!', { position: 'top-center' })
      event.target.reset()
    } catch (error) {
      console.error('Error saving payment data:', error)
      toast.error('Payment failed. Please try again.', {
        position: 'top-center',
      })
    }
  }

  const consolidatedCartItems = consolidateItems()

  return (
    <div className={styles.mainContainer}>
      <div className={styles.blurBackground}></div>
      <div className={styles.flexContainer}>
        <div className={styles.cartItemsContainer}>
          <Image
            src="/image/petpulse.png"
            alt="PetPulse"
            className={styles.pp}
            width={160}
            height={40}
            priority
          />
          <h3>Cart Items:</h3>
          {consolidatedCartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {consolidatedCartItems.map((item, index) => (
                <li key={index} className={styles.productItem}>
                  <div className={styles.productContainer}>
                    {getImage(item.itemName) ? (
                      <Image
                        src={getImage(item.itemName)}
                        alt={item.itemName}
                        className={styles.cartItemImage}
                        width={90}
                        height={90}
                        quality={100}
                      />
                    ) : null}
                    <div className={styles.productDetails}>
                      <p className={styles.productName}>{item.itemName}</p>
                      <p className={styles.productQuantity}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className={styles.productPrice}>
                    ${findItemPrice(item.itemName)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.totalPrice}>Total Price: ${totalPrice}</div>
        </div>
        <div className={styles.paymentFormContainer}>
          <div className={styles.paymentForm}>
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                aria-label="Email"
              />

              <label htmlFor="card-info">Card Information</label>
              <div id="card-info" className={styles.cardInfo}>
                <input
                  type="text"
                  id="card-number"
                  name="card-number"
                  pattern="\d{8}"
                  title="Card number must be 8 digits"
                  placeholder="Card Number"
                  required
                  aria-label="Card Number"
                />
                <div className={styles.cardIcons}>
                  <Image
                    src="/image/visa.png"
                    alt="Visa"
                    className={styles.visa}
                    width={40}
                    height={24}
                  />
                  <Image
                    src="/image/sans-contact.png"
                    alt="Contactless Payment"
                    className={styles.sans_contact}
                    width={24}
                    height={24}
                  />
                </div>
                <div className={styles.splitFields}>
                  <input
                    type="text"
                    id="expiration-date"
                    name="expiration-date"
                    placeholder="Expiration Date (MM/YY or MM/YYYY)"
                    required
                    pattern="^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$"
                    title="Expiration Date must be in the format MM/YY or MM/YYYY"
                    aria-label="Expiration Date"
                    inputMode="numeric"
                    maxLength={7}
                  />
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="CVV"
                    pattern="\d{3}"
                    required
                    aria-label="CVV"
                  />
                </div>
              </div>

              <label htmlFor="card-owner-name">Card Owner Name</label>
              <input
                type="text"
                id="card-owner-name"
                name="card-owner-name"
                required
                aria-label="Card Owner Name"
              />

              <label htmlFor="country">Country</label>
              <select id="country" name="country" required aria-label="Country">
                <option value="" disabled>
                  Select Country
                </option>
                <option value="Tunisia">Tunisia</option>
              </select>

              <div className={styles.submitContainer}>
                <button type="submit" className={styles.submitButton}>
                  Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default PaymentForm
