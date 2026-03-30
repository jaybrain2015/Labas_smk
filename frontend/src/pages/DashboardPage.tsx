import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMySchedule, useRoomAvailability, useUpcomingEvents, useSendMessage } from '../hooks/useApi'
import {
    Calendar, Sparkles, Send, Clock, MapPin, Users,
    ArrowRight, Bot, Loader2, X, Zap, DoorOpen,
    Newspaper,
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

import campusBg from '../assets/campus-bg.webp'
import editorialVrLab from '../assets/editorial-vr-lab.png'
import editorialVolunteering from '../assets/editorial-volunteering.png'
import editorialInternship from '../assets/editorial-internship.png'
import eventSummit from '../assets/event-summit.png'

/* ── helpers ────────────────────────────────────────── */

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
}

const quickChips = [
    '"Where is my next class?"',
    '"Is the library open?"',
    '"Academic deadlines"',
]

const editorialArticles = [
    {
        img: editorialVrLab,
        category: 'FACULTY OF CREATIVE TECH · AN ADO',
        title: 'New VR Lab Opening Ceremony next Tuesday',
    },
    {
        img: editorialVolunteering,
        category: 'STUDENT COUNCIL · WEDNESDAY',
        title: 'Volunteering Week: How you can make an Impact',
    },
    {
        img: editorialInternship,
        category: 'CAREER CENTRE · EVENTS HUB',
        title: 'Internship Fair: Top 50 Lithuanian Startups',
    },
]

/* ── variants ───────────────────────────────────────── */

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
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

/* ── component ──────────────────────────────────────── */

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { data: scheduleData, isLoading: schedLoading } = useMySchedule()
    const { data: roomsData, isLoading: roomsLoading } = useRoomAvailability()
    const { data: eventsData } = useUpcomingEvents()
    const sendMutation = useSendMessage()

    const [chatInput, setChatInput] = useState('')
    const [chatResponse, setChatResponse] = useState<string | null>(null)
    const [chatLoading, setChatLoading] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)

    const schedule = scheduleData?.data || []
    const freeRooms = (roomsData?.data || []).filter((r: any) => r.status === 'free').slice(0, 2)
    const nextEvent = (eventsData?.data || [])[0]
    const firstName = user?.name?.split(' ')[0] || 'Student'

    const handleChat = async (text?: string) => {
        const message = text || chatInput.trim()
        if (!message) return
        setChatInput('')
        setChatLoading(true)
        setChatResponse(null)
        try {
            const result = await sendMutation.mutateAsync(message)
            setChatResponse(result.data?.response || 'Sorry, I couldn\'t process that.')
        } catch {
            setChatResponse('Something went wrong. Please try again.')
        } finally {
            setChatLoading(false)
        }
    }

    /* next immediate class */
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const nextClass = schedule.find((s: any) => s.start_time > currentTime) || schedule[0]

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-10"
        >
            {/* ═══════════════════════════════════════════════
                1. HERO BANNER
            ═══════════════════════════════════════════════ */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl h-[280px] md:h-[320px]">
                {/* Background image */}
                <img
                    src={campusBg}
                    alt="SMK Campus"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/80 via-[#1a1a2e]/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-heading font-extrabold text-white leading-tight"
                    >
                        Labas, <span className="text-[#f4a261]">{firstName}.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/70 mt-3 text-sm md:text-base max-w-md"
                    >
                        {getGreeting()}! Your academic journey continues today
                        with {schedule.length} scheduled session{schedule.length !== 1 ? 's' : ''}.
                    </motion.p>
                </div>

                {/* Next Immediate card */}
                {nextClass && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute top-6 right-6 md:top-8 md:right-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-[220px] hidden md:block"
                    >
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-2">Next Immediate</p>
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#9b1c1c] flex items-center justify-center shrink-0">
                                <Zap size={16} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-tight">{nextClass.subject}</p>
                                <p className="text-xs text-white/60 mt-0.5">
                                    {nextClass.start_time?.slice(0, 5)} · {nextClass.room?.number || 'TBA'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* ═══════════════════════════════════════════════
                2. MAIN GRID — Today's Pulse + Right Column
            ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* ── LEFT: Today's Pulse (3 cols) ─────────── */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title">Today's Pulse</h2>
                        <button
                            onClick={() => navigate('/schedule')}
                            className="text-xs text-[#9b1c1c] font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            Full Calendar <ArrowRight size={14} />
                        </button>
                    </div>

                    {schedLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-2xl bg-white animate-pulse shadow-card">
                                    <div className="skeleton h-3 w-24 mb-2" />
                                    <div className="skeleton h-4 w-40 mb-1" />
                                    <div className="skeleton h-3 w-28" />
                                </div>
                            ))}
                        </div>
                    ) : schedule.length === 0 ? (
                        <div className="text-center py-14 bg-white rounded-2xl shadow-card">
                            <Calendar size={36} className="mx-auto text-text-muted mb-3" />
                            <p className="text-sm text-text-secondary">No classes today</p>
                            <p className="text-xs text-text-muted mt-1">Enjoy your free day! 🎉</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            className="space-y-3"
                        >
                            {schedule.map((item: any, idx: number) => {
                                const isUpcoming = item.start_time > currentTime
                                const isNext = item === nextClass && isUpcoming
                                return (
                                    <motion.div
                                        key={item.id || idx}
                                        variants={itemVariants}
                                        whileHover={{ x: 5 }}
                                        className={`p-4 rounded-2xl transition-all ${isNext
                                            ? 'bg-[#9b1c1c] text-white shadow-lg'
                                            : 'bg-white shadow-card hover:shadow-card-hover border border-border'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-xs font-medium ${isNext ? 'text-white/60' : 'text-text-muted'}`}>
                                                {item.start_time?.slice(0, 5)} — {item.end_time?.slice(0, 5)}
                                            </p>
                                            <AnimatePresence>
                                                {isNext && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                                                    >
                                                        ● Upcoming in 45m
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                            {!isNext && (
                                                <span className={`text-xs font-heading font-bold ${isNext ? 'text-white/80' : 'text-text-muted'}`}>
                                                    {item.start_time?.slice(0, 5)}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-bold font-heading ${isNext ? 'text-white' : 'text-text-primary'}`}>
                                            {item.subject}
                                        </p>
                                        <div className={`flex items-center gap-3 mt-1.5 text-xs ${isNext ? 'text-white/60' : 'text-text-muted'}`}>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={11} /> {item.room?.number || '—'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={11} /> {item.lecturer}
                                            </span>
                                        </div>
                                        {item.type === 'remote' && (
                                            <p className={`text-[10px] mt-1 ${isNext ? 'text-white/50' : 'text-text-muted'}`}>
                                                📡 Remote Session
                                            </p>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </motion.div>

                {/* ── RIGHT COLUMN (3 cols) ─────────────────── */}
                <div className="lg:col-span-3 space-y-6">

                    {/* AI Assistant Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-[#1a1a2e] rounded-2xl p-6 text-white overflow-hidden relative"
                    >
                        <div className="flex items-start gap-4">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="w-11 h-11 rounded-xl bg-[#9b1c1c] flex items-center justify-center shrink-0"
                            >
                                <Bot size={20} className="text-white" />
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-heading font-bold">
                                    How can I assist your studies today?
                                </h3>
                                <p className="text-sm text-white/50 mt-1">
                                    AI Assistant is ready to help you navigate campus and courses.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {quickChips.map((chip) => (
                                <motion.button
                                    key={chip}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleChat(chip.replace(/"/g, ''))}
                                    className="px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/70
                                        transition-all"
                                >
                                    {chip}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Study Spaces + Featured Event */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Study Spaces */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 shadow-card border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-heading font-bold text-text-primary">Study Spaces</h3>
                                <span className="text-[9px] bg-[#9b1c1c]/10 text-[#9b1c1c] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Live Status
                                </span>
                            </div>

                            {roomsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="skeleton h-12 w-full rounded-xl" />
                                    ))}
                                </div>
                            ) : freeRooms.length === 0 ? (
                                <div className="text-center py-6">
                                    <DoorOpen size={24} className="mx-auto text-text-muted mb-2" />
                                    <p className="text-xs text-text-muted">No free rooms right now</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {freeRooms.map((room: any) => (
                                        <div key={room.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#9b1c1c]/5 flex items-center justify-center">
                                                    <DoorOpen size={16} className="text-[#9b1c1c]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">{room.number || room.name}</p>
                                                    <p className="text-[10px] text-text-muted">
                                                        {room.capacity ? `${room.capacity} capacity` : 'Available'}
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/rooms')}
                                                className="px-3 py-1.5 bg-[#9b1c1c] text-white text-[10px] font-bold rounded-full hover:bg-[#7f1d1d] transition-colors"
                                            >
                                                Quick Reserve
                                            </motion.button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Featured Event */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="relative overflow-hidden rounded-2xl h-[200px] md:h-auto group cursor-pointer shadow-card border border-border"
                            onClick={() => navigate('/events')}
                        >
                            <img
                                src={eventSummit}
                                alt="SMK Innovation Summit"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-[9px] bg-[#9b1c1c] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                                >
                                    This Friday
                                </motion.span>
                                <h3 className="text-white font-heading font-bold mt-2 text-sm leading-snug">
                                    {nextEvent?.title || 'SMK Innovation Summit 2026'}
                                </h3>
                                <p className="text-white/50 text-[10px] mt-1">
                                    Networking, Workshops & Keynotes
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                3. CAMPUS EDITORIAL
            ═══════════════════════════════════════════════ */}
            <motion.div variants={itemVariants}>
                <p className="text-[10px] text-[#9b1c1c] font-bold uppercase tracking-[0.2em] mb-1">Stay Informed</p>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-text-primary mb-6">Campus Editorial</h2>

                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {editorialArticles.map((article, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="group cursor-pointer"
                            onClick={() => navigate('/events')}
                        >
                            <div className="overflow-hidden rounded-2xl h-[200px] mb-3 shadow-card border border-border">
                                <img
                                    src={article.img}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <p className="text-[9px] text-text-muted uppercase tracking-wider font-medium">
                                {article.category}
                            </p>
                            <h3 className="text-sm font-heading font-bold text-text-primary mt-1 leading-snug group-hover:text-[#9b1c1c] transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* ═══════════════════════════════════════════════
                4. FLOATING AI CHAT WIDGET
            ═══════════════════════════════════════════════ */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Chat panel */}
                <AnimatePresence>
                    {chatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="absolute bottom-18 right-0 w-[360px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden mb-4"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border bg-[#9b1c1c]/5">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-[#9b1c1c]" />
                                    <h3 className="text-sm font-bold text-text-primary">AI Assistant</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className="text-[10px] text-[#9b1c1c] font-medium hover:underline"
                                    >
                                        Full chat →
                                    </button>
                                    <button
                                        onClick={() => setChatOpen(false)}
                                        className="p-1 rounded-lg hover:bg-bg-hover transition-colors text-text-muted"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Quick chips */}
                            <div className="flex flex-wrap gap-1.5 p-3 border-b border-border/50">
                                {[
                                    { label: 'My schedule today', icon: Calendar },
                                    { label: 'Free rooms now', icon: MapPin },
                                    { label: 'Library hours', icon: Clock },
                                ].map(({ label, icon: Icon }) => (
                                    <motion.button
                                        key={label}
                                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(155, 28, 28, 0.05)' }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleChat(label)}
                                        disabled={chatLoading}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-hover border border-border
                                            text-[11px] text-text-secondary hover:text-[#9b1c1c] hover:border-[#9b1c1c]/30 transition-all disabled:opacity-50"
                                    >
                                        <Icon size={10} />
                                        {label}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Response area */}
                            <div className="p-4 min-h-[100px] max-h-[250px] overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {chatLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-[#9b1c1c]/10 flex items-center justify-center shrink-0">
                                                <Bot size={12} className="text-[#9b1c1c]" />
                                            </div>
                                            <div className="bg-bg-hover border border-border rounded-2xl rounded-bl-md px-3 py-2">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1.4 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-text-muted"
                                                    />
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-text-muted"
                                                    />
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-text-muted"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : chatResponse ? (
                                        <motion.div
                                            key="response"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-[#9b1c1c]/10 flex items-center justify-center shrink-0">
                                                <Bot size={12} className="text-[#9b1c1c]" />
                                            </div>
                                            <div className="bg-bg-hover border border-border rounded-2xl rounded-bl-md px-3 py-2.5 text-xs text-text-primary leading-relaxed">
                                                {chatResponse}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center text-center py-4"
                                        >
                                            <Bot size={24} className="text-text-muted mb-2" />
                                            <p className="text-[11px] text-text-muted">Ask a question or tap a suggestion</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input */}
                            <div className="flex gap-2 p-3 border-t border-border">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleChat()
                                        }
                                    }}
                                    placeholder="Ask about SMK..."
                                    className="flex-1 bg-bg-hover border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#9b1c1c]/20 focus:border-[#9b1c1c]/30 outline-none transition-all"
                                    disabled={chatLoading}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleChat()}
                                    disabled={!chatInput.trim() || chatLoading}
                                    className="bg-[#9b1c1c] text-white p-2 shrink-0 rounded-xl disabled:opacity-50 transition-colors"
                                >
                                    {chatLoading ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Send size={14} />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAB button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${chatOpen
                        ? 'bg-white border border-border text-text-secondary'
                        : 'bg-[#9b1c1c] text-white shadow-glow'
                        }`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {chatOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={22} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sparkles size={22} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    )
}
