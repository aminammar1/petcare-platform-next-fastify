'use client'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../Styles/SignUp.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const schema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string()
    .email('Must be a valid e-mail')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters minimum')
    .required('Password is required'),
  role: Yup.string().required('Role is required'), // Added role validation
})

export default function SIGN() {
  const [formError, setFormError] = useState({})

  const googleAuth = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    window.open(`${base}/auth/google/callback`, '_self')
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', data)
      console.log(response.data)
      toast.success('Sign up successful!', { position: 'top-center' })
    } catch (error) {
      console.error('There is an error', error)
      toast.error('Account already exists. Please try again.', {
        position: 'top-center',
      })
      setFormError(error.response?.data?.errors || {})
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Ready to join us?</h1>
      <div
        className={`${styles.form_container} ${
          Object.keys(formError).length > 0 ? styles.error : ''
        }`}
      >
        <div className={styles.left}>
          <Image
            className={styles.img}
            src="/image/16.png"
            alt="signup"
            width={400}
            height={500}
          />
        </div>
        <div className={styles.right}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            noValidate=""
          >
            <h2 className={styles.from_heading}>Create Account</h2>
            <input
              type="text"
              className={`${styles.input} ${
                formError.firstName ? styles.error : ''
              }`}
              placeholder="First Name"
              {...register('firstName')}
            />
            <div className={styles.error_message}>
              {formError.firstName || errors.firstName?.message}
            </div>

            <input
              type="text"
              className={`${styles.input} ${
                formError.lastName ? styles.error : ''
              }`}
              placeholder="Last Name"
              {...register('lastName')}
            />
            <div className={styles.error_message}>
              {formError.lastName || errors.lastName?.message}
            </div>

            <input
              type="email"
              className={`${styles.input} ${
                formError.email ? styles.error : ''
              }`}
              placeholder="Email"
              {...register('email')}
            />
            <div className={styles.error_message}>
              {formError.email || errors.email?.message}
            </div>

            <input
              type="password"
              className={`${styles.input} ${
                formError.password ? styles.error : ''
              }`}
              placeholder="Password"
              {...register('password')}
            />
            <div className={styles.error_message}>
              {formError.password || errors.password?.message}
            </div>

            <div className={styles.radio_group}>
              <label>
                <input type="radio" value="user" {...register('role')} />
                User
              </label>
              <label>
                <input type="radio" value="vet" {...register('role')} />
                Vet
              </label>
            </div>
            <div className={styles.error_message}>
              {formError.role || errors.role?.message}
            </div>

            <button className={styles.btn} type="submit">
              Sign Up
            </button>
          </form>

          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <Image
              src="/image/google.png"
              alt="google icon"
              width={30}
              height={30}
            />
            <span>Sing in with Google</span>
          </button>
          <p className={styles.text}>
            Already Have Account? <Link href="/login">Log In</Link>
          </p>
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  )
}
