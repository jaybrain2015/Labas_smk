import { useState, useRef, useEffect } from 'react'
import { useChatHistory, useSendMessage } from '../hooks/useApi'
import { ChatMessageSkeleton } from '../components/Skeleton'
import { useAuthStore } from '../store/authStore'
import {
    Send, Bot, User, Sparkles, Loader2,
    BookOpen, MapPin, Calendar, HelpCircle,
} from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp?: string
}

const quickChips = [
    { label: 'My schedule today', icon: Calendar },
    { label: 'Free rooms now', icon: MapPin },
    { label: 'Exam registration', icon: BookOpen },
    { label: 'Library hours', icon: HelpCircle },
]

export default function ChatPage() {
    const { user } = useAuthStore()
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { data: historyData, isLoading } = useChatHistory()
    const sendMutation = useSendMessage()

    useEffect(() => {
        if (historyData?.data?.messages) {
            setMessages(historyData.data.messages)
        }
    }, [historyData])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = async (text?: string) => {
        const message = text || input.trim()
        if (!message) return

        const userMsg: Message = { role: 'user', content: message, timestamp: new Date().toISOString() }
        setMessages((prev) => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        try {
            const result = await sendMutation.mutateAsync(message)
            const aiMsg: Message = {
                role: 'assistant',
                content: result.data?.response || 'Sorry, I couldn\'t process that request.',
                timestamp: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, aiMsg])
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                    timestamp: new Date().toISOString(),
                },
            ])
        } finally {
            setIsTyping(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-6rem)] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <Sparkles size={24} className="text-accent" />
                        AI Assistant
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        Ask me anything about SMK campus
                    </p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 glass-card overflow-y-auto p-4 md:p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => <ChatMessageSkeleton key={i} />)}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-glow">
                            <Bot size={28} className="text-white" />
                        </div>
                        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
                            Hello! I'm your SMK assistant
                        </h3>
                        <p className="text-sm text-text-secondary max-w-md mb-6">
                            I can help you with schedules, room availability, campus procedures, and more.
                            Try one of the quick questions below!
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {quickChips.map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => handleSend(label)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border
                                        text-sm text-text-secondary hover:text-accent hover:border-accent/30 transition-all duration-200 shadow-sm"
                                >
                                    <Icon size={14} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                        ? 'bg-accent3'
                                        : 'bg-white border border-border shadow-sm'
                                        }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User size={14} className="text-white" />
                                    ) : (
                                        <Bot size={14} className="text-accent" />
                                    )}
                                </div>
                                <div
                                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-accent3 text-white rounded-br-md'
                                        : 'bg-bg-elevated text-text-primary rounded-bl-md border border-border'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={14} className="text-accent" />
                        </div>
                        <div className="bg-bg-elevated border border-border rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
                                <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
                                <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick chips */}
            {messages.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                    {quickChips.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => handleSend(label)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border
                                text-xs text-text-secondary hover:text-accent hover:border-accent/30 transition-all whitespace-nowrap shrink-0 shadow-sm"
                        >
                            <Icon size={12} />
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="mt-3 flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about SMK..."
                    className="input-field flex-1"
                    disabled={isTyping}
                />
                <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="btn-primary px-4 shrink-0"
                >
                    {isTyping ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </div>
        </div>
    )
}
