import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTranslation, Language } from '../lib/translations'
import LanguageSelector from './LanguageSelector'
import {
    LayoutDashboard,
    MessageSquare,
    Calendar,
    DoorOpen,
    CalendarDays,
    Settings,
    ShieldCheck,
    LogOut,
    GraduationCap,
    X,
    Menu,
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

import labsLogo from '../assets/labs-smk-logo.webp'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { to: '/chat', icon: MessageSquare, labelKey: 'chat' },
    { to: '/schedule', icon: Calendar, labelKey: 'schedule' },
    { to: '/rooms', icon: DoorOpen, labelKey: 'rooms' },
    { to: '/events', icon: CalendarDays, labelKey: 'events' },
    { to: '/settings', icon: Settings, labelKey: 'settings' },
]


const sidebarVariants: Variants = {
    open: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    closed: {
        x: '-100%',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
}

const navContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const navItemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)


    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                className={`fixed top-0 left-0 h-full bg-[#9b1c1c] shadow-sidebar
                    flex flex-col z-50 w-[240px] lg:translate-x-0 !transform-none lg:!translate-x-0`}
                style={{
                    x: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : undefined
                }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center h-24 px-6 shrink-0"
                >
                    <div className="flex items-center gap-3">
                        <img src={labsLogo} alt="Labas SMK" className="w-14 h-14 rounded-xl object-contain bg-white" />
                        <h1 className="text-xl font-heading font-bold text-white tracking-tight">
                            Labas SMK
                        </h1>
                    </div>
                </motion.div>

                {/* Navigation */}
                <motion.nav
                    variants={navContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 px-4 py-10 flex flex-col gap-1 overflow-y-auto"
                >
                    {navItems.map(({ to, icon: Icon, labelKey }) => (
                        <motion.div key={to} variants={navItemVariants}>
                            <NavLink
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `sidebar-nav-item group ${isActive ? 'active' : ''}`
                                }
                            >
                                <div className="sidebar-curve-top" />
                                <Icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-bold text-sm tracking-tight">{(t as any)[labelKey]}</span>
                                <div className="sidebar-curve-bottom" />
                            </NavLink>
                        </motion.div>
                    ))}


                    {user?.role === 'admin' && (
                        <motion.div variants={navItemVariants}>
                            <NavLink
                                to="/admin"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `sidebar-nav-item group mt-2 ${isActive ? 'active' : ''}`
                                }
                            >
                                <div className="sidebar-curve-top" />
                                <ShieldCheck size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-bold text-sm tracking-tight">{t.admin}</span>
                                <div className="sidebar-curve-bottom" />
                            </NavLink>
                        </motion.div>
                    )}

                </motion.nav>

                {/* Logout */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 border-t border-white/10 shrink-0"
                >
                    <motion.button
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/80 hover:text-white transition-all duration-200"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className="font-medium text-sm">{t.logout}</span>
                    </motion.button>

                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                            {user?.role || 'User'}
                        </p>
                    </div>
                </motion.div>
            </motion.aside>
        </>
    )
}