import { useState, useCallback, useEffect } from 'react'
import QRCode from 'qrcode'

export function useQRCode() {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [svgString, setSvgString] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateQR = useCallback(async (content, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const defaultOptions = {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
        ...options,
      }

      const [dataUrl, svg] = await Promise.all([
        QRCode.toDataURL(content, defaultOptions),
        QRCode.toString(content, { ...defaultOptions, type: 'svg' }),
      ])

      setQrDataUrl(dataUrl)
      setSvgString(svg)
      return { dataUrl, svg }
    } catch (err) {
      setError(err.message)
      return { dataUrl: null, svg: null }
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadQR = useCallback((format = 'png', size = 512) => {
    if (!qrDataUrl && !svgString) return

    if (format === 'svg' && svgString) {
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-code.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } else if (qrDataUrl) {
      const a = document.createElement('a')
      a.href = qrDataUrl
      a.download = `qr-code.${format}`
      a.click()
    }
  }, [qrDataUrl, svgString])

  const clearQR = useCallback(() => {
    setQrDataUrl(null)
    setSvgString(null)
    setError(null)
  }, [])

  return {
    qrDataUrl,
    svgString,
    loading,
    error,
    generateQR,
    downloadQR,
    clearQR,
  }
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now()
    const toast = { id, message, type }
    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}