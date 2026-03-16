import { useState } from 'react'
import { useAdminStats, useImportSchedule } from '../hooks/useApi'
import { CardSkeleton } from '../components/Skeleton'
import {
    ShieldCheck, Upload, FileSpreadsheet, Users, Calendar,
    DoorOpen, MessageSquare, TrendingUp, Check, AlertCircle,
    Loader2, X,
} from 'lucide-react'

export default function AdminPage() {
    const { data: statsData, isLoading } = useAdminStats()
    const importMutation = useImportSchedule()
    const [dragOver, setDragOver] = useState(false)
    const [importResult, setImportResult] = useState<any>(null)

    const stats = statsData?.data

    const handleFile = async (file: File) => {
        if (!file) return
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'application/vnd.ms-excel',
        ]
        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|csv)$/i)) {
            setImportResult({ error: 'Please upload an .xlsx or .csv file' })
            return
        }
        try {
            const result = await importMutation.mutateAsync(file)
            setImportResult(result.data || result)
        } catch (err: any) {
            setImportResult({ error: err.response?.data?.message || 'Import failed' })
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
        e.target.value = ''
    }

    const barColors = ['bg-accent', 'bg-accent3', 'bg-success', 'bg-accent2', 'bg-danger']

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="page-title flex items-center gap-2">
                    <ShieldCheck size={24} className="text-accent3" />
                    Admin Panel
                </h1>
                <p className="text-text-secondary text-sm mt-1">Manage schedules, FAQs, and view usage stats</p>
            </div>

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
                                <span className="text-xs font-medium uppercase tracking-wider">Schedules</span>
                            </div>
                            <p className="text-2xl font-heading font-bold text-text-primary">{stats?.total_schedules || 0}</p>
                        </div>
                        <div className="stat-card">
                            <div className="flex items-center gap-2 text-accent2">
                                <DoorOpen size={16} />
                                <span className="text-xs font-medium uppercase tracking-wider">Rooms</span>
                            </div>
                            <p className="text-2xl font-heading font-bold text-text-primary">{stats?.total_rooms || 0}</p>
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
                {/* Import */}
                <div className="glass-card p-6">
                    <h2 className="section-title flex items-center gap-2 mb-4">
                        <FileSpreadsheet size={18} className="text-accent" />
                        Import Schedule
                    </h2>
                    <p className="text-sm text-text-secondary mb-4">
                        Upload an Excel (.xlsx) or CSV file with columns: Subject, Lecturer, Room, Day, Start, End, Group
                    </p>

                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver
                            ? 'border-accent bg-accent-light'
                            : 'border-border hover:border-border-hover'
                            }`}
                    >
                        <input type="file" accept=".xlsx,.csv" onChange={handleFileInput} className="hidden" id="schedule-upload" />
                        <label htmlFor="schedule-upload" className="cursor-pointer">
                            {importMutation.isPending ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 size={32} className="text-accent animate-spin" />
                                    <p className="text-sm text-text-secondary">Importing...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <Upload size={32} className="text-text-muted" />
                                    <p className="text-sm text-text-secondary">
                                        Drag & drop your file here or <span className="text-accent font-medium">browse</span>
                                    </p>
                                    <p className="text-xs text-text-muted">.xlsx or .csv files supported</p>
                                </div>
                            )}
                        </label>
                    </div>

                    {importResult && (
                        <div className={`mt-4 p-4 rounded-xl animate-slide-up ${importResult.error
                            ? 'bg-danger-light border border-danger/20'
                            : 'bg-success-light border border-success/20'
                            }`}>
                            {importResult.error ? (
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-danger">Import Failed</p>
                                        <p className="text-xs text-danger/80 mt-1">{importResult.error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <Check size={16} className="text-success shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-success">Import Successful</p>
                                        <div className="text-xs text-success/80 mt-1 space-y-0.5">
                                            <p>✓ {importResult.created || 0} entries created</p>
                                            <p>✓ {importResult.updated || 0} entries updated</p>
                                            {importResult.errors > 0 && (
                                                <p>⚠ {importResult.errors} errors skipped</p>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => setImportResult(null)} className="ml-auto p-1">
                                        <X size={14} className="text-success/50" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Usage Stats */}
                <div className="glass-card p-6">
                    <h2 className="section-title flex items-center gap-2 mb-4">
                        <TrendingUp size={18} className="text-success" />
                        Usage Statistics
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="skeleton h-4 w-24" />
                                    <div className="skeleton h-4 flex-1" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[
                                { label: 'Chat Messages Today', value: stats?.chats_today || 0, max: 100 },
                                { label: 'Active Users This Week', value: stats?.active_users_week || 0, max: 50 },
                                { label: 'Schedule Views Today', value: stats?.schedule_views_today || 0, max: 200 },
                                { label: 'Room Lookups Today', value: stats?.room_lookups_today || 0, max: 100 },
                                { label: 'FAQ Entries', value: stats?.total_faqs || 0, max: 50 },
                            ].map(({ label, value, max }, idx) => (
                                <div key={label}>
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-text-secondary">{label}</span>
                                        <span className="text-text-primary font-medium">{value}</span>
                                    </div>
                                    <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-1000`}
                                            style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
