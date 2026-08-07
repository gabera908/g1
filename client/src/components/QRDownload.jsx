import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileDown, Loader2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const FORMATS = ['png', 'svg', 'jpg']
const PRESET_SIZES = [
  { key: 'small', value: 256 },
  { key: 'medium', value: 512 },
  { key: 'large', value: 1024 },
]

export default function QRDownload({ qrDataUrl, svgString, options, onChange }) {
  const { t } = useLanguage()
  const [isCustomSize, setIsCustomSize] = useState(!PRESET_SIZES.some(s => s.value === options.size))
  const [downloading, setDownloading] = useState(null)

  const update = (key, value) => onChange(prev => ({ ...prev, [key]: value }))

  const triggerDownload = (dataUrl, filename) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const svgBlobUrl = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    return URL.createObjectURL(blob)
  }

  const toJpegDataUrl = (dataUrl) =>
    new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.src = dataUrl
    })

  const buildDataUrl = async (format) => {
    if (format === 'png' || format === 'jpg') {
      const jpeg = format === 'jpg'
      const url = jpeg ? await toJpegDataUrl(qrDataUrl) : qrDataUrl
      return { url, filename: `qr-code.${jpeg ? 'jpg' : 'png'}` }
    }
    return { url: svgBlobUrl(), filename: 'qr-code.svg' }
  }

  const downloadFormat = async (format) => {
    setDownloading(format)
    try {
      const { url, filename } = await buildDataUrl(format)
      triggerDownload(url, filename)
    } finally {
      setDownloading(null)
    }
  }

  const downloadAll = async () => {
    setDownloading('all')
    try {
      for (const format of FORMATS) {
        const { url, filename } = await buildDataUrl(format)
        triggerDownload(url, filename)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } finally {
      setDownloading(null)
    }
  }

  const isPreset = (value) => PRESET_SIZES.some(s => s.value === value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="qr-preview">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code preview" className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-sm">{t('common.loading')}</div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="input-label">Format</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {FORMATS.map(format => (
              <button
                key={format}
                type="button"
                onClick={() => update('format', format)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  options.format === format
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-400'
                }`}
              >
                {t(`createQR.download.formats.${format}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">Size</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_SIZES.map(size => (
              <button
                key={size.key}
                type="button"
                onClick={() => {
                  setIsCustomSize(false)
                  update('size', size.value)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  !isCustomSize && options.size === size.value
                    ? 'bg-secondary-600 text-white border-secondary-600 shadow-md shadow-secondary-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-secondary-400'
                }`}
              >
                {t(`createQR.download.sizes.${size.key}`)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustomSize(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                isCustomSize
                  ? 'bg-secondary-600 text-white border-secondary-600 shadow-md shadow-secondary-500/25'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-secondary-400'
              }`}
            >
              {t('createQR.download.sizes.custom')}
            </button>
          </div>
          {isCustomSize && (
            <input
              type="number"
              min={128}
              max={2048}
              value={options.size}
              onChange={e => update('size', Math.min(2048, Math.max(128, Number(e.target.value) || 512)))}
              className="input-field mt-3 w-40"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => downloadFormat(options.format)}
          disabled={!qrDataUrl || downloading !== null}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading === options.format ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {t('createQR.download.buttons.download', { format: options.format.toUpperCase() })}
        </button>

        <button
          type="button"
          onClick={downloadAll}
          disabled={!qrDataUrl || downloading !== null}
          className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading === 'all' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          {t('createQR.download.buttons.downloadAll')}
        </button>
      </div>
    </motion.div>
  )
}
