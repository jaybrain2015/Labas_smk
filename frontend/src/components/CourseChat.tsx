import { useState, useRef, useEffect } from 'react'
import { useCourseChat, useSendCourseMessage } from '../hooks/useApi'
import { useAuthStore } from '../store/authStore'
import { Send, User, MessageSquare, X, Loader2, ShieldCheck } from 'lucide-react'

interface CourseChatProps {
    subject: string
    groupName: string
    onClose: () => void
}

export default function CourseChat({ subject, groupName, onClose }: CourseChatProps) {
    const { user } = useAuthStore()
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { data: messagesData, isLoading } = useCourseChat(subject, groupName)
    const sendMutation = useSendCourseMessage()

    const messages = messagesData?.data || []

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!message.trim() || sendMutation.isPending) return

        try {
            await sendMutation.mutateAsync({
                subject,
                groupName,
                message: message.trim()
            })
            setMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-bg-card border-l border-border animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                    <h3 className="font-heading font-bold text-text-primary flex items-center gap-2">
                        <MessageSquare size={18} className="text-accent" />
                        Course Chat
                    </h3>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">
                        {subject} • {groupName}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-bg-hover transition-colors"
                >
                    <X size={18} className="text-text-muted" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
                        <Loader2 size={24} className="animate-spin" />
                        <p className="text-xs">Loading updates...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-60">
                        <MessageSquare size={32} className="text-text-muted" />
                        <p className="text-sm text-text-secondary">No messages yet.</p>
                        <p className="text-[10px] text-text-muted max-w-[200px]">
                            Start the conversation with your classmates and lecturer!
                        </p>
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}
                        >
                            <div className="flex items-center gap-1.5 mb-1 px-1">
                                <span className={`text-[10px] font-medium ${msg.user_id === user?.id ? 'text-accent' : 'text-text-secondary'}`}>
                                    {msg.user?.name}
                                </span>
                                {msg.is_lecturer && (
                                    <span className="flex items-center gap-0.5 px-1 bg-accent/10 border border-accent/20 rounded text-[9px] text-accent font-bold uppercase">
                                        <ShieldCheck size={10} /> Lecturer
                                    </span>
                                )}
                            </div>
                            <div
                                className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] ${msg.user_id === user?.id
                                        ? 'bg-accent text-white rounded-tr-md shadow-glow-sm'
                                        : 'bg-bg-hover text-text-primary border border-border rounded-tl-md'
                                    }`}
                            >
                                {msg.message}
                            </div>
                            <span className="text-[9px] text-text-muted mt-1 px-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-bg-card/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="input-field flex-1 text-xs"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || sendMutation.isPending}
                        className="btn-primary p-2 shrink-0"
                    >
                        {sendMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
