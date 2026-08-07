import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QRThumbnail({ content, design, size = 128, alt = 'QR Code' }) {
  const [dataUrl, setDataUrl] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!content) {
      setDataUrl(null)
      return
    }

    const options = {
      width: size,
      margin: 1,
      color: {
        dark: design?.foregroundColor || '#000000',
        light: design?.backgroundColor || '#ffffff',
      },
      errorCorrectionLevel: design?.errorCorrection || 'M',
    }

    QRCode.toDataURL(content, options)
      .then((url) => {
        if (!cancelled) setDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [content, design, size])

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gray-100 text-gray-400"
        style={{ width: size, height: size }}
      >
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    )
  }

  if (!dataUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gray-100"
        style={{ width: size, height: size }}
      >
        <svg className="h-6 w-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className="rounded-lg object-contain"
      style={{ width: size, height: size }}
    />
  )
}
