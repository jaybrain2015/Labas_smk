import { useState } from 'react'
import { useAdminStats, useImportSchedule, useImportStudents } from '../hooks/useApi'
import { CardSkeleton } from '../components/Skeleton'
import {
    ShieldCheck, Upload, FileSpreadsheet, Users, Calendar,
    DoorOpen, MessageSquare, TrendingUp, Check, AlertCircle,
    Loader2, X, UserPlus, HelpCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import EventManagement from '../components/admin/EventManagement'
import FaqManagement from '../components/admin/FaqManagement'

export default function AdminPage() {
    const { data: statsData, isLoading } = useAdminStats()
    const scheduleMutation = useImportSchedule()
    const studentMutation = useImportStudents()
    const [activeTab, setActiveTab] = useState<'stats' | 'events' | 'kb'>('stats')
    const [dragOver, setDragOver] = useState<'schedule' | 'student' | null>(null)
    const [scheduleResult, setScheduleResult] = useState<any>(null)
    const [studentResult, setStudentResult] = useState<any>(null)

    const stats = statsData?.data

    const handleScheduleFile = async (file: File) => {
        if (!file) return
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel']
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|csv)$/i)) {
            setScheduleResult({ error: 'Please upload an .xlsx or .csv file' })
            return
        }
        try {
            const result = await scheduleMutation.mutateAsync(file)
            setScheduleResult(result.data || result)
        } catch (err: any) {
            setScheduleResult({ error: err.response?.data?.message || 'Import failed' })
        }
    }

    const handleStudentFile = async (file: File) => {
        if (!file) return
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel']
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|csv)$/i)) {
            setStudentResult({ error: 'Please upload an .xlsx or .csv file' })
            return
        }
        try {
            const result = await studentMutation.mutateAsync(file)
            setStudentResult(result.data || result)
        } catch (err: any) {
            setStudentResult({ error: err.response?.data?.message || 'Import failed' })
        }
    }

    const barColors = ['bg-accent', 'bg-accent3', 'bg-success', 'bg-accent2', 'bg-danger']

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <ShieldCheck size={24} className="text-accent3" />
                        Admin Panel
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">Manage schedules, events, and view usage stats</p>
                </div>

                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-border self-start">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'stats'
                            ? 'bg-accent3 text-white shadow-md'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <TrendingUp size={14} /> Stats & Imports
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'events'
                            ? 'bg-accent text-white shadow-md'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <Calendar size={14} /> Events & Editorial
                    </button>
                    <button
                        onClick={() => setActiveTab('kb')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'kb'
                            ? 'bg-secondary text-white shadow-md'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <HelpCircle size={14} /> Knowledge Base
                    </button>
                </div>
            </div>

            {activeTab === 'stats' ? (
                <div className="space-y-6">
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                        ) : (
                            <>
                                <div className="stat-card">
                                    <div className="flex items-center gap-2 text-accent3">
                                        <Users size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Total Users</span>
                                    </div>
                                    <p className="text-2xl font-heading font-bold text-text-primary">{stats?.total_users || 0}</p>
                                </div>
                                <div className="stat-card">
                                    <div className="flex items-center gap-2 text-success">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Events Today</span>
                                    </div>
                                    <p className="text-2xl font-heading font-bold text-text-primary">{stats?.events_today || 0}</p>
                                </div>
                                <div className="stat-card">
                                    <div className="flex items-center gap-2 text-accent2">
                                        <TrendingUp size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Active Today</span>
                                    </div>
                                    <p className="text-2xl font-heading font-bold text-text-primary">{stats?.active_users_today || 0}</p>
                                </div>
                                <div className="stat-card">
                                    <div className="flex items-center gap-2 text-accent">
                                        <MessageSquare size={16} />
                                        <span className="text-xs font-medium uppercase tracking-wider">Chat Sessions</span>
                                    </div>
                                    <p className="text-2xl font-heading font-bold text-text-primary">{stats?.total_chats || 0}</p>
                                </div>

                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Schedule Import */}
                        <div className="glass-card p-6">
                            <h2 className="section-title flex items-center gap-2 mb-4">
                                <FileSpreadsheet size={18} className="text-accent" />
                                Import Schedule
                            </h2>
                            <p className="text-sm text-text-secondary mb-4">
                                Upload an .xlsx or .csv file
                            </p>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver('schedule') }}
                                onDragLeave={() => setDragOver(null)}
                                onDrop={(e) => {
                                    e.preventDefault(); setDragOver(null)
                                    const file = e.dataTransfer.files[0]; if (file) handleScheduleFile(file)
                                }}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver === 'schedule'
                                    ? 'border-accent bg-accent-light'
                                    : 'border-border hover:border-border-hover'
                                    }`}
                            >
                                <input type="file" accept=".xlsx,.csv" onChange={(e) => {
                                    const file = e.target.files?.[0]; if (file) handleScheduleFile(file)
                                    e.target.value = ''
                                }} className="hidden" id="schedule-upload" />
                                <label htmlFor="schedule-upload" className="cursor-pointer">
                                    {scheduleMutation.isPending ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-accent animate-spin" />
                                            <p className="text-sm text-text-secondary">Importing...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload size={32} className="text-text-muted" />
                                            <p className="text-sm text-text-secondary">
                                                Drag & drop file or <span className="text-accent font-medium">browse</span>
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {scheduleResult && (
                                <div className={`mt-4 p-4 rounded-xl animate-slide-up ${scheduleResult.error ? 'bg-danger-light border border-danger/20' : 'bg-success-light border border-success/20'}`}>
                                    <div className="flex items-start gap-2">
                                        {scheduleResult.error ? <AlertCircle size={16} className="text-danger mt-0.5" /> : <Check size={16} className="text-success mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="text-xs font-bold mb-1">{scheduleResult.error ? 'Import Failed' : 'Import Complete'}</p>
                                            {!scheduleResult.error && (
                                                <p className="text-[10px] leading-tight">
                                                    Created: <span className="font-bold">{scheduleResult.created}</span>,
                                                    Updated: <span className="font-bold">{scheduleResult.updated}</span>,
                                                    Errors: <span className="font-bold text-danger">{scheduleResult.errors}</span>
                                                </p>
                                            )}
                                            {scheduleResult.error && <p className="text-[10px]">{scheduleResult.error}</p>}
                                        </div>
                                        <button onClick={() => setScheduleResult(null)} className="ml-auto"><X size={14} /></button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Student Import */}
                        <div className="glass-card p-6">
                            <h2 className="section-title flex items-center gap-2 mb-4">
                                <UserPlus size={18} className="text-accent3" />
                                Import Students
                            </h2>
                            <p className="text-sm text-text-secondary mb-4">
                                Upload student list (.xlsx or .csv)
                            </p>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver('student') }}
                                onDragLeave={() => setDragOver(null)}
                                onDrop={(e) => {
                                    e.preventDefault(); setDragOver(null)
                                    const file = e.dataTransfer.files[0]; if (file) handleStudentFile(file)
                                }}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver === 'student'
                                    ? 'border-accent3 bg-accent3-light'
                                    : 'border-border hover:border-border-hover'
                                    }`}
                            >
                                <input type="file" accept=".xlsx,.csv" onChange={(e) => {
                                    const file = e.target.files?.[0]; if (file) handleStudentFile(file)
                                    e.target.value = ''
                                }} className="hidden" id="student-upload" />
                                <label htmlFor="student-upload" className="cursor-pointer">
                                    {studentMutation.isPending ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-accent3 animate-spin" />
                                            <p className="text-sm text-text-secondary">Importing...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <Upload size={32} className="text-text-muted" />
                                            <p className="text-sm text-text-secondary">
                                                Drag & drop file or <span className="text-accent3 font-medium">browse</span>
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {studentResult && (
                                <div className={`mt-4 p-4 rounded-xl animate-slide-up ${studentResult.error ? 'bg-danger-light border border-danger/20' : 'bg-success-light border border-success/20'}`}>
                                    <div className="flex items-start gap-2">
                                        {studentResult.error ? <AlertCircle size={16} className="text-danger mt-0.5" /> : <Check size={16} className="text-success mt-0.5" />}
                                        <div className="flex-1">
                                            <p className="text-xs font-bold mb-1">{studentResult.error ? 'Import Failed' : 'Import Complete'}</p>
                                            {!studentResult.error && (
                                                <p className="text-[10px] leading-tight">
                                                    Created: <span className="font-bold">{studentResult.created}</span>,
                                                    Updated: <span className="font-bold">{studentResult.updated}</span>,
                                                    Errors: <span className="font-bold text-danger">{studentResult.errors}</span>
                                                </p>
                                            )}
                                            {studentResult.error && <p className="text-[10px]">{studentResult.error}</p>}
                                        </div>
                                        <button onClick={() => setStudentResult(null)} className="ml-auto"><X size={14} /></button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Usage Stats - moved here for layout */}
                        <div className="glass-card p-6 lg:col-span-2">
                            <h2 className="section-title flex items-center gap-2 mb-4">
                                <TrendingUp size={18} className="text-success" />
                                Usage Statistics
                            </h2>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3"><div className="skeleton h-4 w-24" /><div className="skeleton h-4 flex-1" /></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {[
                                        { label: 'Messages Today', value: stats?.chats_today || 0, max: 100 },
                                        { label: 'Active Today', value: stats?.active_users_today || 0, max: 50 },
                                        { label: 'New Registrations', value: stats?.new_registrations_today || 0, max: 50 },
                                        { label: 'Room Lookups', value: stats?.room_lookups_today || 0, max: 100 },
                                        { label: 'Schedule Views', value: stats?.schedule_views_today || 0, max: 200 },
                                    ].map(({ label, value, max }, idx) => (

                                        <div key={label}>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-text-secondary">{label}</span>
                                                <span className="text-text-primary font-medium">{value}</span>
                                            </div>
                                            <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-1000`}
                                                    style={{ width: `${Math.min((value / (max || 1)) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : activeTab === 'events' ? (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="animate-fade-in"
                >
                    <EventManagement />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="animate-fade-in"
                >
                    <FaqManagement />
                </motion.div>
            )}
        </div>
    )
}
