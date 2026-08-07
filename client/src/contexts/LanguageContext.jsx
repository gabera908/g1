import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || i18n.language || 'en'
  })
  const [isRTL, setIsRTL] = useState(() => {
    return language === 'ar'
  })

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
    setIsRTL(lng === 'ar')
    localStorage.setItem('language', lng)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
    document.body.className = lng === 'ar' ? 'rtl' : 'ltr'
  }, [])

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    document.body.className = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const value = {
    language,
    isRTL,
    changeLanguage,
    t: i18n.t.bind(i18n),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}