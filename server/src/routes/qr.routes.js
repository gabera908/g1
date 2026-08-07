const express = require('express')
const crypto = require('crypto')
const db = require('../db')
const { auth } = require('../middleware/auth')

const router = express.Router()

function generateShortId() {
  return crypto.randomBytes(6).toString('base64url')
}

function publicQr(qr) {
  return {
    id: qr.id,
    type: qr.type,
    name: qr.name,
    content: qr.content,
    design: qr.design ? JSON.parse(qr.design) : null,
    shortId: qr.short_id,
    createdAt: qr.created_at,
    updatedAt: qr.updated_at,
  }
}

router.get('/', auth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM qrcodes WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
  return res.json({ qrcodes: rows.map(publicQr) })
})

router.post('/', auth, (req, res) => {
  try {
    const { type, name, content, design } = req.body || {}

    if (!type || !name || !content) {
      return res.status(400).json({ message: 'Type, name and content are required' })
    }

    let designJson = null
    if (design) {
      designJson = typeof design === 'string' ? design : JSON.stringify(design)
    }

    let shortId = generateShortId()
    while (db.prepare('SELECT id FROM qrcodes WHERE short_id = ?').get(shortId)) {
      shortId = generateShortId()
    }

    const result = db
      .prepare(
        'INSERT INTO qrcodes (user_id, type, name, content, design, short_id) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(req.user.id, String(type), String(name), String(content), designJson, shortId)

    const qr = db
      .prepare('SELECT * FROM qrcodes WHERE id = ?')
      .get(result.lastInsertRowid)

    return res.status(201).json({ qrcode: publicQr(qr) })
  } catch (err) {
    console.error('create qr error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', auth, (req, res) => {
  const qr = db
    .prepare('SELECT * FROM qrcodes WHERE id = ? AND user_id = ?')
    .get(Number(req.params.id), req.user.id)

  if (!qr) {
    return res.status(404).json({ message: 'QR code not found' })
  }

  return res.json({ qrcode: publicQr(qr) })
})

router.put('/:id', auth, (req, res) => {
  try {
    const { type, name, content, design } = req.body || {}
    const qr = db
      .prepare('SELECT * FROM qrcodes WHERE id = ? AND user_id = ?')
      .get(Number(req.params.id), req.user.id)

    if (!qr) {
      return res.status(404).json({ message: 'QR code not found' })
    }

    const updates = {}
    if (type !== undefined) updates.type = String(type)
    if (name !== undefined) updates.name = String(name)
    if (content !== undefined) updates.content = String(content)
    if (design !== undefined) {
      updates.design = typeof design === 'string' ? design : JSON.stringify(design)
    }

    if (Object.keys(updates).length > 0) {
      const setClause = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ')
      const values = [...Object.values(updates), new Date().toISOString(), qr.id]
      db.prepare(`UPDATE qrcodes SET ${setClause}, updated_at = ? WHERE id = ?`).run(...values)
    }

    const updated = db.prepare('SELECT * FROM qrcodes WHERE id = ?').get(qr.id)
    return res.json({ qrcode: publicQr(updated) })
  } catch (err) {
    console.error('update qr error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, (req, res) => {
  const result = db
    .prepare('DELETE FROM qrcodes WHERE id = ? AND user_id = ?')
    .run(Number(req.params.id), req.user.id)

  if (result.changes === 0) {
    return res.status(404).json({ message: 'QR code not found' })
  }

  return res.json({ message: 'QR code deleted' })
})

module.exports = router
