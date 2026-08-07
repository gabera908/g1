import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'
import { QR_TYPES, QR_CATEGORIES } from '../config/qrTypes'
import * as LucideIcons from 'lucide-react'

const iconMap = {
  globe: LucideIcons.Globe,
  'file-text': LucideIcons.FileText,
  image: LucideIcons.Image,
  video: LucideIcons.Video,
  wifi: LucideIcons.Wifi,
  utensils: LucideIcons.Utensils,
  briefcase: LucideIcons.Briefcase,
  user: LucideIcons.User,
  music: LucideIcons.Music,
  smartphone: LucideIcons.Smartphone,
  'link-2': LucideIcons.Link2,
  ticket: LucideIcons.Ticket,
  facebook: LucideIcons.Facebook,
  instagram: LucideIcons.Instagram,
  'share-2': LucideIcons.Share2,
  'message-circle': LucideIcons.MessageCircle,
  grid: LucideIcons.Grid,
}

const categoryIconMap = {
  grid: LucideIcons.Grid,
  globe: LucideIcons.Globe,
  briefcase: LucideIcons.Briefcase,
  user: LucideIcons.User,
  'share-2': LucideIcons.Share2,
  wifi: LucideIcons.Wifi,
  ticket: LucideIcons.Ticket,
  'message-circle': LucideIcons.MessageCircle,
  video: LucideIcons.Video,
}

export default function QRTypeSelector({ selectedType, onSelect }) {
  const { t, isRTL } = useLanguage()

  const getCategoryColor = (category) => {
    const colors = {
      digital: 'bg-blue-100 text-blue-700 border-blue-200',
      business: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      contact: 'bg-teal-100 text-teal-700 border-teal-200',
      social: 'bg-purple-100 text-purple-700 border-purple-200',
      utility: 'bg-orange-100 text-orange-700 border-orange-200',
      marketing: 'bg-rose-100 text-rose-700 border-rose-200',
      communication: 'bg-green-100 text-green-700 border-green-200',
      media: 'bg-pink-100 text-pink-700 border-pink-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const handleTypeClick = (typeId) => {
    onSelect(typeId)
  }

  return (
    <div>
      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max" role="tablist">
          {QR_CATEGORIES.map((category) => {
            const CategoryIcon = categoryIconMap[category.icon] || LucideIcons.Grid
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={false}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
                onClick={() => {}}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{t(`config.categories.${category.id}`) || category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Type Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {QR_TYPES.map((type) => {
          const Icon = iconMap[type.icon] || LucideIcons.QrCode
          const isSelected = selectedType === type.id

          return (
            <motion.button
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group p-4 rounded-2xl transition-all duration-300 flex flex-col items-center text-center ${
                isSelected
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30 border-2 border-transparent'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                isSelected
                  ? 'bg-white/20'
                  : getCategoryColor(type.category).replace('text-', 'bg-').replace('border-', 'bg-')
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : getCategoryColor(type.category).replace('bg-', 'text-').replace('border-', 'text-')}`} />
              </div>

              <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {t(`home.qrTypes.types.${type.id}`)}
              </span>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 10 }}
                className="mt-2 text-xs opacity-70 transition-opacity"
              >
                {t(`home.qrTypes.types.${type.id}`)}
              </motion.div>
            </motion.button>
          )
        })}
      </div>

      {/* Selected Type Info */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{t(`home.qrTypes.types.${selectedType}`)}</p>
              <p className="text-sm text-gray-600 mt-1">{t('createQR.typeSelector.subtitle')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}