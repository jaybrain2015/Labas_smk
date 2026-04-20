import { useState } from 'react'
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../../hooks/useApi'
import {
    MessageCircle, Plus, Trash2, Edit2, Save, X,
    Search, HelpCircle, Check, AlertCircle, Loader2, Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FaqManagement() {
    const { data: faqsData, isLoading } = useFaqs()
    const createMutation = useCreateFaq()
    const updateMutation = useUpdateFaq()
    const deleteMutation = useDeleteFaq()

    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'general',
        language: 'lt',
    })

    const faqs = faqsData?.data || []

    const filteredFaqs = faqs.filter((f: any) =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category?.toLowerCase()?.includes(searchQuery.toLowerCase())
    )

    const handleEdit = (faq: any) => {
        setEditingId(faq.id)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || 'general',
            language: faq.language || 'lt',
        })
        setIsAdding(false)
    }

    const resetForm = () => {
        setFormData({
            question: '',
            answer: '',
            category: 'general',
            language: 'lt',
        })
        setEditingId(null)
        setIsAdding(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await updateMutation.mutateAsync({ id: editingId, data: formData })
            } else {
                await createMutation.mutateAsync(formData)
            }
            resetForm()
        } catch (err) {
            console.error('Failed to save FAQ', err)
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this FAQ? This will remove it from the AI knowledge base.')) {
            await deleteMutation.mutateAsync(id)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="section-title flex items-center gap-2">
                    <HelpCircle size={20} className="text-secondary" />
                    Knowledge Base (FAQs)
                </h2>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-accent/20 outline-none w-48 md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); setIsAdding(true) }}
                        className="btn btn-primary flex items-center gap-2 text-xs py-1.5"
                    >
                        <Plus size={16} /> Add FAQ
                    </button>
                </div>
            </div>

            <p className="text-sm text-text-secondary max-w-2xl bg-accent/5 p-4 rounded-2xl border border-accent/10">
                <Info className="inline-block mr-2 text-accent" size={16} />
                Information added here is automatically indexed by the "Labas SMK" AI assistant to help answer student questions accurately.
            </p>

            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-6 border-accent/20 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-text-primary flex items-center gap-2">
                                {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                                {editingId ? 'Edit FAQ Entry' : 'New Knowledge Base Entry'}
                            </h3>
                            <button onClick={resetForm} className="p-1 hover:bg-bg-hover rounded-full"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Question / Topic</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.question}
                                            onChange={e => setFormData({ ...formData, question: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                            placeholder="What is the WiFi password?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Official Answer / Data</label>
                                        <textarea
                                            required
                                            value={formData.answer}
                                            onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none h-32 resize-none"
                                            placeholder="Provide the detailed information the AI should know..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 bg-bg-hover/50 p-4 rounded-2xl border border-border/50 h-fit">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 flex items-center gap-2">
                                            <Globe size={12} /> Language
                                        </label>
                                        <select
                                            value={formData.language}
                                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-accent/20 outline-none"
                                        >
                                            <option value="en">English (EN)</option>
                                            <option value="lt">Lithuanian (LT)</option>
                                            <option value="ru">Russian (RU)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5">Category</label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-accent/20 outline-none"
                                            placeholder="e.g. IT, Admin, Library"
                                        />
                                    </div>

                                    <div className="pt-4 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                                        >
                                            {(createMutation.isPending || updateMutation.isPending) ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : <Save size={16} />}
                                            {editingId ? 'Update Info' : 'Save to KB'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="w-full py-2 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors text-center"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq: any) => (
                        <motion.div
                            layout
                            key={faq.id}
                            className="bg-white p-5 rounded-2xl border border-border hover:border-accent/30 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full bg-bg-hover text-[9px] font-black uppercase text-text-secondary tracking-wider">
                                            {faq.category || 'General'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-wider">
                                            {faq.language?.toUpperCase() || 'LT'}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-bold text-text-primary flex items-start gap-2">
                                        <MessageCircle size={16} className="text-accent mt-0.5 shrink-0" />
                                        {faq.question}
                                    </h4>
                                    <p className="text-xs text-text-secondary leading-relaxed pl-6 line-clamp-2 italic">
                                        "{faq.answer}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 rounded-lg hover:bg-danger/5 text-text-muted hover:text-danger transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center p-12 bg-white rounded-3xl border border-border border-dashed">
                        <HelpCircle size={40} className="mx-auto text-text-muted/30 mb-3" />
                        <p className="text-sm text-text-muted font-medium">No knowledge base entries found.</p>
                        <p className="text-xs text-text-muted/60 mt-1">Start by adding common questions and school information.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function Info({ className, size }: { className?: string, size?: number }) {
    return <AlertCircle className={className} size={size} />
}
