import { useState, useEffect } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Menu, X, Languages, Home, PlusCircle, LayoutDashboard,
  User, Settings, LogOut, LogIn, UserPlus, ChevronRight, Globe, FileText,
  Images, Video, Wifi, UtensilsCrossed, Briefcase, Contact, Music, Smartphone,
  Link as LinkIcon, Ticket, Facebook, Instagram, Share2, MessageCircle,
  ArrowRight, QrCode as QrIcon, Loader2, Check, AlertCircle, Trash2, Download,
} from 'lucide-react'
import { useLanguage } from './contexts/LanguageContext'
import { useAuth } from './contexts/AuthContext'
import { useQRCodes } from './hooks/useQRCodes'
import QRCode from 'qrcode'
import QRWizard from './components/QRWizard'
import QRThumbnail from './components/QRThumbnail'

const QR_TYPE_IDS = [
  'website', 'pdf', 'images', 'video', 'wifi', 'menu', 'business', 'vcard',
  'mp3', 'apps', 'links', 'coupon', 'facebook', 'instagram', 'social', 'whatsapp',
]

const QR_TYPE_ICONS = {
  website: Globe,
  pdf: FileText,
  images: Images,
  video: Video,
  wifi: Wifi,
  menu: UtensilsCrossed,
  business: Briefcase,
  vcard: Contact,
  mp3: Music,
  apps: Smartphone,
  links: LinkIcon,
  coupon: Ticket,
  facebook: Facebook,
  instagram: Instagram,
  social: Share2,
  whatsapp: MessageCircle,
}

function LanguageToggle({ compact = false }) {
  const { language, changeLanguage } = useLanguage()
  return (
    <button
      onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}
      className="btn-ghost flex items-center gap-2 text-sm"
      aria-label="Toggle language"
    >
      <Languages size={18} />
      {!compact && <span>{language === 'en' ? 'العربية' : 'English'}</span>}
    </button>
  )
}

function Header() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`

  const mobileItemClass =
    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50'

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
  }

  return (
    <header className="glass-card sticky top-0 z-40 rounded-none border-x-0 border-t-0">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <QrIcon size={20} />
          </span>
          <span className="text-lg font-bold text-gray-900">{t('common.appName')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>
            <Home size={18} />
            <span>{t('nav.home')}</span>
          </NavLink>
          <NavLink to="/create" className={navLinkClass}>
            <PlusCircle size={18} />
            <span>{t('nav.create')}</span>
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={18} />
              <span>{t('nav.dashboard')}</span>
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <NavLink to="/settings" className={navLinkClass}>
                <Settings size={18} />
                <span>{t('nav.settings')}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn-ghost flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost flex items-center gap-2 text-sm">
                <LogIn size={18} />
                <span>{t('nav.login')}</span>
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-2 text-sm">
                <UserPlus size={18} />
                <span>{t('nav.register')}</span>
              </Link>
            </div>
          )}
        </div>

        <button
          className="btn-ghost md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 md:hidden"
          >
            <nav className="container-app flex flex-col gap-1 py-3">
              <NavLink to="/" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                <Home size={18} /> {t('nav.home')}
              </NavLink>
              <NavLink to="/create" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                <PlusCircle size={18} /> {t('nav.create')}
              </NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={18} /> {t('nav.dashboard')}
                  </NavLink>
                  <NavLink to="/profile" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                    <User size={18} /> {t('nav.profile')}
                  </NavLink>
                  <NavLink to="/settings" className={mobileItemClass} onClick={() => setMenuOpen(false)}>
                    <Settings size={18} /> {t('nav.settings')}
                  </NavLink>
                  <button onClick={handleLogout} className={`${mobileItemClass} text-red-600`}>
                    <LogOut size={18} /> {t('nav.logout')}
                  </button>
                </>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
                <LanguageToggle />
                {!user && (
                  <Link to="/login" className="btn-primary px-4 py-2 text-sm" onClick={() => setMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container-app flex flex-col items-center gap-2 py-8 text-center">
        <div className="flex items-center gap-2">
          <QrIcon size={20} className="text-indigo-600" />
          <span className="font-semibold text-gray-900">{t('common.appName')}</span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} {t('common.appName')}
        </p>
      </div>
    </footer>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function HomePage() {
  const { t } = useTranslation()
  const features = t('home.features.items', { returnObjects: true })

  return (
    <div>
      <section className="section">
        <div className="container-app text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <QrIcon size={44} />
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/create" className="btn-primary flex items-center gap-2 px-6 py-3 text-base">
                {t('home.hero.cta')}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
              <Link to="/#types" className="btn-secondary flex items-center gap-2 px-6 py-3 text-base">
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container-app">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            {t('home.features.title')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(features) &&
              features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <section id="types" className="section">
        <div className="container-app">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            {t('home.qrTypes.title')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {QR_TYPE_IDS.map((id, index) => {
              const Icon = QR_TYPE_ICONS[id] || QrIcon
              return (
                <Link to="/create" key={id}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="glass-card group flex items-center gap-3 p-4 hover:shadow-lg"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {t(`home.qrTypes.types.${id}`)}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="container-app text-center text-white">
          <h2 className="text-3xl font-bold">{t('home.cta.title')}</h2>
          <p className="mt-3 text-indigo-100">{t('home.cta.subtitle')}</p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg transition-transform hover:scale-105"
          >
            {t('home.cta.button')}
            <ChevronRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function LoginPage() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}
    if (!form.email) errors.email = t('auth.validation.required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('auth.validation.email')
    if (!form.password) errors.password = t('auth.validation.required')
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    const result = await login(form.email, form.password)
    if (!result.success) setFormError(result.error || t('errors.unknown'))
  }

  return (
    <div className="section">
      <div className="container-app">
        <div className="mx-auto max-w-md">
          <div className="glass-card p-8">
            <div className="mb-6 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <LogIn size={26} />
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{t('auth.login.title')}</h1>
              <p className="mt-1 text-sm text-gray-500">{t('auth.login.subtitle')}</p>
            </div>

            {(formError || error) && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={16} />
                <span>{formError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">{t('auth.login.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label className="input-label">{t('auth.login.password')}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    {t('common.loading')}
                  </span>
                ) : (
                  t('auth.login.submit')
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {t('auth.login.noAccount')}{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {t('auth.login.signUp')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterPage() {
  const { t } = useTranslation()
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}
    if (!form.name) errors.name = t('auth.validation.required')
    else if (form.name.trim().length < 2) errors.name = t('auth.validation.nameMin')
    if (!form.email) errors.email = t('auth.validation.required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('auth.validation.email')
    if (!form.password) errors.password = t('auth.validation.required')
    else if (form.password.length < 8) errors.password = t('auth.validation.passwordMin')
    if (!form.confirmPassword) errors.confirmPassword = t('auth.validation.required')
    else if (form.confirmPassword !== form.password) errors.confirmPassword = t('auth.validation.passwordMatch')
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    const result = await register(form.name, form.email, form.password)
    if (!result.success) setFormError(result.error || t('errors.unknown'))
  }

  return (
    <div className="section">
      <div className="container-app">
        <div className="mx-auto max-w-md">
          <div className="glass-card p-8">
            <div className="mb-6 text-center">
              <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <UserPlus size={26} />
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{t('auth.register.title')}</h1>
              <p className="mt-1 text-sm text-gray-500">{t('auth.register.subtitle')}</p>
            </div>

            {(formError || error) && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={16} />
                <span>{formError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">{t('auth.register.name')}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder={t('createQR.contentForm.placeholders.vcardName')}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label className="input-label">{t('auth.register.email')}</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label className="input-label">{t('auth.register.password')}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>
              <div>
                <label className="input-label">{t('auth.register.confirmPassword')}</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                {t('auth.register.terms')}
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    {t('common.loading')}
                  </span>
                ) : (
                  t('auth.register.submit')
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {t('auth.register.hasAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {t('auth.register.signIn')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { t } = useTranslation()
  const { qrcodes, loading, error, listQRCodes, deleteQRCode } = useQRCodes()
  const [deletingId, setDeletingId] = useState(null)
  const [previewQr, setPreviewQr] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    listQRCodes()
  }, [listQRCodes])

  const handleDelete = async (id) => {
    if (!window.confirm(t('dashboard.qrList.deleteConfirm'))) return
    setDeletingId(id)
    try {
      await deleteQRCode(id)
    } catch {
      // error surfaced via hook state
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteFromModal = async () => {
    if (!previewQr) return
    if (!window.confirm(t('dashboard.qrList.deleteConfirm'))) return
    setDeletingId(previewQr.id)
    try {
      await deleteQRCode(previewQr.id)
      setPreviewQr(null)
    } catch {
      // error surfaced via hook state
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async () => {
    if (!previewQr) return
    setDownloading(true)
    try {
      const url = await QRCode.toDataURL(previewQr.content, {
        width: 1024,
        margin: 2,
        color: {
          dark: previewQr.design?.foregroundColor || '#000000',
          light: previewQr.design?.backgroundColor || '#ffffff',
        },
        errorCorrectionLevel: previewQr.design?.errorCorrection || 'M',
      })
      const a = document.createElement('a')
      a.href = url
      a.download = `${previewQr.name}.png`
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  const stats = [
    { key: 'totalQRCodes', icon: QrIcon, value: qrcodes.length },
    { key: 'totalScans', icon: Share2, value: 0 },
    { key: 'dynamicCodes', icon: LinkIcon, value: 0 },
    { key: 'staticCodes', icon: QrIcon, value: 0 },
  ]

  return (
    <div className="section">
      <div className="container-app">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ key, icon: Icon, value }) => (
            <div key={key} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t(`dashboard.stats.${key}`)}</span>
                <Icon size={18} className="text-indigo-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.qrList.title')}</h2>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={listQRCodes} className="btn-secondary">{t('common.back')}</button>
            </div>
          ) : qrcodes.length === 0 ? (
            <div className="p-12 text-center">
              <QrIcon size={48} className="mx-auto text-indigo-300" />
              <p className="mt-4 text-sm text-gray-500">{t('dashboard.qrList.empty')}</p>
              <Link to="/create" className="btn-primary mt-6 inline-flex items-center gap-2">
                <PlusCircle size={18} />
                {t('dashboard.qrList.createFirst')}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {qrcodes.map((qr) => (
                <button
                  type="button"
                  key={qr.id}
                  onClick={() => setPreviewQr(qr)}
                  className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <QRThumbnail content={qr.content} design={qr.design} size={56} alt={qr.name} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{qr.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {t(`home.qrTypes.types.${qr.type}`)} · {new Date(qr.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-indigo-600 font-medium hidden sm:inline">
                    {t('dashboard.qrList.view')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewQr(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white rounded-t-2xl">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{previewQr.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewQr(null)}
                className="btn-ghost p-2 shrink-0"
                aria-label={t('common.close')}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center gap-6">
              <QRThumbnail content={previewQr.content} design={previewQr.design} size={280} alt={previewQr.name} />

              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">{t('dashboard.qrList.columns.type')}</span>
                  <span className="font-medium text-gray-900">{t(`home.qrTypes.types.${previewQr.type}`)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">{t('dashboard.qrList.columns.created')}</span>
                  <span className="font-medium text-gray-900">{new Date(previewQr.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between gap-4 items-start">
                  <span className="text-gray-500 shrink-0">{t('createQR.contentForm.fields.url')}</span>
                  <span className="font-mono text-xs text-gray-900 text-right break-all max-w-[60%]">{previewQr.content}</span>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 p-4 border-t border-gray-100 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={handleDeleteFromModal}
                disabled={deletingId === previewQr.id}
                className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2 disabled:opacity-50"
              >
                {deletingId === previewQr.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {t('common.delete')}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {t('common.download')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function ProfilePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  return (
    <div className="section">
      <div className="container-app">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.profile')}</h1>
          <div className="glass-card mt-6 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white">
                {(user?.name || '?').charAt(0).toUpperCase()}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-6">
              <Link to="/settings" className="btn-secondary flex w-full items-center justify-center gap-2">
                <Settings size={18} />
                {t('nav.settings')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  const { t } = useTranslation()
  const { language, changeLanguage } = useLanguage()
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  const languageOptions = [
    { code: 'en', label: t('settings.language.english'), dir: 'ltr' },
    { code: 'ar', label: t('settings.language.arabic'), dir: 'rtl' },
  ]

  return (
    <div className="section">
      <div className="container-app">
        <div className="mx-auto max-w-lg space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.profile.title')}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="input-label">{t('settings.profile.name')}</label>
                <input className="input-field" value={user?.name || ''} readOnly />
              </div>
              <div>
                <label className="input-label">{t('settings.profile.email')}</label>
                <input className="input-field" value={user?.email || ''} readOnly />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.language.title')}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => {
                    changeLanguage(option.code)
                    setSaved(true)
                    setTimeout(() => setSaved(false), 2000)
                  }}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    language === option.code
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {option.label}
                    {language === option.code && <Check size={16} />}
                  </span>
                </button>
              ))}
            </div>
            {saved && (
              <p className="mt-3 flex items-center gap-1 text-sm text-green-600">
                <Check size={14} /> {t('toasts.saved')}
              </p>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.theme.title')}</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[t('settings.theme.light'), t('settings.theme.dark'), t('settings.theme.system')].map(
                (label) => (
                  <button key={label} className="rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-600">
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('settings.account.title')}</h2>
            <div className="mt-4 space-y-3">
              <input type="password" className="input-field" placeholder={t('settings.account.currentPassword')} />
              <input type="password" className="input-field" placeholder={t('settings.account.newPassword')} />
              <input type="password" className="input-field" placeholder={t('settings.account.confirmPassword')} />
              <button type="button" className="btn-primary w-full">
                {t('settings.account.changePassword')}
              </button>
              <button type="button" className="btn-danger w-full">
                {t('settings.account.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="section">
      <div className="container-app text-center">
        <p className="text-6xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('errors.notFound')}</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex items-center gap-2">
          <Home size={18} />
          {t('nav.home')}
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<QRWizard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
