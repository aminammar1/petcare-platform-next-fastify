'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/purches_insurance.module.css' // Ensure the path is correct
import Link from 'next/link'

export default function Purches() {
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Do not clear offer data on unmount; it is needed by /insurance_payment

  const handleBuyNow = (offerName, offerImage, offerPrice) => {
    // Include offerPrice parameter
    console.log('Buy now clicked:', offerName, offerImage, offerPrice)
    // Save offer details in local storage
    localStorage.setItem('offerName', offerName)
    localStorage.setItem('offerImage', offerImage)
    localStorage.setItem('offerPrice', offerPrice) // Save offer price
    setSelectedOffer({ offerName, offerImage })
    console.log('Offer details saved:', offerName, offerImage, offerPrice)
  }

  return (
    <div className={styles.Maincontainer}>
      <div className={styles.offersContainer}>
        <div className={styles.container1}>
          <Image
            src="/image/t1.png"
            alt="tab"
            className={styles.tabImage}
            width={400}
            height={250}
          />
          <Link
            href={{
              pathname: '/insurance_payment',
              query: {
                offerName: 'SHARE',
                offerImage: '/image/t1.png',
                offerPrice: 199,
              },
            }}
          >
            <button
              onClick={() => handleBuyNow('SHARE', '/image/t1.png', 199)}
              className={styles.signInButton}
            >
              BUY NOW
            </button>
          </Link>
        </div>
        <div className={styles.container1}>
          <Image
            src="/image/t2.png"
            alt="tab"
            className={styles.tabImage}
            width={400}
            height={250}
          />
          <Link
            href={{
              pathname: '/insurance_payment',
              query: {
                offerName: 'CARE',
                offerImage: '/image/t2.png',
                offerPrice: 299,
              },
            }}
          >
            <button
              onClick={() => handleBuyNow('CARE', '/image/t2.png', 299)}
              className={styles.signInButton}
            >
              BUY NOW
            </button>
          </Link>
        </div>
      </div>
      <h1 className={styles.captcha}>choose your offer!</h1>
      {/* You can render any component based on selectedOffer if needed */}
    </div>
  )
}
