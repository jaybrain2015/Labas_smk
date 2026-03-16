import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from './Sidebar'
import { Menu, Search, Bell, X } from 'lucide-react'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-bg relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div className="lg:ml-[240px] flex min-h-screen">
                {/* Center Content */}
                <main className="flex-1 p-6 lg:p-10 max-w-[1000px] mx-auto">
                    {/* Top bar replacement (minimal) */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest">
                            Dashboard
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

                {/* Right Sidebar (Requests) */}
                <aside className="hidden xl:flex w-[320px] bg-white border-l border-border/50 flex-col p-6 sticky top-0 h-screen overflow-y-auto">
                    {/* Search Panel */}
                    <div className="relative mb-8">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-[#f4f7fa] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-sidebar-red/20 transition-all font-medium"
                        />
                    </div>

                    {/* Requests Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-text-primary">Requests</h3>
                            <span className="bg-sidebar-red/10 text-sidebar-red text-[10px] font-bold px-2 py-0.5 rounded-full">24</span>
                        </div>
                        <button className="text-text-muted hover:text-text-primary transition-colors">
                            <Menu size={18} />
                        </button>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white border border-border/40 rounded-2xl p-4 hover:shadow-card transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-text-primary truncate uppercase tracking-tight">Design UI/UX for X...</h4>
                                        <p className="text-[10px] text-text-muted truncate">Project: Agreement ↓</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 bg-sidebar-red text-white rounded-lg hover:opacity-90 transition-opacity">
                                        <X size={14} />
                                    </button>
                                    <button className="p-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                                        <Menu size={14} className="rotate-90 pointer-events-none" />
                                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-8 text-sidebar-red text-xs font-bold uppercase tracking-widest hover:underline w-full text-center">
                        See More
                    </button>
                </aside>
            </div>
        </div>
    )
}
