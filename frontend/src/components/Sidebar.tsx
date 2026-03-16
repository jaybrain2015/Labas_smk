import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
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

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/rooms', icon: DoorOpen, label: 'Rooms' },
    { to: '/events', icon: CalendarDays, label: 'Events' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full bg-[#9b1c1c] shadow-sidebar
                    flex flex-col z-50 transition-all duration-300
                    w-[240px] lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className="flex items-center h-24 px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <GraduationCap size={22} className="text-[#9b1c1c]" />
                        </div>
                        <h1 className="text-xl font-heading font-bold text-white tracking-tight">
                            Sahara
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-10 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-nav-item group ${isActive ? 'active' : ''}`
                            }
                        >
                            <div className="sidebar-curve-top" />
                            <Icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-bold text-sm tracking-tight">{label}</span>
                            <div className="sidebar-curve-bottom" />
                        </NavLink>
                    ))}

                    {user?.role === 'admin' && (
                        <NavLink
                            to="/admin"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-nav-item group mt-2 ${isActive ? 'active' : ''}`
                            }
                        >
                            <div className="sidebar-curve-top" />
                            <ShieldCheck size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-bold text-sm tracking-tight">Admin</span>
                            <div className="sidebar-curve-bottom" />
                        </NavLink>
                    )}
                </nav>

                {/* Logout */}
                <div className="p-6 border-t border-white/10 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                    <div className="mt-6 flex flex-col items-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                            {user?.role || 'User'}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    )
}