'use client'

import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import styles from '../Styles/UserProfile.module.css'
import Link from 'next/link'

export default function User() {
  const [user, setUser] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [storedEmail, setStoredEmail] = useState(null)
  const [offerName, setOfferName] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      const email = localStorage.getItem('email')
      if (email) {
        setStoredEmail(email)
        try {
          const userInfoResponse = await api.get(
            `/user_info/${encodeURIComponent(email)}`
          )
          setUser(userInfoResponse.data.user)

          const userImageResponse = await api.get(
            `/user_image/${encodeURIComponent(email)}`
          )
          setProfileImage(userImageResponse.data.photo)

          const offerNameResponse = await api.get(
            `/offer_name/${encodeURIComponent(email)}`
          )
          setOfferName(offerNameResponse.data.offername || 'No insurance yet')
        } catch (error) {
          console.log(
            'Error fetching user information, image, or offer name:',
            error
          )
        }
      } else {
        console.log('Email parameter is missing')
      }
    }

    fetchUserInfo()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('email')
    window.location.href = '/login'
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const photo = e.target.result
        setProfileImage(photo)

        try {
          await api.post('/save_user_info', { email: storedEmail, photo })
          console.log('User information saved successfully')
        } catch (error) {
          console.log('Error saving user information:', error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/user/${encodeURIComponent(storedEmail)}`)
      localStorage.removeItem('email')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error deleting user account:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className={styles.profileContainer}>
        <h2 className={styles.titre}>User Profile</h2>
        {user ? (
          <>
            {profileImage && (
              <div className={styles.profileImageContainer}>
                <img
                  src={profileImage}
                  alt="Profile"
                  className={styles.profileImage}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.customFileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Select a photo
            </label>
            <div className={styles.userInfo}>
              <p>First Name: {user.firstName}</p>
              <hr className={styles.horizontalLine} />
              <p>Last Name: {user.lastName}</p>
              <hr className={styles.horizontalLine} />
              <p>Email: {user.email}</p>
              <div className={styles.offerBox}>
                <p>Insurance Type: {offerName}</p>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={handleLogout}
                className={`${styles.button} ${styles.logoutButton}`}
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete Account
              </button>
              <Link href="/chat">
                <button className={`${styles.button} ${styles.CHAT}`}>
                  Chat with vet
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  )
}
