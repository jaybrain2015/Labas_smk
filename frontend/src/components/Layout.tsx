import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from './Sidebar'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import LanguageSelector from './LanguageSelector'
import { useTranslation, Language } from '../lib/translations'



const pageTitleKeys: Record<string, string> = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/chat': 'chat',
    '/schedule': 'schedule',
    '/rooms': 'rooms',
    '/events': 'events',
    '/settings': 'settings',
    '/admin': 'admin',
}


const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)
    const location = useLocation()
    const titleKey = pageTitleKeys[location.pathname] || 'dashboard'
    const pageTitle = (t as any)[titleKey] || titleKey


    return (
        <div className="min-h-screen bg-bg relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div className="lg:ml-[240px] min-h-screen">
                <main className="flex-1 p-6 lg:p-10 max-w-[1100px] mx-auto">
                    {/* Top bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex items-center justify-between mb-8"
                    >
                        <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest">
                            {pageTitle}
                        </h2>
                        <div className="flex items-center gap-3">
                            <LanguageSelector />

                            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-text-secondary hidden sm:block">
                                    {t.welcomeBack}, <span className="text-sidebar-red font-bold">{user?.name?.split(' ')[0] || 'User'}</span>
                                </span>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-10 h-10 rounded-full bg-sidebar-red/10 border-2 border-white overflow-hidden shadow-sm pointer-events-auto cursor-pointer"
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=e63946&color=fff`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-2 text-text-secondary hover:text-sidebar-red transition-colors"
                                >
                                    <Bell size={20} />
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-sidebar-red rounded-full border-2 border-[#f4f7fa]" />
                                </motion.button>
                            </div>
                        </div>

                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
