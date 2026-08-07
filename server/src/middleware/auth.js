const jwt = require('jsonwebtoken')
const db = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'qr-generator-dev-secret-change-in-production'

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db
      .prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(payload.id)

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { auth, signToken, JWT_SECRET }
