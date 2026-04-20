import { useState, useRef, useEffect } from 'react'
import { useChatHistory } from '../hooks/useApi'
import { chatApi } from '../lib/api'
import { ChatMessageSkeleton } from '../components/Skeleton'

import { useAuthStore } from '../store/authStore'
import { useTranslation, Language } from '../lib/translations'
import {
    Send, Bot, User, Loader2,
    Paperclip, Mic, RotateCcw, MessageSquarePlus,
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp?: string
    metadata?: any
}

// This will be overridden in the component
let suggestedInquiries = [
    "What time does the library close?",
    "When is the next bus to center?",
    "Show me today's lunch menu",
    "WIFI password help"
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

const messageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
        },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

/* ── component ──────────────────────────────────────── */

export default function ChatPage() {
    const { user } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)

    // Override suggestions
    suggestedInquiries = t.chatSuggested

    const [input, setInput] = useState('')

    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { data: historyData, isLoading } = useChatHistory()

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

        // Add a placeholder for the AI response
        const aiMsg: Message = {
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMsg])

        let fullContent = ''

        try {
            await chatApi.stream(message, (chunk) => {
                fullContent += chunk
                setMessages((prev) => {
                    const newMessages = [...prev]
                    const lastMsg = newMessages[newMessages.length - 1]
                    if (lastMsg && lastMsg.role === 'assistant') {
                        lastMsg.content = fullContent
                    }
                    return newMessages
                })
            })
        } catch (error) {
            console.error('Streaming error:', error)
            setMessages((prev) => {
                const newMessages = [...prev]
                const lastMsg = newMessages[newMessages.length - 1]
                if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                    lastMsg.content = t.genericError || 'Something went wrong.'
                }
                return newMessages
            })
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

    const handleClearHistory = async () => {
        try {
            await chatApi.clearHistory()
            setMessages([])
        } catch (error) {
            console.error('Failed to clear history:', error)
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col h-[calc(100vh-8rem)] max-w-[1200px] mx-auto relative px-4"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between py-6 px-10 bg-white/90 backdrop-blur-xl border border-slate-100/50 rounded-[32px] shadow-sm sticky top-4 z-20"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{t.aiOnline}</p>
                    </div>
                </div>


                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-500 transition-all border border-transparent hover:border-slate-100"
                    >
                        <RotateCcw size={14} /> {t.clearHistory}
                    </motion.button>
                    <motion.button
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-500 transition-all border border-transparent hover:border-slate-100"
                    >
                        <MessageSquarePlus size={14} /> {t.feedback}
                    </motion.button>

                </div>
            </motion.div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto pt-10 pb-32 space-y-12 scrollbar-hide">
                {isLoading ? (
                    <div className="space-y-10">
                        <ChatMessageSkeleton />
                        <ChatMessageSkeleton />
                    </div>
                ) : messages.length === 0 ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center space-y-8 py-20"
                    >
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/30"
                        >
                            <Bot size={40} className="text-white" />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.helloHello}</h2>
                            <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                                {t.aiIntro}
                            </p>
                        </div>

                    </motion.div>
                ) : (
                    <div className="space-y-12 overflow-x-hidden">
                        <AnimatePresence initial={false} mode="popLayout">
                            {messages.map((msg, index) => (
                                <motion.div
                                    layout
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    key={index}
                                    className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    {/* Message Sender Info */}
                                    <div className={`flex items-center gap-3 mb-1 ${msg.role === 'user' ? 'flex-row-reverse text-right pr-2' : 'pl-2'}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-slate-100' : 'bg-accent'}`}>
                                            {msg.role === 'user' ? <User size={16} className="text-slate-500" /> : <Bot size={16} className="text-white" />}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                                            {msg.role === 'user' ? t.me : t.labasAi}
                                        </span>
                                    </div>


                                    {/* Message Bubble */}
                                    <div className={`max-w-[85%] md:max-w-[70%] text-sm font-medium leading-relaxed relative ${msg.role === 'user'
                                        ? 'bg-accent text-white rounded-[32px] rounded-tr-md p-6 shadow-xl shadow-accent/10'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-[32px] rounded-tl-md p-7 shadow-sm'
                                        }`}>
                                        {msg.content}

                                        {/* Structured Content Blocks (Mockup style for AI responses) */}
                                        {msg.role === 'assistant' && msg.content.includes('Room 305') && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                <div className="bg-slate-50 p-5 rounded-2xl border-l-4 border-accent space-y-2">
                                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wide">{t.routeInstructions}</h4>
                                                    <p className="text-[12px] text-slate-500 leading-snug">Take the elevator near the lobby to the 3rd floor, then turn left past the lounge area.</p>
                                                </div>
                                                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wide">{t.status}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="px-2 py-0.5 bg-lime-400 text-[9px] font-black text-slate-900 uppercase rounded">{t.open}</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{t.nextClass.replace('{time}', '14:30')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Suggested Inquiries (Floating style) */}
                <motion.div variants={containerVariants} className="space-y-4 pt-10 text-center">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-wide">{t.suggestedInquiriesLabel}</p>
                    <div className="flex flex-wrap justify-center gap-2 px-8">
                        {suggestedInquiries.map((chip, i) => (
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                key={i}
                                onClick={() => handleSend(chip)}
                                className="px-5 py-2.5 bg-red-50/50 hover:bg-accent hover:text-white text-slate-600 text-[11px] font-bold rounded-full transition-all border border-red-100/50 shadow-sm"
                            >
                                "{chip}"
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <div ref={messagesEndRef} />
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-8 left-0 right-0 px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-[800px] mx-auto bg-white border border-slate-100 rounded-[32px] p-2 flex items-center gap-2 shadow-2xl shadow-slate-900/10 focus-within:ring-4 focus-within:ring-accent/5 transition-all"
                >
                    <motion.button
                        whileHover={{ scale: 1.1, color: '#475569' }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3.5 text-slate-400 transition-colors"
                    >
                        <Paperclip size={20} />
                    </motion.button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.askAnythingPlaceholder}
                        className="flex-1 bg-transparent py-4 text-sm font-medium outline-none text-slate-800 placeholder:text-slate-300 px-2"
                        disabled={isTyping}
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <motion.button
                            whileHover={{ scale: 1.1, color: '#475569' }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3.5 text-slate-400 transition-colors"
                        >
                            <Mic size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: input.trim() && !isTyping ? 1.05 : 1 }}
                            whileTap={{ scale: input.trim() && !isTyping ? 0.95 : 1 }}
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className={`p-4 rounded-2xl transition-all shadow-lg ${!input.trim() || isTyping
                                ? 'bg-slate-100 text-slate-300 shadow-none'
                                : 'bg-accent text-white shadow-accent/20'
                                }`}
                        >
                            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
