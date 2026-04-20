import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Language } from '../lib/translations'

const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export default function LanguageSelector() {
    const { user, setUser } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const currentLang = (user?.language_preference as Language) || 'en'
    const currentLangData = languages.find(l => l.code === currentLang) || languages[0]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageChange = async (code: Language) => {
        if (code === currentLang) {
            setIsOpen(false)
            return
        }

        try {
            const { data } = await api.put('/auth/me', {
                language_preference: code
            })
            if (data.success) {
                setUser(data.data)
            }
        } catch (err) {
            console.error('Failed to update language', err)
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:shadow-sm"
            >
                <span className="text-xl">{currentLangData.flag}</span>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider hidden sm:block">
                    {currentLangData.code}
                </span>
                <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-border p-2 z-[100] origin-top-right"
                    >
                        <div className="px-3 py-2 border-b border-border/50 mb-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Select Language</span>
                        </div>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${currentLang === lang.code
                                        ? 'bg-accent-light text-accent'
                                        : 'hover:bg-bg'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="text-sm font-medium">{lang.name}</span>
                                </div>
                                {currentLang === lang.code && <Check size={14} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
