import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import User from '../models/User.js'

export const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body || {}
  if (!firstName || !lastName || !email || !password || !role) {
    return res.code(400).send({ message: 'All fields are required' })
  }
  const existing = await User.findOne({ email })
  if (existing) return res.code(409).send({ message: 'User already exists' })
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  })
  return res.code(201).send({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.code(400).send({ message: 'All fields are required' })
  }
  const user = await User.findOne({ email })
  if (!user) return res.code(401).send({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.code(401).send({ message: 'Invalid credentials' })
  const payload = { sub: user.id, role: user.role }
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })
  // Refresh token cookie
  res.setCookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  // Access token cookie (used by auth middleware)
  res.setCookie('access', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 15 * 60,
  })
  return res.send({ message: 'success login', email: user.email })
}

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.jwt
  if (!refreshToken) return res.code(401).send({ message: 'Unauthorized' })
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const accessToken = jwt.sign(
      { sub: decoded.sub, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )
    // Rotate access cookie
    res.setCookie('access', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 15 * 60,
    })
    return res.send({ message: 'access token refreshed' })
  } catch {
    return res.code(403).send({ message: 'Forbidden' })
  }
}

export const logout = (req, res) => {
  const hasRefresh = Boolean(req.cookies?.jwt)
  const hasAccess = Boolean(req.cookies?.access)
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  })
  res.clearCookie('access', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  })
  if (!hasRefresh && !hasAccess) return res.code(204).send()
  return res.send({ message: 'success log out from the account' })
}

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

const emailPET = process.env.EMAIL_USER
const pw = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'zoho',
  auth: {
    user: emailPET,
    pass: pw,
  },
})

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .code(400)
      .send({ message: 'Email is required for password reset' })
  }

  try {
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res
        .code(404)
        .send({ message: 'User not found with the provided email' })
    }

    const resetCode = generateRandomCode()
    const hashedCode = await bcrypt.hash(resetCode.toString(), 10)

    foundUser.resetPasswordCode = hashedCode
    foundUser.resetPasswordExpires = new Date(Date.now() + 3600000)

    try {
      const info = await transporter.sendMail({
        from: `petpulse ${emailPET}`,
        to: email,
        subject: 'Reset Password', // Subject line
        text: 'Hello World', // plain text body
        html: `<b>Reset code: ${resetCode} </b>`, // html body
      })
      console.log('Message sent: %s', info.messageId)
    } catch (error) {
      console.error('Error sending mail', error)
    }

    await foundUser.save()

    res.send({
      message:
        'Reset code generated successfully. Use this code to reset your password.',
      resetCode,
    })
  } catch (error) {
    console.error('Error generating reset code:', error)
    return res.code(500).send({ message: 'Internal Server Error' })
  }
}

export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body

  if (!email || !resetCode || !newPassword) {
    return res.code(400).send({
      message:
        'Email, resetCode, and newPassword are required for password reset',
    })
  }

  try {
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res
        .code(404)
        .send({ message: 'User not found with the provided email' })
    }

    const isValidCode = await bcrypt.compare(
      resetCode.toString(),
      foundUser.resetPasswordCode
    )

    if (!isValidCode || Date.now() > foundUser.resetPasswordExpires) {
      return res.code(401).send({ message: 'Invalid or expired reset code' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    foundUser.password = hashedPassword

    foundUser.password = hashedPassword
    foundUser.resetPasswordCode = undefined
    foundUser.resetPasswordExpires = undefined
    await foundUser.save()

    res.send({ message: 'Password reset successful' })
  } catch (error) {
    console.error('Error resetting password:', error)
    return res.code(500).send({ message: 'Internal Server Error' })
  }
}
