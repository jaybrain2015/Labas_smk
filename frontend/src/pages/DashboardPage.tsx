import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMySchedule, useRoomAvailability, useUpcomingEvents, useSendMessage } from '../hooks/useApi'
import {
    Calendar, DoorOpen, CalendarDays, Sparkles, Send,
    Clock, MapPin, Users, ArrowRight, Bot, Loader2,
    Sun, Moon, Sunset, X,
} from 'lucide-react'

const blockColors = [
    'border-l-[#e63946] bg-[#e63946]/5',
    'border-l-[#f4a261] bg-[#f4a261]/5',
    'border-l-[#1d3557] bg-[#1d3557]/5',
    'border-l-[#10b981] bg-[#10b981]/5',
    'border-l-[#8b5cf6] bg-[#8b5cf6]/5',
]

const quickChips = [
    { label: 'My schedule today', icon: Calendar },
    { label: 'Free rooms now', icon: MapPin },
    { label: 'Library hours', icon: Clock },
]

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return { text: 'Good morning', icon: Sun }
    if (h < 18) return { text: 'Good afternoon', icon: Sunset }
    return { text: 'Good evening', icon: Moon }
}

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { data: scheduleData, isLoading: schedLoading } = useMySchedule()
    const { data: roomsData, isLoading: roomsLoading } = useRoomAvailability()
    const { data: eventsData, isLoading: eventsLoading } = useUpcomingEvents()
    const sendMutation = useSendMessage()

    const [chatInput, setChatInput] = useState('')
    const [chatResponse, setChatResponse] = useState<string | null>(null)
    const [chatLoading, setChatLoading] = useState(false)
    const [chatOpen, setChatOpen] = useState(false)

    const greeting = getGreeting()
    const GreetingIcon = greeting.icon
    const schedule = scheduleData?.data || []
    const rooms = (roomsData?.data || []).slice(0, 6)
    const events = (eventsData?.data || []).slice(0, 3)

    const roomCounts = {
        free: (roomsData?.data || []).filter((r: any) => r.status === 'free').length,
        soon: (roomsData?.data || []).filter((r: any) => r.status === 'soon').length,
        busy: (roomsData?.data || []).filter((r: any) => r.status === 'busy').length,
    }

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

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

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* ── 1. Welcome Greeting ────────────────────────── */}
            <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-1">
                    <GreetingIcon size={28} className="text-accent2" />
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                        {greeting.text}, {user?.name?.split(' ')[0] || 'Student'}!
                    </h1>
                </div>
                <p className="text-sm text-text-muted ml-[40px]">{today}</p>
            </div>

            {/* ── 2 & 3. Schedule + Rooms (2-col) ────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ── 2. Today's Schedule ─────────────────────── */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="section-title flex items-center gap-2">
                            <Calendar size={18} className="text-accent" />
                            Today's Schedule
                        </h2>
                        <button
                            onClick={() => navigate('/schedule')}
                            className="text-xs text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            View all <ArrowRight size={14} />
                        </button>
                    </div>

                    {schedLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-3 rounded-xl bg-bg-hover animate-pulse">
                                    <div className="skeleton h-3 w-24 mb-2" />
                                    <div className="skeleton h-4 w-40 mb-1" />
                                    <div className="skeleton h-3 w-28" />
                                </div>
                            ))}
                        </div>
                    ) : schedule.length === 0 ? (
                        <div className="text-center py-10">
                            <Calendar size={36} className="mx-auto text-text-muted mb-3" />
                            <p className="text-sm text-text-secondary">No classes today</p>
                            <p className="text-xs text-text-muted mt-1">Enjoy your free day! 🎉</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {schedule.map((item: any, idx: number) => (
                                <div
                                    key={item.id || idx}
                                    className={`p-3 rounded-xl border-l-2 bg-white shadow-sm transition-all hover:shadow-md ${blockColors[idx % blockColors.length]}`}
                                >
                                    <p className="text-xs font-bold text-accent mb-1">
                                        {item.start_time?.slice(0, 5)} – {item.end_time?.slice(0, 5)}
                                    </p>
                                    <p className="text-sm font-medium text-text-primary">{item.subject}</p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                                        <span className="flex items-center gap-1"><MapPin size={11} /> {item.room?.number || '—'}</span>
                                        <span className="flex items-center gap-1"><Users size={11} /> {item.lecturer}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── 3. Room Availability ────────────────────── */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="section-title flex items-center gap-2">
                            <DoorOpen size={18} className="text-accent3" />
                            Room Availability
                        </h2>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="text-xs text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            View all <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Summary badges */}
                    {!roomsLoading && (
                        <div className="flex gap-3 mb-4">
                            <span className="badge-green text-xs">{roomCounts.free} Free</span>
                            <span className="badge-yellow text-xs">{roomCounts.soon} Soon</span>
                            <span className="badge-red text-xs">{roomCounts.busy} Busy</span>
                        </div>
                    )}

                    {roomsLoading ? (
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="p-3 rounded-xl bg-bg-hover animate-pulse">
                                    <div className="skeleton h-5 w-16 mb-2" />
                                    <div className="skeleton h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-10">
                            <DoorOpen size={36} className="mx-auto text-text-muted mb-3" />
                            <p className="text-sm text-text-secondary">No room data available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {rooms.map((room: any) => (
                                <button
                                    key={room.id}
                                    onClick={() => navigate('/rooms')}
                                    className="p-3 rounded-xl bg-white border border-border shadow-sm text-left hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-heading font-bold text-text-primary">{room.number}</p>
                                        <span className={`w-2.5 h-2.5 rounded-full ${room.status === 'free' ? 'bg-success' : room.status === 'soon' ? 'bg-warning' : 'bg-danger'}`} />
                                    </div>
                                    <p className="text-xs text-text-muted capitalize">
                                        {room.status === 'free' ? 'Available' : room.status === 'soon' ? 'Free soon' : 'Occupied'}
                                    </p>
                                    {room.current_class && (
                                        <p className="text-[10px] text-text-muted mt-1 truncate">{room.current_class}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── 4. Upcoming Events (full width) ──────────── */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="section-title flex items-center gap-2">
                        <CalendarDays size={18} className="text-accent2" />
                        Upcoming Events
                    </h2>
                    <button
                        onClick={() => navigate('/events')}
                        className="text-xs text-accent font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        View all <ArrowRight size={14} />
                    </button>
                </div>

                {eventsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 rounded-xl bg-bg-hover animate-pulse">
                                <div className="skeleton h-4 w-36 mb-2" />
                                <div className="skeleton h-3 w-24" />
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-10">
                        <CalendarDays size={36} className="mx-auto text-text-muted mb-3" />
                        <p className="text-sm text-text-secondary">No upcoming events</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {events.map((event: any, index: number) => {
                            const d = new Date(event.starts_at)
                            return (
                                <div
                                    key={event.id || index}
                                    className="flex gap-3 p-3 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/5 border border-accent/10 flex flex-col items-center justify-center">
                                        <p className="text-[10px] text-text-muted leading-none">
                                            {d.toLocaleDateString('en-GB', { month: 'short' })}
                                        </p>
                                        <p className="text-base font-heading font-bold text-text-primary leading-none">
                                            {d.getDate()}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} />
                                                {d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {event.location && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <MapPin size={11} /> {event.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── 5. Floating AI Chat Widget ─────────────────── */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Chat panel */}
                {chatOpen && (
                    <div className="absolute bottom-16 right-0 w-[360px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-accent/5">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-accent" />
                                <h3 className="text-sm font-bold text-text-primary">AI Assistant</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="text-[10px] text-accent font-medium hover:underline"
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
                            {quickChips.map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => handleChat(label)}
                                    disabled={chatLoading}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-hover border border-border
                                        text-[11px] text-text-secondary hover:text-accent hover:border-accent/30 transition-all disabled:opacity-50"
                                >
                                    <Icon size={10} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Response area */}
                        <div className="p-4 min-h-[100px] max-h-[250px] overflow-y-auto">
                            {chatLoading ? (
                                <div className="flex gap-3 items-start animate-fade-in">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Bot size={12} className="text-accent" />
                                    </div>
                                    <div className="bg-bg-hover border border-border rounded-2xl rounded-bl-md px-3 py-2">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-text-muted typing-dot" />
                                        </div>
                                    </div>
                                </div>
                            ) : chatResponse ? (
                                <div className="flex gap-3 items-start animate-slide-up">
                                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Bot size={12} className="text-accent" />
                                    </div>
                                    <div className="bg-bg-hover border border-border rounded-2xl rounded-bl-md px-3 py-2.5 text-xs text-text-primary leading-relaxed">
                                        {chatResponse}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-4">
                                    <Bot size={24} className="text-text-muted mb-2" />
                                    <p className="text-[11px] text-text-muted">Ask a question or tap a suggestion</p>
                                </div>
                            )}
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
                                className="flex-1 bg-bg-hover border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-accent/20 focus:border-accent/30 outline-none transition-all"
                                disabled={chatLoading}
                            />
                            <button
                                onClick={() => handleChat()}
                                disabled={!chatInput.trim() || chatLoading}
                                className="btn-primary px-2.5 py-2 shrink-0 rounded-xl"
                            >
                                {chatLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* FAB button */}
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${chatOpen
                        ? 'bg-white border border-border text-text-secondary rotate-45'
                        : 'bg-accent text-white shadow-glow'
                        }`}
                >
                    {chatOpen ? <X size={22} /> : <Sparkles size={22} />}
                </button>
            </div>
        </div>
    )
}

