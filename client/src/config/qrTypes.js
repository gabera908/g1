export const QR_TYPES = [
  {
    id: 'website',
    name: 'website',
    icon: 'globe',
    category: 'digital',
    color: 'blue',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'pdf',
    name: 'pdf',
    icon: 'file-text',
    category: 'digital',
    color: 'red',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'images',
    name: 'images',
    icon: 'image',
    category: 'digital',
    color: 'green',
    fields: ['urls', 'title', 'description'],
    required: ['urls'],
  },
  {
    id: 'video',
    name: 'video',
    icon: 'video',
    category: 'digital',
    color: 'purple',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'wifi',
    name: 'wifi',
    icon: 'wifi',
    category: 'utility',
    color: 'orange',
    fields: ['wifiName', 'wifiPassword', 'wifiEncryption', 'wifiHidden'],
    required: ['wifiName', 'wifiEncryption'],
  },
  {
    id: 'menu',
    name: 'menu',
    icon: 'utensils',
    category: 'business',
    color: 'amber',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'business',
    name: 'business',
    icon: 'briefcase',
    category: 'business',
    color: 'indigo',
    fields: ['title', 'description', 'url', 'phone', 'email', 'address'],
    required: ['title'],
  },
  {
    id: 'vcard',
    name: 'vcard',
    icon: 'user',
    category: 'contact',
    color: 'teal',
    fields: ['vcardName', 'vcardTitle', 'vcardCompany', 'vcardEmail', 'vcardPhone', 'vcardMobile', 'vcardAddress', 'vcardWebsite'],
    required: ['vcardName'],
  },
  {
    id: 'mp3',
    name: 'mp3',
    icon: 'music',
    category: 'media',
    color: 'pink',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'apps',
    name: 'apps',
    icon: 'smartphone',
    category: 'digital',
    color: 'cyan',
    fields: ['iosUrl', 'androidUrl', 'title', 'description'],
    required: ['iosUrl', 'androidUrl'],
  },
  {
    id: 'links',
    name: 'links',
    icon: 'link-2',
    category: 'digital',
    color: 'violet',
    fields: ['links', 'title', 'description'],
    required: ['links'],
  },
  {
    id: 'coupon',
    name: 'coupon',
    icon: 'ticket',
    category: 'marketing',
    color: 'rose',
    fields: ['couponCode', 'couponValue', 'couponExpiry', 'title', 'description'],
    required: ['couponCode'],
  },
  {
    id: 'facebook',
    name: 'facebook',
    icon: 'facebook',
    category: 'social',
    color: 'blue',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'instagram',
    name: 'instagram',
    icon: 'instagram',
    category: 'social',
    color: 'pink',
    fields: ['url', 'title', 'description'],
    required: ['url'],
  },
  {
    id: 'social',
    name: 'social',
    icon: 'share-2',
    category: 'social',
    color: 'purple',
    fields: ['socialLinks', 'title', 'description'],
    required: ['socialLinks'],
  },
  {
    id: 'whatsapp',
    name: 'whatsapp',
    icon: 'message-circle',
    category: 'communication',
    color: 'green',
    fields: ['whatsappNumber', 'whatsappMessage'],
    required: ['whatsappNumber'],
  },
]

export const QR_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'digital', name: 'Digital', icon: 'globe' },
  { id: 'business', name: 'Business', icon: 'briefcase' },
  { id: 'contact', name: 'Contact', icon: 'user' },
  { id: 'social', name: 'Social', icon: 'share-2' },
  { id: 'utility', name: 'Utility', icon: 'wifi' },
  { id: 'marketing', name: 'Marketing', icon: 'ticket' },
  { id: 'communication', name: 'Communication', icon: 'message-circle' },
  { id: 'media', name: 'Media', icon: 'video' },
]

export const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: 'Low (7%)', description: 'Low error correction' },
  { value: 'M', label: 'Medium (15%)', description: 'Medium error correction (recommended)' },
  { value: 'Q', label: 'Quartile (25%)', description: 'High error correction' },
  { value: 'H', label: 'High (30%)', description: 'Maximum error correction' },
]

export const WIFI_ENCRYPTION_TYPES = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'No Password' },
]

export const FRAME_STYLES = [
  { value: 'none', label: 'No Frame', icon: 'square' },
  { value: 'circle', label: 'Circle', icon: 'circle' },
  { value: 'rounded', label: 'Rounded Square', icon: 'square-rounded' },
  { value: 'custom', label: 'Custom Text', icon: 'type' },
]

export const EYE_STYLES = [
  { value: 'square', label: 'Square', icon: 'square' },
  { value: 'rounded', label: 'Rounded', icon: 'circle' },
  { value: 'dot', label: 'Dot', icon: 'dot' },
]

export const GRADIENT_DIRECTIONS = [
  { value: 'to-r', label: 'Left to Right' },
  { value: 'to-l', label: 'Right to Left' },
  { value: 'to-b', label: 'Top to Bottom' },
  { value: 'to-t', label: 'Bottom to Top' },
  { value: 'to-br', label: 'Top-Left to Bottom-Right' },
  { value: 'to-bl', label: 'Top-Right to Bottom-Left' },
  { value: 'to-tr', label: 'Bottom-Left to Top-Right' },
  { value: 'to-tl', label: 'Bottom-Right to Top-Left' },
]

export const DOWNLOAD_FORMATS = [
  { value: 'png', label: 'PNG', icon: 'image', mimeType: 'image/png' },
  { value: 'svg', label: 'SVG', icon: 'code', mimeType: 'image/svg+xml' },
  { value: 'jpg', label: 'JPG', icon: 'image', mimeType: 'image/jpeg' },
]

export const DOWNLOAD_SIZES = [
  { value: 256, label: 'Small (256×256)' },
  { value: 512, label: 'Medium (512×512)' },
  { value: 1024, label: 'Large (1024×1024)' },
  { value: 2048, label: 'Extra Large (2048×2048)' },
]

export function getQRTypeById(id) {
  return QR_TYPES.find((type) => type.id === id)
}

export function getQRTypesByCategory(category) {
  if (category === 'all') return QR_TYPES
  return QR_TYPES.filter((type) => type.category === category)
}

export function generateQRContent(type, data) {
  switch (type) {
    case 'website':
    case 'pdf':
    case 'menu':
    case 'facebook':
    case 'instagram':
      return data.url

    case 'video':
    case 'mp3':
      return data.url

    case 'images':
      return JSON.stringify({ type: 'images', urls: data.urls })

    case 'wifi': {
      const { wifiName, wifiPassword, wifiEncryption, wifiHidden } = data
      return `WIFI:T:${wifiEncryption};S:${wifiName};P:${wifiPassword || ''};H:${wifiHidden ? 'true' : 'false'};;`
    }

    case 'business': {
      const { title, description, url, phone, email, address } = data
      return JSON.stringify({ type: 'business', title, description, url, phone, email, address })
    }

    case 'vcard': {
      const { vcardName, vcardTitle, vcardCompany, vcardEmail, vcardPhone, vcardMobile, vcardAddress, vcardWebsite } = data
      let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
      vcard += `FN:${vcardName}\n`
      if (vcardTitle) vcard += `TITLE:${vcardTitle}\n`
      if (vcardCompany) vcard += `ORG:${vcardCompany}\n`
      if (vcardEmail) vcard += `EMAIL:${vcardEmail}\n`
      if (vcardPhone) vcard += `TEL;TYPE=WORK,VOICE:${vcardPhone}\n`
      if (vcardMobile) vcard += `TEL;TYPE=CELL,VOICE:${vcardMobile}\n`
      if (vcardAddress) vcard += `ADR:;;${vcardAddress}\n`
      if (vcardWebsite) vcard += `URL:${vcardWebsite}\n`
      vcard += 'END:VCARD'
      return vcard
    }

    case 'apps': {
      const { iosUrl, androidUrl } = data
      return JSON.stringify({ type: 'apps', ios: iosUrl, android: androidUrl })
    }

    case 'links': {
      const { links } = data
      return JSON.stringify({ type: 'links', links })
    }

    case 'coupon': {
      const { couponCode, couponValue, couponExpiry, title, description } = data
      return JSON.stringify({ type: 'coupon', code: couponCode, value: couponValue, expiry: couponExpiry, title, description })
    }

    case 'social': {
      const { socialLinks } = data
      return JSON.stringify({ type: 'social', links: socialLinks })
    }

    case 'whatsapp': {
      const { whatsappNumber, whatsappMessage } = data
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '')
      return `https://wa.me/${cleanNumber}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ''}`
    }

    default:
      return data.url || ''
  }
}