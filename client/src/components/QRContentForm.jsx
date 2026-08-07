import React, { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { QR_TYPES } from '../config/qrTypes'

export default function QRContentForm({ type, formData, onChange }) {
  const { t, isRTL } = useLanguage()
  const typeConfig = useMemo(() => QR_TYPES.find(t => t.id === type), [type])

  if (!typeConfig) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500">{t('createQR.contentForm.title')}</p>
      </motion.div>
    )
  }

  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }))
  }

  const renderField = (field) => {
    const fieldConfig = typeConfig.fields.find(f => f === field)
    if (!fieldConfig) return null

    const label = t(`createQR.contentForm.fields.${field}`) || field
    const placeholder = t(`createQR.contentForm.placeholders.${field}`) || ''
    const required = typeConfig.required.includes(field)
    const value = formData[field] || ''
    const error = required && !value?.toString().trim()

    switch (field) {
      case 'url':
      case 'iosUrl':
      case 'androidUrl':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
              type="url"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
              dir="ltr"
            />
            {error && <p className="text-sm text-red-500">{t('auth.validation.required')}</p>}
          </div>
        )

      case 'wifiName':
      case 'vcardName':
      case 'vcardTitle':
      case 'vcardCompany':
      case 'title':
      case 'couponCode':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {error && <p className="text-sm text-red-500">{t('auth.validation.required')}</p>}
          </div>
        )

      case 'wifiPassword':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="password"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
            />
          </div>
        )

      case 'wifiEncryption':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label} {required && <span className="text-red-500">*</span>}</label>
            <select
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className={`input-field ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
            {error && <p className="text-sm text-red-500">{t('auth.validation.required')}</p>}
          </div>
        )

      case 'wifiHidden':
        return (
          <div className="space-y-2" key={field}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleChange(field, e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          </div>
        )

      case 'description':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="input-field"
            />
          </div>
        )

      case 'vcardEmail':
      case 'email':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="email"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
              dir="ltr"
            />
          </div>
        )

      case 'vcardPhone':
      case 'vcardMobile':
      case 'phone':
      case 'whatsappNumber':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="tel"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
              dir="ltr"
            />
          </div>
        )

      case 'vcardAddress':
      case 'address':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="input-field"
            />
          </div>
        )

      case 'vcardWebsite':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="url"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
              dir="ltr"
            />
          </div>
        )

      case 'whatsappMessage':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="input-field"
            />
          </div>
        )

      case 'couponValue':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
            />
          </div>
        )

      case 'couponExpiry':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="input-field"
            />
          </div>
        )

      case 'urls':
      case 'links':
      case 'socialLinks':
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label} {required && <span className="text-red-500">*</span>}</label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              rows={4}
              className={`input-field font-mono text-sm ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {error && <p className="text-sm text-red-500">{t('auth.validation.required')}</p>}
          </div>
        )

      default:
        return (
          <div className="space-y-2" key={field}>
            <label className="input-label">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="input-field"
            />
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{t(`home.qrTypes.types.${type}`)}</h3>
          <p className="text-sm text-gray-600">{t('createQR.contentForm.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {typeConfig.fields.map(field => renderField(field))}
      </div>
    </motion.div>
  )
}