import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { ERROR_CORRECTION_LEVELS, FRAME_STYLES, EYE_STYLES, GRADIENT_DIRECTIONS } from '../config/qrTypes'

const colorSwatches = [
  '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280',
  '#6366f1', '#4f46e5', '#4338ca', '#3b82f6', '#0ea5e9',
  '#10b981', '#059669', '#f59e0b', '#f97316', '#ef4444',
  '#ec4899', '#a855f7', '#7c3aed', '#ffffff', '#f3f4f6',
]

export default function QRDesignPanel({ options, onChange, qrDataUrl }) {
  const { t } = useLanguage()
  const logoInputRef = useRef(null)

  const update = (key, value) => {
    onChange(prev => ({ ...prev, [key]: value }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be less than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      update('logo', event.target.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const renderColorField = (key, label) => (
    <div className="space-y-2">
      <label className="input-label">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={options[key]}
          onChange={(e) => update(key, e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 bg-white"
        />
        <input
          type="text"
          value={options[key]}
          onChange={(e) => update(key, e.target.value)}
          className="input-field flex-1"
          dir="ltr"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {colorSwatches.map(color => (
          <button
            key={color}
            onClick={() => update(key, color)}
            className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 border border-gray-200 ${
              options[key] === color ? 'ring-2 ring-primary-500 ring-offset-2' : ''
            }`}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Colors Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          {t('createQR.designPanel.colors.title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderColorField('foregroundColor', t('createQR.designPanel.colors.foreground'))}
          {renderColorField('backgroundColor', t('createQR.designPanel.colors.background'))}
        </div>

        {/* Gradient Toggle */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">{t('createQR.designPanel.colors.gradient')}</p>
              <p className="text-sm text-gray-500 mt-1">Indigo → Purple</p>
            </div>
            <button
              onClick={() => update('useGradient', !options.useGradient)}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                options.useGradient ? 'bg-gradient-to-r from-primary-600 to-secondary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform ${
                  options.useGradient ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {options.useGradient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">{t('createQR.designPanel.colors.gradientStart')}</label>
                  <input
                    type="color"
                    value={options.gradientStart}
                    onChange={(e) => update('gradientStart', e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="input-label">{t('createQR.designPanel.colors.gradientEnd')}</label>
                  <input
                    type="color"
                    value={options.gradientEnd}
                    onChange={(e) => update('gradientEnd', e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer border border-gray-200 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">{t('createQR.designPanel.colors.gradientDirection')}</label>
                <select
                  value={options.gradientDirection}
                  onChange={(e) => update('gradientDirection', e.target.value)}
                  className="input-field"
                >
                  {GRADIENT_DIRECTIONS.map(dir => (
                    <option key={dir.value} value={dir.value}>{dir.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Style Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eye Style */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">{t('createQR.designPanel.eyeStyle.title')}</h4>
          <div className="grid grid-cols-3 gap-2">
            {EYE_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => update('eyeStyle', style.value)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  options.eyeStyle === style.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Frame Style */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-3">{t('createQR.designPanel.frame.title')}</h4>
          <div className="grid grid-cols-2 gap-2">
            {FRAME_STYLES.map(frame => (
              <button
                key={frame.value}
                onClick={() => update('frameStyle', frame.value)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  options.frameStyle === frame.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {frame.label}
              </button>
            ))}
          </div>
          {options.frameStyle === 'custom' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              <input
                type="text"
                value={options.frameText}
                onChange={(e) => update('frameText', e.target.value)}
                placeholder="Frame text"
                className="input-field"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Logo Upload */}
      <section className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
        <h4 className="font-medium text-gray-900 mb-3">{t('createQR.designPanel.logo.title')}</h4>
        <div className="flex items-center gap-4">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            onClick={() => logoInputRef.current?.click()}
            className="btn-secondary"
          >
            {t('createQR.designPanel.logo.upload')}
          </button>
          {options.logo && (
            <button
              onClick={() => update('logo', null)}
              className="btn-danger"
            >
              {t('createQR.designPanel.logo.remove')}
            </button>
          )}
          {options.logo && (
            <img
              src={options.logo}
              alt="Logo preview"
              className="w-12 h-12 rounded-lg object-contain border border-gray-200"
            />
          )}
        </div>
        {options.logo && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">{t('createQR.designPanel.logo.size')}</label>
              <input
                type="range"
                min="0.1"
                max="0.35"
                step="0.05"
                value={options.logoSize}
                onChange={(e) => update('logoSize', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(options.logoSize * 100)}%</span>
            </div>
            <div>
              <label className="input-label">{t('createQR.designPanel.logo.padding')}</label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.05"
                value={options.logoPadding}
                onChange={(e) => update('logoPadding', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(options.logoPadding * 100)}%</span>
            </div>
          </div>
        )}
      </section>

      {/* Options */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
          <label className="input-label">{t('createQR.designPanel.options.margin')}</label>
          <input
            type="range"
            min="0"
            max="10"
            value={options.margin}
            onChange={(e) => update('margin', parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{options.margin}px</span>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl">
          <label className="input-label">{t('createQR.designPanel.options.errorCorrection')}</label>
          <select
            value={options.errorCorrection}
            onChange={(e) => update('errorCorrection', e.target.value)}
            className="input-field"
          >
            {ERROR_CORRECTION_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </section>
    </motion.div>
  )
}