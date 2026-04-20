import { useParams, useNavigate } from 'react-router-dom'
import { useEvent } from '../hooks/useApi'
import {
    CalendarDays, Clock, MapPin,
    ArrowLeft, Share2, Bookmark,
    ChevronRight, GraduationCap, PartyPopper,
    AlertTriangle, Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation, Language } from '../lib/translations'
import { useAuthStore } from '../store/authStore'
import { EventCardSkeleton } from '../components/Skeleton'

export default function EventDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)

    // Fetch event data
    const { data: eventData, isLoading, error } = useEvent(Number(id), user?.language_preference)
    const event = eventData?.data

    const formatDate = (dateStr: string) => {
        if (!dateStr) return { full: '', day: '', month: '', time: '' }
        const d = new Date(dateStr)
        const locale = user?.language_preference === 'lt' ? 'lt-LT' : user?.language_preference === 'ru' ? 'ru-RU' : 'en-GB'
        return {
            full: d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
            day: d.getDate(),
            month: t.monthsShort[d.getMonth()],
            time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
        }
    }

    const getCategoryStyles = (cat: string) => {
        switch (cat) {
            case 'academic': return { badge: 'bg-red-50 text-accent', dot: 'bg-accent', icon: GraduationCap };
            case 'social': return { badge: 'bg-[#f0fdf4] text-[#16a34a]', dot: 'bg-[#16a34a]', icon: PartyPopper };
            case 'deadline': return { badge: 'bg-[#fef2f2] text-[#dc2626]', dot: 'bg-[#dc2626]', icon: AlertTriangle };
            default: return { badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', icon: CalendarDays };
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <EventCardSkeleton />
                <div className="mt-8 space-y-4 animate-pulse">
                    <div className="h-8 bg-slate-100 rounded-xl w-3/4"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-2/3"></div>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6 text-center">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} className="text-accent" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{t.errorLoadingEvent || 'Event Not Found'}</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">{t.errorLoadingEventDesc || 'We couldn\'t find the event you\'re looking for. It may have been removed or is currently unavailable.'}</p>
                <button
                    onClick={() => navigate('/events')}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                >
                    {t.backToEvents || 'Back to Events'}
                </button>
            </div>
        )
    }

    const date = formatDate(event.starts_at)
    const styles = getCategoryStyles(event.category)
    const CategoryIcon = styles.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto pb-20 pt-6"
        >
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8 px-6 lg:px-0">
                <button
                    onClick={() => navigate('/events')}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors shadow-sm">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide">{t.allEvents || 'All Events'}</span>
                </button>

                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                        <Share2 size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                        <Bookmark size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12 px-6 lg:px-0">
                {/* Main Content */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${styles.badge}`}>
                                <CategoryIcon size={14} />
                                {event.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={14} />
                                SMK Campus
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-heading font-black text-slate-900 leading-[1.1]">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-accent">
                                    <CalendarDays size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{t.date || 'Date'}</span>
                                    <span className="text-sm font-bold text-slate-900">{date.full}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Clock size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{t.time || 'Time'}</span>
                                    <span className="text-sm font-bold text-slate-900">{date.time} {event.ends_at ? `— ${formatDate(event.ends_at).time}` : ''}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{t.location || 'Location'}</span>
                                    <span className="text-sm font-bold text-slate-900">{event.location || 'SMK Main Hall'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl">
                        {event.image_url ? (
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                <CalendarDays size={80} strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 font-heading">{t.aboutEvent || 'About this event'}</h2>
                        <div className="prose prose-slate max-w-none">
                            {event.description?.split('\n').map((para: string, i: number) => (
                                <p key={i} className="text-slate-600 text-lg leading-relaxed mb-4">
                                    {para}
                                </p>
                            )) || <p className="text-slate-400 italic">No description available for this event.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6 sticky top-24">
                        <div className="space-y-2">
                            <span className="text-accent font-black text-[10px] tracking-widest uppercase">{t.registration || 'Registration'}</span>
                            <h3 className="text-2xl font-black text-slate-900">{t.enrollmentOpen || 'Enrollment Open'}</h3>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Join us for this exciting event at SMK! Space is limited, so make sure to reserve your spot as soon as possible.
                        </p>

                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-400 uppercase tracking-wider">{t.attendanceFee || 'Fee'}</span>
                                <span className="text-slate-900">{t.free || 'Free for Students'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-4">
                        <h4 className="font-black text-lg">{t.haveQuestions || 'Have questions?'}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Contact the event coordinator directly for more information about the schedule or venue.
                        </p>
                        <button className="text-[#bef264] font-bold text-sm flex items-center gap-2 hover:underline">
                            {t.contactOrganizer || 'Contact Organizer'} <ChevronRight size={16} />
                        </button>
                    </div>
                </aside>
            </div>
        </motion.div>
    )
}
