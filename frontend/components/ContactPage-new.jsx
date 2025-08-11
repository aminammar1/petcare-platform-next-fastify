'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import styles from '../Styles/ContactPage-responsive.module.css'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('/Reclamation', form)
      console.log(response.data.message)
      // Optionally, reset the form after successful submission
      setForm({
        name: '',
        email: '',
        message: '',
      })
    } catch (error) {
      console.error('Error saving reclamation data:', error)
      // Handle error (e.g., display an error message to the user)
    }
  }

  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <div className={styles.contactContent}>
          {/* Left Side - Contact Information */}
          <div className={styles.contactInfo}>
            <h1 className={styles.contactTitle}>Contact us</h1>
            
            <div className={styles.contactText}>
              Got a question before you buy? Try our{' '}
              <Link href="/faqs" className={styles.contactLink}>
                FAQs page
              </Link>{' '}
              for lots of product info. Need help with your PetPulse? Our Knowledge
              Base might have the answer.
            </div>
            
            <div className={styles.contactText}>
              If you'd like to talk with us, you can reach us by email, by phone
              (09:00–17:00 Monday–Saturday), or by post. Or just fill in the form on this page if you
              prefer.
            </div>

            <div className={styles.contactDetails}>
              <div className={styles.contactDetail}>
                <img
                  src="./image/enveloppe.png"
                  alt="Email"
                  className={styles.contactIcon}
                />
                <span className={styles.contactEmail}>Email: PetPulse@gmail.com</span>
              </div>
              
              <div className={styles.contactDetail}>
                <img
                  src="./image/location.png"
                  alt="Address"
                  className={styles.contactIcon}
                />
                <span className={styles.contactInfoText}>Address: Monastir 5000</span>
              </div>
              
              <div className={styles.contactDetail}>
                <img
                  src="./image/telephone.png"
                  alt="Phone"
                  className={styles.contactIcon}
                />
                <span className={styles.contactInfoText}>Phone: +216 12345678</span>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className={styles.contactFormContainer}>
            <div className={styles.contactForm}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>
                    Your message to us
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={styles.formSubmit}
                >
                  Send your message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
