import { useState, useCallback } from 'react'

const API_URL = '/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`)
  }
  return data
}

export function useQRCodes() {
  const [qrcodes, setQRCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const listQRCodes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/qrcodes`, {
        headers: authHeaders(),
      })
      const data = await handleResponse(response)
      const list = data.qrcodes || []
      setQRCodes(list)
      return list
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getQRCode = useCallback(async (id) => {
    const response = await fetch(`${API_URL}/qrcodes/${id}`, {
      headers: authHeaders(),
    })
    const data = await handleResponse(response)
    return data.qrcode
  }, [])

  const saveQRCode = useCallback(async (payload) => {
    const response = await fetch(`${API_URL}/qrcodes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await handleResponse(response)
    const created = data.qrcode
    setQRCodes((prev) => [created, ...prev])
    return created
  }, [])

  const updateQRCode = useCallback(async (id, updates) => {
    const response = await fetch(`${API_URL}/qrcodes/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates),
    })
    const data = await handleResponse(response)
    const updated = data.qrcode
    setQRCodes((prev) => prev.map((qr) => (qr.id === id ? updated : qr)))
    return updated
  }, [])

  const deleteQRCode = useCallback(async (id) => {
    const response = await fetch(`${API_URL}/qrcodes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    await handleResponse(response)
    setQRCodes((prev) => prev.filter((qr) => qr.id !== id))
  }, [])

  return {
    qrcodes,
    loading,
    error,
    listQRCodes,
    getQRCode,
    saveQRCode,
    updateQRCode,
    deleteQRCode,
  }
}
