import { useState, useMemo } from 'react'
import { useWeekSchedule } from '../hooks/useApi'
import { ScheduleBlockSkeleton } from '../components/Skeleton'
import {
    Calendar, Clock, MapPin, Users,
    MessageSquare, Bell, CheckCircle2, FileText, Link as LinkIcon,
    Coffee, Zap, ArrowRight, MoreVertical
} from 'lucide-react'
import CourseChat from '../components/CourseChat'
import { motion, AnimatePresence, Variants } from 'framer-motion'

const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ── variants ───────────────────────────────────────── */

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
}

const scheduleItemVariants: Variants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 26,
        }
    },
    exit: { x: 20, opacity: 0 },
}

const drawerVariants: Variants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        }
    },
    exit: {
        x: '100%',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        }
    },
}

/* ── component ──────────────────────────────────────── */

export default function SchedulePage() {
    const [view, setView] = useState<'today' | 'week'>('today')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [activeChat, setActiveChat] = useState<{ subject: string; groupName: string } | null>(null)
    const { data: scheduleData, isLoading } = useWeekSchedule()
    const schedule = scheduleData?.data || []

    const currentDayFull = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })

    const weekDates = useMemo(() => {
        const d = new Date(selectedDate)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        d.setDate(diff)
        return DAYS_FULL.map((_, i) => {
            const date = new Date(d)
            date.setDate(date.getDate() + i)
            return date
        })
    }, [selectedDate])

    const getScheduleForDay = (dayName: string) => {
        return schedule.filter((item: any) =>
            item.day_of_week?.toLowerCase() === dayName.toLowerCase()
        ).sort((a: any, b: any) => (a.start_time || '').localeCompare(b.start_time || ''))
    }

    const isCurrentTimeInRange = (start: string, end: string) => {
        const now = new Date()
        const [sH, sM] = start.split(':').map(Number)
        const [eH, eM] = end.split(':').map(Number)
        const startTime = new Date(now).setHours(sH, sM, 0)
        const endTime = new Date(now).setHours(eH, eM, 0)
        return now.getTime() >= startTime && now.getTime() <= endTime
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-10 pb-16 max-w-[1500px] mx-auto"
        >
            {/* MAIN CONTENT */}
            <div className="flex-1 space-y-10">

                {/* Academic Pulse Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-accent uppercase tracking-wide">Weekly Schedule</p>
                        <h1 className="text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
                            Academic <span className="text-accent">Pulse.</span>
                        </h1>
                    </div>

                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 backdrop-blur-sm shadow-sm">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView('today')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${view === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Today
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView('week')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${view === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Full Week
                        </motion.button>
                    </div>
                </motion.div>

                {/* Day Selector Strip */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {weekDates.map((date, idx) => {
                        const isSelected = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth()
                        const dayName = DAYS_FULL[idx]
                        const hasClasses = getScheduleForDay(dayName).length > 0

                        return (
                            <motion.button
                                layout
                                key={idx}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center justify-center w-20 py-4 rounded-2xl transition-all border shrink-0 ${isSelected
                                    ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20 scale-105'
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-red-100 hover:bg-red-50/30'
                                    }`}
                            >
                                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${isSelected ? 'text-red-100/80' : 'text-slate-400'}`}>
                                    {DAYS_SHORT[idx]}
                                </span>
                                <span className="text-xl font-black">{date.getDate()}</span>
                                {hasClasses && (
                                    <motion.div
                                        layoutId={`dot-${idx}`}
                                        className={`w-1.5 h-1.5 rounded-full mt-2 ${isSelected ? 'bg-lime-400' : 'bg-red-400/60'}`}
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </motion.div>

                {/* Schedule List Area */}
                <div className="relative pl-20 space-y-6 min-h-[600px]">
                    {/* Time Axis */}
                    <motion.div variants={itemVariants} className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between py-4 text-[11px] font-bold text-slate-300 pointer-events-none">
                        <span>08:00</span>
                        <span>10:00</span>
                        <span>12:00</span>
                        <span>14:00</span>
                        <span>16:00</span>
                        <span>18:00</span>
                    </motion.div>

                    {/* Vertical Line */}
                    <motion.div variants={itemVariants} className="absolute left-[70px] top-4 bottom-4 w-px bg-slate-100" />

                    {/* Classes */}
                    {isLoading ? (
                        <div className="space-y-4">
                            <ScheduleBlockSkeleton />
                            <ScheduleBlockSkeleton />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentDayFull}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6 relative"
                            >
                                {getScheduleForDay(currentDayFull).length === 0 ? (
                                    <motion.div
                                        variants={scheduleItemVariants}
                                        className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200"
                                    >
                                        <Calendar size={40} className="text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold uppercase text-xs tracking-wide">No classes scheduled</p>
                                    </motion.div>
                                ) : (
                                    getScheduleForDay(currentDayFull).map((item: any, idx: number) => {
                                        const isLive = isCurrentTimeInRange(item.start_time, item.end_time)

                                        return (
                                            <motion.div
                                                layout
                                                key={item.id || idx}
                                                variants={scheduleItemVariants}
                                                className="relative group"
                                            >
                                                {/* Activity Connector Dot */}
                                                <div className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10 border-4 border-white transition-all ${isLive ? 'bg-lime-400 scale-125 shadow-[0_0_10px_rgba(163,230,53,0.8)]' : 'bg-slate-200 group-hover:bg-accent'}`} />

                                                <motion.div
                                                    whileHover={{ x: 8 }}
                                                    className={`p-8 rounded-[28px] transition-all flex items-center justify-between shadow-sm overflow-hidden relative ${isLive
                                                        ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 ring-1 ring-accent/20'
                                                        : 'bg-white border border-slate-100 hover:border-red-100 hover:shadow-xl'
                                                        }`}
                                                >
                                                    {/* Live Background Pattern */}
                                                    {isLive && (
                                                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                                                            <Zap size={200} className="text-accent rotate-12 -mr-10 -mt-10" />
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-10 flex-1">
                                                        {/* Time & Type */}
                                                        <div className="space-y-1 shrink-0 w-24">
                                                            <p className={`text-sm font-black ${isLive ? 'text-accent' : 'text-slate-900'}`}>{item.start_time?.slice(0, 5)} — {item.end_time?.slice(0, 5)}</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-wide ${isLive ? 'text-slate-400' : 'text-slate-300'}`}>LECTURE</p>
                                                        </div>

                                                        {/* Left border accent */}
                                                        <div className={`h-12 w-1.5 rounded-full shrink-0 ${isLive ? 'bg-accent' : 'bg-red-200'}`} />

                                                        {/* Class Main Info */}
                                                        <div className="space-y-3 min-w-0">
                                                            {isLive && (
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                                                                    <span className="text-[10px] font-black text-lime-400 uppercase tracking-wide">Live Now</span>
                                                                </div>
                                                            )}
                                                            <h3 className={`text-xl font-black tracking-tight leading-tight truncate pr-4 ${isLive ? 'text-white' : 'text-slate-900'}`}>{item.subject}</h3>
                                                            <div className={`flex flex-wrap items-center gap-6 text-[11px] font-bold ${isLive ? 'text-slate-400' : 'text-slate-400'}`}>
                                                                <span className="flex items-center gap-2 uppercase tracking-wider"><MapPin size={14} className={isLive ? 'text-accent' : 'text-red-300'} /> Room {item.room?.number || '—'}</span>
                                                                <span className="flex items-center gap-2 uppercase tracking-wider"><Users size={14} className={isLive ? 'text-accent' : 'text-red-300'} /> {item.lecturer}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        {isLive ? (
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-6 py-3 bg-lime-400 text-slate-900 font-black text-[11px] uppercase tracking-wide rounded-xl transition-all shadow-lg shadow-lime-400/20"
                                                            >
                                                                Mark Attendance
                                                            </motion.button>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-center gap-2 mr-2">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        className="p-2.5 rounded-lg bg-slate-50 text-slate-400 transition-colors"
                                                                        title="Download Material"
                                                                    >
                                                                        <FileText size={18} />
                                                                    </motion.button>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1, backgroundColor: '#f1f5f9' }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        className="p-2.5 rounded-lg bg-slate-50 text-slate-400 transition-colors"
                                                                        title="Join Link"
                                                                    >
                                                                        <LinkIcon size={18} />
                                                                    </motion.button>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => setActiveChat({ subject: item.subject, groupName: item.group_name })}
                                                                    className="p-3 rounded-xl bg-red-50 text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
                                                                >
                                                                    <MessageSquare size={18} />
                                                                </motion.button>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* Insert a break block if this is the 10:00 block */}
                                                {item.start_time?.startsWith('10:') && (
                                                    <motion.div variants={itemVariants} className="mt-6 mb-6 relative">
                                                        <div className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                        <div className="p-6 border-2 border-dashed border-slate-100 rounded-[28px] flex items-center justify-center gap-4 bg-slate-50/20">
                                                            <Coffee size={20} className="text-slate-300" />
                                                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">Self-Study & Social Window</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )
                                    })
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* SIDEBAR - DEADLINES */}
            <aside className="w-[360px] space-y-8">
                <motion.div
                    variants={itemVariants}
                    className="bg-slate-50 rounded-[32px] border border-slate-100/50 p-8 space-y-10 lg:sticky lg:top-8 shadow-sm"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-accent">
                                <CheckCircle2 size={24} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Deadlines</h2>
                        </div>
                        <button className="p-2 text-slate-400">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    {/* Deadline Cards */}
                    <div className="space-y-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/40 space-y-4 border border-slate-100"
                        >
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-wide">Due Tomorrow</p>
                                <div className="p-1.5 bg-red-50 text-red-500 rounded-lg">
                                    <Bell size={14} />
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 leading-tight">UX Prototype Submission - Advanced Design Systems</h3>

                            {/* Progress bar */}
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                                    <span>Progress</span>
                                    <span>80%</span>
                                </div>
                                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '80%' }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-red-400 rounded-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ opacity: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm space-y-3 opacity-60 border border-slate-100"
                        >
                            <p className="text-[10px] font-black text-red-300 uppercase tracking-wide">In 3 Days</p>
                            <h3 className="text-sm font-bold text-slate-700 leading-tight">Cognitive Psychology Essay - Research Phase</h3>
                        </motion.div>
                    </div>

                    <motion.button
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 border-2 border-slate-200 border-dashed rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
                    >
                        View All Tasks <ArrowRight size={14} />
                    </motion.button>
                </motion.div>
            </aside>

            {/* Side Drawer for Chat */}
            <AnimatePresence>
                {activeChat && (
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                            onClick={() => setActiveChat(null)}
                        />
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-sm h-full bg-white border-l border-slate-100 shadow-2xl"
                        >
                            <CourseChat
                                subject={activeChat.subject}
                                groupName={activeChat.groupName}
                                onClose={() => setActiveChat(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
