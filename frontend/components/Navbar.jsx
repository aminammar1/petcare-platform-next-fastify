'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import styles from '../Styles/Nav.module.css'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useDispatch, useSelector } from 'react-redux'
import { setCartCount } from '@/store/slices/cartSlice'
import {
  setCredentials,
  logout as logoutAction,
} from '@/store/slices/authSlice'

export default function Navbar() {
  const router = useRouter()
  const [showLanguageOptions, setShowLanguageOptions] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [showMonitorImages, setShowMonitorImages] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const dispatch = useDispatch()
  const cartCount = useSelector((s) => s.cart.count)
  const email = useSelector((s) => s.auth.email)
  const [showInsuranceOptions, setShowInsuranceOptions] = useState(false)
  const [hoverTimer, setHoverTimer] = useState(null)
  const [scrollToButton, setScrollToButton] = useState(false)
  const [animateCartCount, setAnimateCartCount] = useState(false)

  // Hydrate auth from localStorage once on mount (client only)
  useEffect(() => {
    const savedEmail =
      typeof window !== 'undefined' ? localStorage.getItem('email') : null
    if (savedEmail) dispatch(setCredentials({ email: savedEmail }))
  }, [dispatch])

  // Fetch cart count on mount/login and when cart changes (no polling)
  useEffect(() => {
    if (!email) return
    fetchCartItemsCount()
    const onCartChanged = () => fetchCartItemsCount()
    if (typeof window !== 'undefined') {
      window.addEventListener('cart:changed', onCartChanged)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('cart:changed', onCartChanged)
      }
    }
  }, [email])

  useEffect(() => {
    if (scrollToButton) {
      const element = document.getElementById('remindMeButton')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      setScrollToButton(false)
    }
  }, [scrollToButton])

  useEffect(() => {
    if (animateCartCount) {
      const timer = setTimeout(() => {
        setAnimateCartCount(false)
      }, 1000) // Reset after 1 second
      return () => clearTimeout(timer)
    }
  }, [animateCartCount])

  const fetchCartItemsCount = async () => {
    try {
      const response = await api.get('/CartItemsCount')
      const { count } = response.data
      dispatch(setCartCount(count))
      // Only animate when the count actually changes
      setAnimateCartCount(count !== cartCount)
    } catch (error) {
      console.error('Error fetching cart items count:', error)
    }
  }

  const handleTrackersMouseEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
    setShowMonitorImages(true)
  }

  const handleTrackersMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowMonitorImages(false)
    }, 3000)
    setHoverTimer(timer)
  }

  const handleMonitorMouseEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
  }

  const handleMonitorMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowMonitorImages(false)
    }, 1000)
    setHoverTimer(timer)
  }

  const handleInsuranceMouseEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
    setShowInsuranceOptions(true)
  }

  const handleInsuranceMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowInsuranceOptions(false)
    }, 500)
    setHoverTimer(timer)
  }

  const handleInsuranceOptionMouseEnter = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      setHoverTimer(null)
    }
  }

  const handleInsuranceOptionMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowInsuranceOptions(false)
    }, 2000)
    setHoverTimer(timer)
  }

  const handleAlreadyInsuredClick = (e) => {
    e.preventDefault()
    router.push('/Insurance')
    setScrollToButton(true)
  }

  return (
    <div className={styles['background-image']}>
      <div className={styles.navbar}>
        <Image
          className={styles.pp}
          src="/image/pp90.png"
          alt="pp"
          width={90}
          height={90}
        />
        <Link href="/">
          <span>
            <Image
              className={styles.logo}
              src="/image/petpulse.png"
              alt="PetPulse Logo"
              width={160}
              height={40}
              priority
            />
          </span>
        </Link>
        <input
          type="checkbox"
          id="navToggle"
          className={styles.navToggle}
          aria-label="Toggle navigation"
        />
        <label
          htmlFor="navToggle"
          className={styles.burger}
          aria-label="Open menu"
          aria-controls="primary-navigation"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </label>

        <div id="primary-navigation" className={styles.middleLinks}>
          <div
            className={styles.trackersContainer}
            onMouseEnter={handleTrackersMouseEnter}
            onMouseLeave={handleTrackersMouseLeave}
          >
            <Link href="/Trackers" className={styles.navLink}>
              <span className={styles.linkText}>Trackers</span>
            </Link>
            {showMonitorImages && (
              <div className={styles.popupAngle}>
                <Link href="/tracker_plus">
                  <Image
                    className={`${styles.popupImageLeft} ${
                      isPulsing ? styles.pulse : ''
                    }`}
                    src="/image/monitorplus.png"
                    alt="Monitor Plus"
                    width={220}
                    height={220}
                    onMouseEnter={handleMonitorMouseEnter}
                    onMouseLeave={handleMonitorMouseLeave}
                  />
                </Link>
                <Link href="/tracker">
                  <Image
                    className={`${styles.popupImageRight} ${
                      isPulsing ? styles.pulse : ''
                    }`}
                    src="/image/monitor.png"
                    alt="Monitor"
                    width={220}
                    height={220}
                    onMouseEnter={handleMonitorMouseEnter}
                    onMouseLeave={handleMonitorMouseLeave}
                  />
                </Link>
              </div>
            )}
          </div>
          <div
            className={styles.insuranceContainer}
            onMouseEnter={handleInsuranceMouseEnter}
            onMouseLeave={handleInsuranceMouseLeave}
          >
            <Link href="/Insurance" className={styles.navLink}>
              <span className={styles.linkText}>Insurance</span>
            </Link>
            {showInsuranceOptions && (
              <div
                className={styles.popupInsurance}
                onMouseEnter={handleInsuranceOptionMouseEnter}
                onMouseLeave={handleInsuranceOptionMouseLeave}
              >
                <Link href="/Insurance" className={styles.insuranceOption}>
                  Find out more
                </Link>
                <Link
                  href="/already-insured"
                  className={styles.insuranceOption}
                  onClick={handleAlreadyInsuredClick}
                >
                  Already insured
                </Link>
                <Link href="/vetclaim" className={styles.insuranceOption}>
                  Veterinarian
                </Link>
              </div>
            )}
          </div>
          <Link href="/shop" className={styles.navLink}>
            <span className={styles.linkText}>Shop</span>
          </Link>
          <Link href="/FAQs" className={styles.navLink}>
            <span className={styles.linkText}>FAQs</span>
          </Link>
          <Link href="/contact" className={styles.navLink}>
            <span className={styles.linkText}>Contact Us</span>
          </Link>
        </div>
        <Link
          href="/IA"
          className={styles.languageContainer}
          aria-label="Dog AI"
        >
          <div className={styles.languageSelector}>
            <Image
              className={styles.languageIcon}
              src="/image/dog.png"
              alt="Dog AI"
              width={28}
              height={28}
            />
          </div>
        </Link>
        <Link href="/Cart" className={styles.cartImage} aria-label="Cart">
          <div className={styles.cartContainer}>
            <Image
              className={styles.cartImage}
              src="/image/bag.svg"
              alt="cart"
              width={28}
              height={28}
            />
            <span
              className={`${styles.cartItemCount} ${
                animateCartCount ? styles.greenBackground : ''
              }`}
            >
              {cartCount}
            </span>
          </div>
        </Link>
        <div className={styles.userContainer}>
          <Link
            href={email ? '/user-profile' : '/login'}
            className={styles.logolink}
          >
            <Image
              className={styles.signImage}
              src={email ? '/image/user.png' : '/image/box-arrow-in-left.svg'}
              alt="User Profile"
              width={28}
              height={28}
            />
          </Link>
        </div>
        <Image
          className={styles.pp2}
          src="/image/pp90.png"
          alt="pp2"
          width={90}
          height={90}
        />
      </div>
    </div>
  )
}
