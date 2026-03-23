import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from './Sidebar'
import { Bell } from 'lucide-react'

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/chat': 'AI Chat',
    '/schedule': 'Schedule',
    '/rooms': 'Rooms',
    '/events': 'Events',
    '/settings': 'Settings',
    '/admin': 'Admin',
}

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuthStore()
    const location = useLocation()
    const pageTitle = pageTitles[location.pathname] || 'Dashboard'

    return (
        <div className="min-h-screen bg-bg relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div className="lg:ml-[240px] min-h-screen">
                <main className="flex-1 p-6 lg:p-10 max-w-[1100px] mx-auto">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest">
                            {pageTitle}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-text-secondary">
                                Welcome back, <span className="text-sidebar-red font-bold">{user?.name?.split(' ')[0] || 'User'}</span>
                            </span>
                            <div className="w-10 h-10 rounded-full bg-sidebar-red/10 border-2 border-white overflow-hidden shadow-sm">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=e63946&color=fff`}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="relative p-2 text-text-secondary hover:text-sidebar-red transition-colors">
                                <Bell size={20} />
                                <div className="absolute top-1 right-1 w-2 h-2 bg-sidebar-red rounded-full border-2 border-[#f4f7fa]" />
                            </button>
                        </div>
                    </div>

                    <Outlet />
                </main>
            </div>
        </div>
    )
}
