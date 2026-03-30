import { useState, useMemo } from 'react'
import { useEvents } from '../hooks/useApi'
import { EventCardSkeleton } from '../components/Skeleton'
import {
    CalendarDays, Clock, MapPin, Filter,
    GraduationCap, PartyPopper, AlertTriangle,
    ChevronLeft, ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

import heroBg from '../assets/events-hero-bg.png'

const categories = [
    { value: null, label: 'All', icon: Filter },
    { value: 'academic', label: 'Academic', icon: GraduationCap },
    { value: 'social', label: 'Social', icon: PartyPopper },
    { value: 'deadline', label: 'Deadlines', icon: AlertTriangle },
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

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

/* ── component ──────────────────────────────────────── */

export default function EventsPage() {
    const [category, setCategory] = useState<string | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
    const { data: eventsData, isLoading } = useEvents(category || undefined)
    const events = eventsData?.data || []

    const today = new Date()
    const currentYear = today.getFullYear()

    // Featured event logic - pick the first academic or social event if available
    const featuredEvent = useMemo(() => {
        if (!eventsData?.data) return null;
        return eventsData.data.find((e: any) => e.category === 'academic' || e.category === 'social') || eventsData.data[0];
    }, [eventsData]);

    const calendarDays = () => {
        const year = currentYear
        const firstDay = new Date(year, selectedMonth, 1).getDay()
        const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
        // Adjust for Monday start (0=Sun, 1=Mon... -> 0=Mon, 6=Sun)
        const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1
        const days: (number | null)[] = Array(adjustedFirst).fill(null)
        for (let i = 1; i <= daysInMonth; i++) days.push(i)
        return days
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return {
            full: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            day: d.getDate(),
            month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
            weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
            time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        }
    }

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case 'academic': return { badge: 'bg-red-50 text-accent', dot: 'bg-accent' };
            case 'social': return { badge: 'bg-[#f0fdf4] text-[#16a34a]', dot: 'bg-[#16a34a]' };
            case 'deadline': return { badge: 'bg-[#fef2f2] text-[#dc2626]', dot: 'bg-[#dc2626]' };
            default: return { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
        }
    }

    const changeMonth = (offset: number) => {
        let newMonth = selectedMonth + offset;
        if (newMonth < 0) newMonth = 11;
        if (newMonth > 11) newMonth = 0;
        setSelectedMonth(newMonth);
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 pb-12 max-w-[1400px] mx-auto"
        >
            {/* HERO SECTION */}
            <motion.section
                variants={itemVariants}
                className="relative h-[480px] rounded-[32px] overflow-hidden group shadow-2xl"
            >
                <motion.img
                    src={heroBg}
                    alt="Campus Hero"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-center px-12 lg:px-20">
                    <div className="max-w-2xl space-y-6">
                        <motion.span
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="inline-block px-4 py-1.5 bg-[#bef264] text-slate-900 text-[10px] font-bold tracking-wide rounded-full uppercase"
                        >
                            Featured Event
                        </motion.span>
                        {featuredEvent ? (
                            <>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-5xl lg:text-6xl font-heading font-black text-white leading-[1.1]"
                                >
                                    {featuredEvent.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-lg text-slate-200/90 leading-relaxed max-w-xl"
                                >
                                    {featuredEvent.description || "Join us for an exclusive gathering where we explore the intersections of technology, community, and academic excellence."}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-accent text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-accent/20 text-sm tracking-wide uppercase"
                                    >
                                        Reserve Your Seat
                                    </motion.button>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <CalendarDays size={20} className="text-[#bef264]" />
                                        <span className="font-medium text-base">
                                            {formatDate(featuredEvent.starts_at).full} • {formatDate(featuredEvent.starts_at).time}
                                        </span>
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <div className="animate-pulse space-y-4">
                                <div className="h-16 bg-white/20 rounded-2xl w-3/4"></div>
                                <div className="h-6 bg-white/20 rounded-lg w-1/2"></div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12">

                {/* LISTINGS SECTION */}
                <div className="space-y-8">
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-3xl font-heading font-bold text-slate-900">
                            Upcoming <span className="text-accent italic">Gatherings</span>
                        </h2>

                        {/* Filter Chips */}
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start">
                            {categories.map(({ value, label }) => (
                                <motion.button
                                    key={label}
                                    layout
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCategory(value)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${category === value
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
                        ) : (
                            <AnimatePresence mode="popLayout" initial={false}>
                                {events.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200"
                                    >
                                        <CalendarDays size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500 font-medium">No gatherings scheduled in this category</p>
                                    </motion.div>
                                ) : (
                                    events.map((event: any) => {
                                        const date = formatDate(event.starts_at)
                                        const styles = getCategoryStyles(event.category)
                                        return (
                                            <motion.div
                                                layout
                                                key={event.id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="group bg-white p-6 rounded-[28px] border border-slate-100 hover:border-red-200 hover:shadow-[0_20px_50px_rgba(155,28,28,0.06)] transition-all"
                                            >
                                                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                                    {/* Date Box */}
                                                    <div className="shrink-0 w-20 h-24 rounded-[22px] bg-red-50 flex flex-col items-center justify-center border border-red-50">
                                                        <p className="text-[10px] font-black tracking-wide text-accent mb-0.5">{date.month}</p>
                                                        <p className="text-3xl font-black text-slate-900 leading-none">{date.day}</p>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide ${styles.badge}`}>
                                                                {event.category || 'General'}
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Open Enrollment</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-accent transition-colors truncate">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                                            {event.description || "Join the discussion on the ethical implications of emerging technologies and their impact on global society."}
                                                        </p>
                                                        <div className="flex items-center gap-6 pt-1">
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <Clock size={14} className="text-accent" />
                                                                <span className="text-[11px] font-bold uppercase tracking-wide">{date.time} - {event.ends_at ? formatDate(event.ends_at).time : 'Late'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <MapPin size={14} className="text-accent" />
                                                                <span className="text-[11px] font-bold uppercase tracking-wide">{event.location || 'Campus Center'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="shrink-0 w-full md:w-auto px-6 py-3 bg-red-50 text-accent font-black text-[10px] tracking-wide uppercase rounded-xl hover:bg-accent hover:text-white transition-all"
                                                    >
                                                        Go To Event
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* SIDEBAR */}
                <aside className="space-y-8">
                    {/* Academic Pulse */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 font-heading">Academic <span className="text-accent underline decoration-red-200 decoration-2 underline-offset-4">Pulse</span></h3>
                            <div className="flex gap-1">
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                                    <ChevronLeft size={16} />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => changeMonth(1)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                                    <ChevronRight size={16} />
                                </motion.button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-6">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                                <div key={d} className="text-[10px] font-black text-slate-400 tracking-wide py-2">{d}</div>
                            ))}
                            {calendarDays().map((day, i) => {
                                const isToday = day === today.getDate() && selectedMonth === today.getMonth();
                                // Dummy indicator logic for mockup fidelity
                                const hasIndicator = day && [5, 12, 19, 25].includes(day);
                                return (
                                    <motion.div
                                        key={i}
                                        whileHover={day !== null ? { scale: 1.1, backgroundColor: '#f8fafc' } : {}}
                                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all cursor-default ${day === null ? '' :
                                            isToday ? 'bg-accent text-white shadow-lg shadow-red-200' :
                                                'text-slate-500'
                                            }`}
                                    >
                                        {day}
                                        {hasIndicator && !isToday && (
                                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400" />
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wide text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-accent" /> Major Campus Event
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wide text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-green-500" /> Club/Social Meetup
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wide text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-red-500" /> Submission Deadline
                            </div>
                        </div>
                    </motion.div>

                    {/* Host CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-slate-900 p-8 rounded-[32px] text-white space-y-6 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-all duration-700" />
                        <h3 className="text-xl font-black leading-snug relative z-10 font-heading">
                            Host your own <br />event?
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium relative z-10">
                            Submit your proposal for review and get featured in the Greenhouse.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-[#bef264] text-slate-900 font-black text-xs tracking-wide uppercase rounded-2xl transition-all shadow-lg shadow-[#bef264]/10 relative z-10"
                        >
                            Submit Event
                        </motion.button>
                    </motion.div>
                </aside>
            </div>
        </motion.div>
    )
}
