import { useState, useMemo } from 'react'
import { useWeekSchedule } from '../hooks/useApi'
import { ScheduleBlockSkeleton } from '../components/Skeleton'
import { Calendar, ChevronLeft, ChevronRight, Grid3X3, List, Download, Clock, MapPin, Users, MessageSquare } from 'lucide-react'
import CourseChat from '../components/CourseChat'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const blockColors = [
    'border-l-[#e63946] bg-[#e63946]/5',
    'border-l-[#f4a261] bg-[#f4a261]/5',
    'border-l-[#1d3557] bg-[#1d3557]/5',
    'border-l-[#10b981] bg-[#10b981]/5',
    'border-l-[#8b5cf6] bg-[#8b5cf6]/5',
]

export default function SchedulePage() {
    const [view, setView] = useState<'week' | 'day'>('week')
    const [currentDate, setCurrentDate] = useState(new Date())
    const [activeChat, setActiveChat] = useState<{ subject: string; groupName: string } | null>(null)
    const { data: scheduleData, isLoading } = useWeekSchedule()
    const schedule = scheduleData?.data || []

    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' })

    const weekStart = useMemo(() => {
        const d = new Date(currentDate)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        d.setDate(diff)
        return d
    }, [currentDate])

    const weekDates = useMemo(() => {
        return DAYS.map((_, i) => {
            const d = new Date(weekStart)
            d.setDate(d.getDate() + i)
            return d
        })
    }, [weekStart])

    const navigateWeek = (dir: number) => {
        const d = new Date(currentDate)
        d.setDate(d.getDate() + dir * 7)
        setCurrentDate(d)
    }

    const navigateDay = (dir: number) => {
        const d = new Date(currentDate)
        d.setDate(d.getDate() + dir)
        setCurrentDate(d)
    }

    const getScheduleForDay = (dayName: string) => {
        return schedule.filter((item: any) =>
            item.day_of_week?.toLowerCase() === dayName.toLowerCase()
        ).sort((a: any, b: any) => (a.start_time || '').localeCompare(b.start_time || ''))
    }

    const exportICS = () => {
        let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Labas SMK//Schedule//EN\n'
        schedule.forEach((item: any) => {
            const dayIndex = DAYS.findIndex(d => d.toLowerCase() === item.day_of_week?.toLowerCase())
            if (dayIndex === -1) return
            const date = new Date(weekStart)
            date.setDate(date.getDate() + dayIndex)
            const dateStr = date.toISOString().replace(/[-:]/g, '').split('T')[0]
            const startStr = (item.start_time || '08:00').replace(':', '') + '00'
            const endStr = (item.end_time || '09:00').replace(':', '') + '00'
            ics += `BEGIN:VEVENT\nDTSTART:${dateStr}T${startStr}\nDTEND:${dateStr}T${endStr}\n`
            ics += `SUMMARY:${item.subject}\nLOCATION:Room ${item.room?.number || ''}\n`
            ics += `DESCRIPTION:Lecturer: ${item.lecturer}\\nGroup: ${item.group_name || ''}\nEND:VEVENT\n`
        })
        ics += 'END:VCALENDAR'

        const blob = new Blob([ics], { type: 'text/calendar' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'smk-schedule.ics'
        a.click()
        URL.revokeObjectURL(url)
    }

    const getBlockColor = (index: number) => blockColors[index % blockColors.length]

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <Calendar size={24} className="text-accent" />
                        Schedule
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">Your weekly timetable</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-border rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setView('week')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'week' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            <Grid3X3 size={14} className="inline mr-1" />
                            Week
                        </button>
                        <button
                            onClick={() => setView('day')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'day' ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            <List size={14} className="inline mr-1" />
                            Day
                        </button>
                    </div>
                    <button onClick={exportICS} className="btn-secondary text-xs flex items-center gap-1.5">
                        <Download size={14} />
                        Export .ics
                    </button>
                </div>
            </div>

            {/* Date navigation */}
            <div className="flex items-center justify-between glass-card p-3 px-5">
                <button
                    onClick={() => view === 'week' ? navigateWeek(-1) : navigateDay(-1)}
                    className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
                >
                    <ChevronLeft size={18} className="text-text-secondary" />
                </button>
                <div className="text-center">
                    {view === 'week' ? (
                        <p className="text-sm font-medium text-text-primary">
                            {weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} —{' '}
                            {weekDates[5]?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-text-primary">
                            {currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => view === 'week' ? navigateWeek(1) : navigateDay(1)}
                    className="p-2 rounded-lg hover:bg-bg-hover transition-colors"
                >
                    <ChevronRight size={18} className="text-text-secondary" />
                </button>
            </div>

            {/* Schedule content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: view === 'week' ? 6 : 3 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <ScheduleBlockSkeleton />
                            <ScheduleBlockSkeleton />
                        </div>
                    ))}
                </div>
            ) : view === 'week' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {DAYS.map((day, dayIndex) => {
                        const daySchedule = getScheduleForDay(day)
                        const isToday = day === currentDay
                        return (
                            <div key={day}>
                                <div className={`text-center p-2 rounded-xl mb-3 ${isToday ? 'bg-accent text-white' : 'bg-white text-text-secondary shadow-sm border border-border'}`}>
                                    <p className="text-xs font-medium">{day.slice(0, 3)}</p>
                                    <p className="text-lg font-heading font-bold">{weekDates[dayIndex]?.getDate()}</p>
                                </div>
                                <div className="space-y-2">
                                    {daySchedule.length === 0 ? (
                                        <p className="text-xs text-text-muted text-center py-4 bg-white rounded-xl border border-border border-dashed">No classes</p>
                                    ) : (
                                        daySchedule.map((item: any, idx: number) => (
                                            <div key={item.id || idx} className={`p-3 rounded-xl border-l-2 transition-all hover:scale-[1.02] cursor-default bg-white shadow-sm ${getBlockColor(idx)}`}>
                                                <p className="text-xs font-bold text-accent mb-1">{item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}</p>
                                                <p className="text-xs font-medium text-text-primary leading-snug">{item.subject}</p>
                                                <p className="text-[10px] text-text-muted mt-1 flex items-center gap-1"><MapPin size={10} /> {item.room?.number || '—'}</p>
                                                <p className="text-[10px] text-text-muted flex items-center gap-1 mb-2"><Users size={10} /> {item.lecturer}</p>
                                                <button
                                                    onClick={() => setActiveChat({ subject: item.subject, groupName: item.group_name })}
                                                    className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-bg-hover hover:bg-border text-[10px] font-bold text-accent transition-colors"
                                                >
                                                    <MessageSquare size={12} /> Join Chat
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="glass-card p-5">
                    {getScheduleForDay(currentDay).length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar size={40} className="mx-auto text-text-muted mb-3" />
                            <p className="text-text-secondary">No classes on {currentDay}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getScheduleForDay(currentDay).map((item: any, idx: number) => (
                                <div key={item.id || idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-bg-hover/50 hover:bg-bg-hover transition-colors animate-slide-up">
                                    <div className="text-center min-w-[70px]">
                                        <p className="text-sm font-bold text-accent">{item.start_time?.slice(0, 5)}</p>
                                        <p className="text-xs text-text-muted">{item.end_time?.slice(0, 5)}</p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-text-primary">{item.subject}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-text-muted">
                                            <span className="flex items-center gap-1.5"><Users size={14} /> {item.lecturer}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} /> Room {item.room?.number || '—'}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} /> {item.group_name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveChat({ subject: item.subject, groupName: item.group_name })}
                                        className="btn-secondary flex items-center gap-2 text-xs"
                                    >
                                        <MessageSquare size={16} /> Course Chat
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Side Drawer for Chat */}
            {activeChat && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setActiveChat(null)} />
                    <div className="relative w-full max-w-sm h-full bg-white border-l border-border shadow-2xl">
                        <CourseChat
                            subject={activeChat.subject}
                            groupName={activeChat.groupName}
                            onClose={() => setActiveChat(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
