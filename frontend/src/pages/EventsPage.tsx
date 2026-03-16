import { useState } from 'react'
import { useEvents } from '../hooks/useApi'
import { EventCardSkeleton } from '../components/Skeleton'
import {
    CalendarDays, Clock, MapPin, Filter,
    GraduationCap, PartyPopper, AlertTriangle, Calendar,
} from 'lucide-react'

const categories = [
    { value: null, label: 'All', icon: Filter },
    { value: 'academic', label: 'Academic', icon: GraduationCap },
    { value: 'social', label: 'Social', icon: PartyPopper },
    { value: 'deadline', label: 'Deadlines', icon: AlertTriangle },
]

export default function EventsPage() {
    const [category, setCategory] = useState<string | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
    const { data: eventsData, isLoading } = useEvents(category || undefined)
    const events = eventsData?.data || []

    const today = new Date()

    const calendarDays = () => {
        const year = today.getFullYear()
        const firstDay = new Date(year, selectedMonth, 1).getDay()
        const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
        const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1
        const days: (number | null)[] = Array(adjustedFirst).fill(null)
        for (let i = 1; i <= daysInMonth; i++) days.push(i)
        return days
    }

    const eventDates = new Set(
        events.map((e: any) => new Date(e.starts_at).getDate())
    )

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return {
            day: d.getDate(),
            month: d.toLocaleDateString('en-GB', { month: 'short' }),
            weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
            time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        }
    }

    const getCategoryStyle = (cat: string) => {
        switch (cat) {
            case 'academic': return 'bg-accent3-light text-accent3'
            case 'social': return 'bg-accent2-light text-accent2'
            case 'deadline': return 'bg-warning-light text-warning'
            default: return 'bg-bg-hover text-text-secondary'
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="page-title flex items-center gap-2">
                    <CalendarDays size={24} className="text-accent2" />
                    Events
                </h1>
                <p className="text-text-secondary text-sm mt-1">Stay updated with campus happenings</p>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
                {categories.map(({ value, label, icon: Icon }) => (
                    <button
                        key={label}
                        onClick={() => setCategory(value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all border ${category === value
                            ? 'bg-text-primary text-white border-text-primary'
                            : 'bg-white border-border text-text-secondary hover:text-text-primary hover:border-text-primary shadow-sm'
                            }`}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Events list */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <EventCardSkeleton key={i} />)
                    ) : events.length === 0 ? (
                        <div className="text-center py-12 glass-card">
                            <CalendarDays size={40} className="mx-auto text-text-muted mb-3" />
                            <p className="text-text-secondary">No events found</p>
                            <p className="text-xs text-text-muted mt-1">Try changing your filters</p>
                        </div>
                    ) : (
                        events.map((event: any, index: number) => {
                            const date = formatDate(event.starts_at)
                            return (
                                <div
                                    key={event.id}
                                    className="glass-card-hover p-5 animate-slide-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-14 h-14 rounded-xl bg-accent/5 border border-accent/10 flex flex-col items-center justify-center">
                                            <p className="text-xs text-text-muted">{date.month}</p>
                                            <p className="text-lg font-heading font-bold text-text-primary leading-none">{date.day}</p>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-base font-medium text-text-primary">{event.title}</h3>
                                                <span className={`badge shrink-0 ${getCategoryStyle(event.category)}`}>
                                                    {event.category}
                                                </span>
                                            </div>

                                            {event.description && (
                                                <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{event.description}</p>
                                            )}

                                            <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    {date.time}
                                                    {event.ends_at && ` - ${formatDate(event.ends_at).time}`}
                                                </span>
                                                {event.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={12} />
                                                        {event.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Mini calendar */}
                <div className="hidden lg:block">
                    <div className="glass-card p-5 sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="section-title flex items-center gap-2">
                                <Calendar size={16} className="text-accent" />
                                Calendar
                            </h3>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="bg-bg-hover border border-border rounded-lg px-2 py-1 text-xs text-text-primary"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(2026, i).toLocaleDateString('en-GB', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className="text-[10px] text-text-muted py-1 font-medium">{d}</div>
                            ))}
                            {calendarDays().map((day, i) => (
                                <div
                                    key={i}
                                    className={`p-1.5 rounded-lg text-xs relative ${day === null ? '' :
                                        day === today.getDate() && selectedMonth === today.getMonth()
                                            ? 'bg-accent text-white font-bold'
                                            : eventDates.has(day)
                                                ? 'bg-accent-light text-accent font-medium'
                                                : 'text-text-secondary hover:bg-bg-hover'
                                        }`}
                                >
                                    {day}
                                    {day && eventDates.has(day) && day !== today.getDate() && (
                                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
