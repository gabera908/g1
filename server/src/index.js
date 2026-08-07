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

const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
