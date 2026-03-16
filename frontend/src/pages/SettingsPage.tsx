import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import {
    Settings, User, Globe, Bell, Save, Loader2, Check,
} from 'lucide-react'

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export default function SettingsPage() {
    const { user, setUser } = useAuthStore()
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [language, setLanguage] = useState(user?.language_preference || 'en')
    const [notifications, setNotifications] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSaved(false)

        try {
            const { data } = await api.put('/auth/me', { name, email, language_preference: language })
            if (data.success) {
                setUser(data.data)
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
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
                    Settings
                </h1>
                <p className="text-text-secondary text-sm mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <User size={18} className="text-accent" />
                    Profile
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Student ID</label>
                        <input type="text" value={user?.student_id || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
                        <p className="text-xs text-text-muted mt-1">Contact administration to change</p>
                    </div>
                </div>
            </div>

            {/* Language */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <Globe size={18} className="text-accent2" />
                    Language Preference
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                    The AI assistant will respond in your preferred language
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

            {/* Notifications */}
            <div className="glass-card p-6">
                <h2 className="section-title flex items-center gap-2 mb-5">
                    <Bell size={18} className="text-success" />
                    Notifications
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

            <button
                onClick={handleSave}
                disabled={saving}
                className={`btn-primary flex items-center gap-2 ${saved ? 'bg-success hover:bg-success' : ''}`}
            >
                {saving ? (
                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                ) : saved ? (
                    <><Check size={18} /> Saved!</>
                ) : (
                    <><Save size={18} /> Save Changes</>
                )}
            </button>
        </div>
    )
}
