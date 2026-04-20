import { useState } from 'react'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../../hooks/useApi'
import {
    Calendar, MapPin, Plus, Trash2, Edit2, Save, X,
    Image as ImageIcon, Newspaper, Info, Check, AlertCircle, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EventManagement() {
    const { data: eventsData, isLoading } = useEvents()
    const createMutation = useCreateEvent()
    const updateMutation = useUpdateEvent()
    const deleteMutation = useDeleteEvent()

    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        starts_at: '',
        ends_at: '',
        category: 'academic',
        is_editorial: false,
        editorial_category: '',
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const events = eventsData?.data || []

    const handleEdit = (event: any) => {
        setEditingId(event.id)
        setFormData({
            title: event.title,
            description: event.description || '',
            location: event.location || '',
            starts_at: event.starts_at ? event.starts_at.replace(' ', 'T').slice(0, 16) : '',
            ends_at: event.ends_at ? event.ends_at.replace(' ', 'T').slice(0, 16) : '',
            category: event.category,
            is_editorial: !!event.is_editorial,
            editorial_category: event.editorial_category || '',
        })
        setImagePreview(event.image_url)
        setIsAdding(false)
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            starts_at: '',
            ends_at: '',
            category: 'academic',
            is_editorial: false,
            editorial_category: '',
        })
        setImageFile(null)
        setImagePreview(null)
        setEditingId(null)
        setIsAdding(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value === null || value === undefined) return

            // Convert boolean to 1/0 for Laravel compatibility
            if (typeof value === 'boolean') {
                data.append(key, value ? '1' : '0')
            }
            // Only append date fields if they have a value
            else if ((key === 'starts_at' || key === 'ends_at') && value === '') {
                // Skip empty dates
            }
            else {
                data.append(key, String(value))
            }
        })
        if (imageFile) {
            data.append('image', imageFile)
        }

        try {
            if (editingId) {
                await updateMutation.mutateAsync({ id: editingId, data })
            } else {
                await createMutation.mutateAsync(data)
            }
            resetForm()
        } catch (err) {
            console.error('Failed to save event', err)
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
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
            <div className="flex items-center justify-between">
                <h2 className="section-title flex items-center gap-2">
                    <Calendar size={20} className="text-accent" />
                    Events & Editorial
                </h2>
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); setIsAdding(true) }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={18} /> Add New
                </button>
            </div>

            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-6 border-accent/20"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                            placeholder="Event Title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none h-24 resize-none"
                                            placeholder="Tell us about the event..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={formData.starts_at}
                                                onChange={e => setFormData({ ...formData, starts_at: e.target.value })}
                                                className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">End Time</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.ends_at}
                                                onChange={e => setFormData({ ...formData, ends_at: e.target.value })}
                                                className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                            placeholder="e.g. Room 204 or Microsoft Teams"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                        >
                                            <option value="academic">Academic</option>
                                            <option value="social">Social</option>
                                            <option value="deadline">Deadline</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/10">
                                        <input
                                            type="checkbox"
                                            id="is_editorial"
                                            checked={formData.is_editorial}
                                            onChange={e => setFormData({ ...formData, is_editorial: e.target.checked })}
                                            className="w-4 h-4 text-accent rounded focus:ring-accent/20"
                                        />
                                        <label htmlFor="is_editorial" className="text-sm font-bold text-text-primary flex items-center gap-2 cursor-pointer">
                                            <Newspaper size={16} className="text-accent" />
                                            Campus Editorial Article
                                        </label>
                                    </div>

                                    {formData.is_editorial && (
                                        <div>
                                            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Editorial Category</label>
                                            <input
                                                type="text"
                                                value={formData.editorial_category}
                                                onChange={e => setFormData({ ...formData, editorial_category: e.target.value })}
                                                className="w-full bg-bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-accent/20 outline-none"
                                                placeholder="e.g. STUDENT COUNCIL • WEDNESDAY"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Cover Image</label>
                                        <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-border hover:border-accent/40 transition-colors aspect-video bg-bg-hover">
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <label htmlFor="image-upload" className="cursor-pointer p-3 bg-white rounded-full text-accent shadow-lg">
                                                            <Edit2 size={20} />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <label htmlFor="image-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                                    <ImageIcon size={32} className="text-text-muted mb-2" />
                                                    <p className="text-xs text-text-muted font-medium">Upload Image</p>
                                                    <p className="text-[10px] text-text-muted/60 mt-1">Recommended 16:9 ratio</p>
                                                </label>
                                            )}
                                            <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="btn btn-primary px-8 flex items-center gap-2"
                                >
                                    {(createMutation.isPending || updateMutation.isPending) ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : <Save size={18} />}
                                    {editingId ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                    <div key={event.id} className="glass-card overflow-hidden border border-border group hover:border-accent/30 transition-all flex flex-col">
                        <div className="aspect-video relative overflow-hidden bg-bg-hover">
                            {event.image_url ? (
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.querySelector('.fallback-icon')!.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`fallback-icon w-full h-full flex items-center justify-center text-text-muted ${event.image_url ? 'hidden' : ''}`}>
                                <ImageIcon size={32} opacity={0.3} />
                            </div>
                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur shadow-sm text-[9px] font-black uppercase text-text-primary tracking-wide">
                                    {event.category}
                                </span>
                                {event.is_editorial && (
                                    <span className="px-2 py-0.5 rounded-full bg-accent text-white shadow-sm text-[9px] font-black uppercase tracking-wide">
                                        Editorial
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-1">{event.title}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted mb-3 font-medium">
                                <span className="flex items-center gap-1"><MapPin size={10} /> {event.location || 'TBA'}</span>
                            </div>

                            <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-border">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="p-2 rounded-lg hover:bg-accent/5 text-text-muted hover:text-accent transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="p-2 rounded-lg hover:bg-danger/5 text-text-muted hover:text-danger transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
