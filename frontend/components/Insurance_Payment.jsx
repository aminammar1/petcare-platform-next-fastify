'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { api } from '@/lib/api'
import styles from '../Styles/PaymentForm2.module.css'
import { toast, ToastContainer } from 'react-toastify' // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'

const InsurancePayment = () => {
  const [offerName, setOfferName] = useState('')
  const [offerImage, setOfferImage] = useState('')
  const [offerPrice, setOfferPrice] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const lsName = localStorage.getItem('offerName')
      const lsImage = localStorage.getItem('offerImage')
      const lsPrice = localStorage.getItem('offerPrice')
      const qName = params.get('offerName')
      const qImage = params.get('offerImage')
      const qPrice = params.get('offerPrice')
      setOfferName(qName || lsName || '')
      setOfferImage(qImage || lsImage || '')
      const price = qPrice || lsPrice
      setOfferPrice(price ? Number(price) : 0)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (!offerName || !offerPrice) {
        toast.error('Missing offer details. Please select an offer again.')
        return
      }
      const formData = {
        email: event.target.email.value,
        cardNumber: event.target['card-number'].value,
        expirationDate: event.target['expiration-date'].value,
        cvv: event.target.cvv.value,
        cardOwnerName: event.target['card-owner-name'].value,
        country: event.target.country.value,
        totalPrice: Number(offerPrice), // Ensure number per schema
        Offername: offerName, // Include the offer name here
      }
      const response = await api.post('/save_payment2', formData)
      console.log(response.data)
      toast.success('Payment successful!') // Fixed toast notification
      event.target.reset()
    } catch (error) {
      console.error('Error saving payment data:', error)
      if (error.response) {
        toast.error(
          error.response.data.message || 'Payment failed. Please try again.'
        ) // Display server error message if available
      } else {
        toast.error('Payment failed. Please try again.') // Display generic error message
      }
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.blurBackground}></div>
      <div className={styles.flexContainer}>
        <div className={styles.cartItemsContainer}>
          <Image
            src={'/image/petpulse.png'}
            alt="pp"
            className={styles.pp}
            width={160}
            height={40}
          />
          {offerImage ? (
            <Image
              src={offerImage}
              alt="Offer"
              className={styles.offerImage}
              width={280}
              height={280}
            />
          ) : null}
          <hr className={styles.horizontalLine} /> {/* Horizontal line */}
          <div>
            <h3>Offer: {offerName}</h3>
            <h4>Price: ${offerPrice}</h4> {/* Display offer price */}
          </div>
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
                    src={'/image/visa.png'}
                    alt="Visa"
                    className={styles.visa}
                    width={40}
                    height={24}
                  />
                  <Image
                    src={'/image/sans-contact.png'}
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
      <ToastContainer position="top-center" />{' '}
      {/* Set position as per your preference */}
    </div>
  )
}

export default InsurancePayment
