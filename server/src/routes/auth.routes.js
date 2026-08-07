const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../db')
const { auth, signToken } = require('../middleware/auth')

const router = express.Router()

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const result = db
      .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
      .run(String(name).trim(), normalizedEmail, passwordHash)

    const user = db
      .prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid)

    const token = signToken(user)
    return res.status(201).json({ token, user: publicUser(user) })
  } catch (err) {
    console.error('register error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail)

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(String(password), user.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user)
    return res.json({ token, user: publicUser(user) })
  } catch (err) {
    console.error('login error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', auth, (req, res) => {
  return res.json({ user: publicUser(req.user) })
})

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body || {}

    const updates = {}
    if (name !== undefined) updates.name = String(name).trim()
    if (email !== undefined) updates.email = String(email).trim().toLowerCase()

    if (updates.email && updates.email !== req.user.email) {
      const existing = db
        .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .get(updates.email, req.user.id)
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' })
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.json({ user: publicUser(req.user) })
    }

    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(updates), new Date().toISOString(), req.user.id]

    db.prepare(`UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`).run(...values)

    const user = db
      .prepare('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?')
      .get(req.user.id)

    return res.json({ user: publicUser(user) })
  } catch (err) {
    console.error('profile error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' })
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }

    const stored = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id)
    const valid = await bcrypt.compare(String(currentPassword), stored.password_hash)
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 10)
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      passwordHash,
      new Date().toISOString(),
      req.user.id
    )

    return res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('password error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
