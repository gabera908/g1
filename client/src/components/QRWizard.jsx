import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useQRCode } from '../hooks/useQRCode'
import { useQRCodes } from '../hooks/useQRCodes'
import { QR_TYPES, generateQRContent } from '../config/qrTypes'
import QRTypeSelector from './QRTypeSelector'
import QRContentForm from './QRContentForm'
import QRDesignPanel from './QRDesignPanel'
import QRDownload from './QRDownload'
import StepIndicator from './StepIndicator'

const STEPS = ['type', 'content', 'design', 'download']

export default function QRWizard() {
  const { t, isRTL } = useLanguage()
  const { isAuthenticated } = useAuth()
  const { qrDataUrl, svgString, loading: qrLoading, error: qrError, generateQR, clearQR } = useQRCode()
  const { saveQRCode } = useQRCodes()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({})
  const [qrName, setQrName] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [saveError, setSaveError] = useState('')
  const [designOptions, setDesignOptions] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    useGradient: false,
    gradientStart: '#6366f1',
    gradientEnd: '#a855f7',
    gradientDirection: 'to-br',
    eyeStyle: 'square',
    frameStyle: 'none',
    frameText: '',
    logo: null,
    logoSize: 0.2,
    logoPadding: 0.1,
    margin: 2,
    errorCorrection: 'M',
  })
  const [downloadOptions, setDownloadOptions] = useState({
    format: 'png',
    size: 512,
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return !!selectedType
      case 1: {
        const typeConfig = QR_TYPES.find(t => t.id === selectedType)
        if (!typeConfig) return false
        return typeConfig.required.every(field => formData[field] && formData[field].toString().trim())
      }
      case 2:
        return true
      case 3:
        return !!qrDataUrl
      default:
        return false
    }
  }, [currentStep, selectedType, formData, qrDataUrl])

  const deriveDefaultName = useCallback(() => {
    const { title, vcardName, wifiName, whatsappNumber, couponCode, url } = formData
    if (title) return title
    if (vcardName) return vcardName
    if (wifiName) return wifiName
    if (whatsappNumber) return whatsappNumber
    if (couponCode) return couponCode
    if (url) return url
    return t(`home.qrTypes.types.${selectedType}`)
  }, [formData, selectedType, t])

  const handleSave = async () => {
    if (!qrName.trim()) return
    setSaveStatus('saving')
    setSaveError('')
    try {
      const { logo, ...designWithoutLogo } = designOptions
      await saveQRCode({
        type: selectedType,
        name: qrName.trim(),
        content: generatedContent,
        design: designWithoutLogo,
      })
      setSaveStatus('saved')
    } catch (err) {
      setSaveStatus('error')
      setSaveError(err.message || t('errors.unknown'))
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      setIsGenerating(true)
      const content = generateQRContent(selectedType, formData)
      setGeneratedContent(content)
      setQrName(deriveDefaultName())

      await generateQR(content, {
        width: 512,
        margin: designOptions.margin,
        color: designOptions.useGradient ? undefined : {
          dark: designOptions.foregroundColor,
          light: designOptions.backgroundColor,
        },
        errorCorrectionLevel: designOptions.errorCorrection,
      })
      setIsGenerating(false)
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    if (qrDataUrl) {
      // Trigger download
      const format = downloadOptions.format
      if (format === 'svg' && svgString) {
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `qr-code.${format}`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        const a = document.createElement('a')
        a.href = qrDataUrl
        a.download = `qr-code.${format}`
        a.click()
      }
    }
  }

  const resetWizard = () => {
    setCurrentStep(0)
    setSelectedType(null)
    setFormData({})
    setQrName('')
    setSaveStatus('idle')
    setSaveError('')
    setDesignOptions({
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      useGradient: false,
      gradientStart: '#6366f1',
      gradientEnd: '#a855f7',
      gradientDirection: 'to-br',
      eyeStyle: 'square',
      frameStyle: 'none',
      frameText: '',
      logo: null,
      logoSize: 0.2,
      logoPadding: 0.1,
      margin: 2,
      errorCorrection: 'M',
    })
    clearQR()
    setGeneratedContent('')
  }

  const stepContent = {
    type: <QRTypeSelector selectedType={selectedType} onSelect={setSelectedType} />,
    content: <QRContentForm type={selectedType} formData={formData} onChange={setFormData} />,
    design: <QRDesignPanel options={designOptions} onChange={setDesignOptions} qrDataUrl={qrDataUrl} />,
    download: (
      <div className="space-y-6">
        <QRDownload qrDataUrl={qrDataUrl} svgString={svgString} options={downloadOptions} onChange={setDownloadOptions} />
        {isAuthenticated && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('createQR.download.saveTitle')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('createQR.download.saveSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                placeholder={t('createQR.download.namePlaceholder')}
                maxLength={100}
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving' || !qrName.trim()}
                className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('common.loading')}
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {t('createQR.download.saved')}
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    {t('common.save')}
                  </>
                )}
              </button>
            </div>
            {saveStatus === 'saved' && (
              <p className="mt-3 text-sm text-green-600 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {t('toasts.qrCreated')}
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="mt-3 text-sm text-red-600">{saveError}</p>
            )}
          </div>
        )}
        {!isAuthenticated && (
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">{t('createQR.download.loginToSave')}</p>
          </div>
        )}
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            {t('createQR.wizard.progress', { current: currentStep + 1 })}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t(`createQR.wizard.steps.${STEPS[currentStep]}`)}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StepIndicator
            steps={STEPS.map(s => t(`createQR.wizard.steps.${s}`))}
            currentStep={currentStep}
            isRTL={isRTL}
          />
        </motion.div>

        {/* Wizard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              {stepContent[STEPS[currentStep]]}

              {/* Error Display */}
              {qrError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{qrError}</span>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="btn-ghost"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
              </button>

              <div className="flex items-center gap-3">
                {currentStep === STEPS.length - 1 ? (
                  <>
                    <button
                      onClick={resetWizard}
                      className="btn-secondary"
                    >
                      {t('common.create')} {t('common.new')}
                    </button>
                    <button
                      onClick={handleFinish}
                      disabled={qrLoading || !qrDataUrl}
                      className="btn-primary"
                    >
                      {qrLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t('common.download')}
                        </>
                      ) : (
                        t('common.download')
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('common.next')}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Preview Sidebar on Desktop */}
        <div className="hidden lg:block mt-8">
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('common.preview')}
              </h3>
              <div className="qr-preview">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center">{selectedType ? t(`home.qrTypes.types.${selectedType}`) : t('home.hero.subtitle')}</p>
                  </div>
                )}
              </div>

              {selectedType && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
                  <p className="font-medium text-gray-900 mb-1">{t('createQR.typeSelector.title')}</p>
                  <p className="text-gray-600 capitalize">{t(`home.qrTypes.types.${selectedType}`)}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
    </div>
  )
}