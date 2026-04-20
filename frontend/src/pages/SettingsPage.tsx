import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import {
    Settings, User, Globe, Bell, Save, Loader2, Check, Lock, Eye, EyeOff
} from 'lucide-react'
import { useTranslation, Language } from '../lib/translations'



const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export default function SettingsPage() {
    const { user, setUser } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [language, setLanguage] = useState(user?.language_preference || 'en')
    const [notifications, setNotifications] = useState(true)

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)

    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')


    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSaved(false)
        setSuccessMsg('')

        if (newPassword && newPassword !== confirmPassword) {
            setError('New passwords do not match')
            setSaving(false)
            return
        }

        const payload: any = { name, email, language_preference: language }
        if (newPassword) {
            payload.current_password = currentPassword
            payload.new_password = newPassword
            payload.new_password_confirmation = confirmPassword
        }

        try {
            const { data } = await api.put('/auth/me', payload)
            if (data.success) {
                setUser(data.data)
                setSaved(true)
                setSuccessMsg(newPassword ? t.passwordUpdated : t.saved)

                // Clear password fields
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')

                setTimeout(() => {
                    setSaved(false)
                    setSuccessMsg('')
                }, 3000)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save settings')
        } finally {
            setSaving(false)
        }
    }


    return (
        <div className="max-w-2xl space-y-6 animate-fade-in">
            <div>
                <h1 className="page-title flex items-center gap-2">
                    <Settings size={24} className="text-accent" />
                    {t.settings}
                </h1>
                <p className="text-text-secondary text-sm mt-1">Manage your profile and preferences</p>
            </div>


            {/* Profile */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <User size={18} className="text-accent" />
                    {t.profile}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.fullName}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.email}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.studentId}</label>
                        <input type="text" value={user?.student_id || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
                        <p className="text-xs text-text-muted mt-1">Contact administration to change</p>
                    </div>
                </div>
            </div>


            {/* Language */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <Globe size={18} className="text-accent2" />
                    {t.language}
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                    {t.languageHint}
                </p>
                <div className="grid grid-cols-3 gap-3">

                    {languages.map(({ code, name: langName, flag }) => (
                        <button
                            key={code}
                            onClick={() => setLanguage(code)}
                            className={`p-4 rounded-xl border text-center transition-all ${language === code
                                ? 'bg-accent-light border-accent/30 text-accent shadow-sm'
                                : 'bg-white border-border text-text-secondary hover:border-border-hover'
                                }`}
                        >
                            <p className="text-2xl mb-1">{flag}</p>
                            <p className="text-sm font-medium">{langName}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <Lock size={18} className="text-danger" />
                    {t.security}
                </h2>
                <div className="space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.currentPassword}</label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input-field pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                            >
                                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.newPassword}</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input-field"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">{t.confirmPassword}</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>


            {/* Notifications */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <Bell size={18} className="text-success" />
                    {t.notifications}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-primary">Schedule reminders</p>
                            <p className="text-xs text-text-muted">Get notified before classes start</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-accent' : 'bg-border'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>


            {error && (
                <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-danger text-sm">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="p-3 rounded-xl bg-success-light border border-success/20 text-success text-sm">
                    {successMsg}
                </div>
            )}


            <button
                onClick={handleSave}
                disabled={saving}
                className={`btn-primary flex items-center gap-2 ${saved ? 'bg-success hover:bg-success' : ''}`}
            >
                {saving ? (
                    <><Loader2 size={18} className="animate-spin" /> {t.saving}</>
                ) : saved ? (
                    <><Check size={18} /> {t.saved}</>
                ) : (
                    <><Save size={18} /> {t.saveChanges}</>
                )}
            </button>

        </div>
    )
}
