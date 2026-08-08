const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const qrRoutes = require('./routes/qr.routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/qrcodes', qrRoutes)

// Dynamic QR code redirect & scan logger
app.get('/r/:shortId', (req, res) => {
  try {
    const { shortId } = req.params
    const db = require('./db')
    const qr = db.prepare('SELECT * FROM qrcodes WHERE short_id = ?').get(shortId)

    if (!qr) {
      return res.status(404).send('QR code not found')
    }

    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
      const userAgent = req.headers['user-agent'] || ''
      const referrer = req.headers['referer'] || req.headers['referrer'] || ''
      db.prepare(
        'INSERT INTO scan_logs (qrcode_id, ip, user_agent, referrer) VALUES (?, ?, ?, ?)'
      ).run(qr.id, String(ip), String(userAgent), String(referrer))
    } catch (logErr) {
      console.error('Scan logging error:', logErr)
    }

    let target = qr.content
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'http://' + target
    }
    return res.redirect(302, target)
  } catch (err) {
    console.error('Redirect error:', err)
    return res.status(500).send('Server error')
  }
})

const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/r/')) return next()
    return res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use((req, res) => {
  return res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error('server error:', err)
  return res.status(500).json({ message: 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
})
