import { useState, useMemo } from 'react'
import { useRoomAvailability, useRoom } from '../hooks/useApi'
import { RoomCardSkeleton } from '../components/Skeleton'
import {
    DoorOpen, X, Users, Monitor, MapPin, Search, Bell, Zap, Info, ArrowRight, Wifi,
} from 'lucide-react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useTranslation, Language } from '../lib/translations'
import { useAuthStore } from '../store/authStore'



import auditoriumImg from '../assets/room-auditorium.png'

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

const sidebarVariants: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 26,
        }
    },
    exit: { x: -20, opacity: 0 },
}

/* ── component ──────────────────────────────────────── */

export default function RoomsPage() {
    const { user } = useAuthStore()
    const { t } = useTranslation(user?.language_preference as Language)
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const { data: roomsData, isLoading } = useRoomAvailability()
    const { data: roomDetail, isLoading: detailLoading } = useRoom(selectedRoomId!)


    const rooms = roomsData?.data || []
    const detail = roomDetail?.data

    // If no room is selected, default to the first one for the analytics sidebar (mockup style)
    const activeRoom = useMemo(() => {
        if (selectedRoomId) return detail;
        return rooms[0];
    }, [selectedRoomId, detail, rooms]);

    const filteredRooms = rooms.filter((room: any) => {
        const matchesStatus = statusFilter ? room.status === statusFilter : true;
        const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.building || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    })

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'free': return {
                label: t.filterAvailable,
                dot: 'bg-lime-500',
                chip: 'bg-lime-400/20 text-lime-700',
                card: 'border-white hover:border-lime-100 shadow-[0_4px_30px_-4px_rgba(163,230,53,0.06)]'
            };
            case 'busy': return {
                label: t.filterBusy,
                dot: 'bg-red-500',
                chip: 'bg-red-50 text-red-600',
                card: 'border-red-50 hover:border-red-100 shadow-[0_4px_30px_-4px_rgba(239,68,68,0.04)]'
            };
            case 'soon': return {
                label: t.filterSoon,
                dot: 'bg-amber-500',
                chip: 'bg-amber-50 text-amber-600',
                card: 'border-amber-50 hover:border-amber-100 shadow-[0_4px_30px_-4px_rgba(245,158,11,0.04)]'
            };
            default: return { label: t.unknown, dot: 'bg-slate-300', chip: 'bg-slate-100 text-slate-500', card: 'border-slate-100 shadow-sm' };

        }
    }

    const getFloorLabel = (roomNumber: string) => {
        const firstDigit = (roomNumber || '').charAt(0);
        if (firstDigit === '1') return t.groundFloor;
        if (firstDigit === '2') return t.secondFloor;
        if (firstDigit === '3') return t.thirdFloor;
        return `${firstDigit}${t.levelSuffix} ${t.levelLabel}`;
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-12 pb-16 max-w-[1440px] mx-auto px-6"
        >
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 space-y-12">

                {/* Search Bar & Top Bar info */}
                <motion.div variants={itemVariants} className="flex items-center justify-between pt-4">
                    <div className="relative group w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder={t.roomsSearchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100/50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-900/5 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium transition-all outline-none text-slate-600"
                        />

                    </div>
                </motion.div>

                {/* Header Text */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                        {t.roomsTitle}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                        {t.roomsSubTitle}
                    </p>
                </motion.div>

                {/* Status Filter Chips (Lighter and more elegant) */}
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStatusFilter(null)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${!statusFilter ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                        {t.filterAll}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStatusFilter('free')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'free' ? 'bg-lime-400 text-slate-900 border-lime-400' : 'bg-white text-slate-400 border-slate-100 hover:border-lime-200'}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-lime-600" /> {t.filterAvailable}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStatusFilter('busy')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'busy' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-400 border-slate-100 hover:border-red-100'}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {t.filterBusy}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStatusFilter('soon')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${statusFilter === 'soon' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-white text-slate-400 border-slate-100 hover:border-amber-100'}`}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t.filterSoon}
                    </motion.button>

                </motion.div>

                {/* Room Grid (More Airy and Refined) */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)
                    ) : (
                        <AnimatePresence mode="popLayout" initial={false}>
                            {filteredRooms.map((room: any) => {
                                const styles = getStatusStyles(room.status);
                                return (
                                    <motion.button
                                        layout
                                        key={room.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedRoomId(room.id)}
                                        className={`relative p-8 rounded-[24px] bg-white border transition-shadow text-left flex flex-col justify-between h-[230px] ${selectedRoomId === room.id ? 'border-slate-900 ring-4 ring-slate-900/5' : styles.card
                                            }`}
                                    >
                                        {/* Icon Top Right */}
                                        <div className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                            <DoorOpen size={20} />
                                        </div>

                                        {/* Badge Top Left */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${styles.chip}`}>
                                                {styles.label}
                                            </span>
                                        </div>

                                        {/* Room Info */}
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                {room.name ? `${room.name} (${room.number})` : `${t.roomLabel} ${room.number}`}
                                            </h3>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                                {room.building || `Vilnius Campus`} <span className="w-1 h-1 bg-slate-100 rounded-full" /> {getFloorLabel(room.number)}
                                            </p>


                                        </div>

                                        {/* Footer Stats (Simplified) */}
                                        <div className="pt-6 mt-4 border-t border-slate-50 flex items-center justify-end">
                                            <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                <Info size={10} className="text-slate-200" /> {t.roomProjector}
                                            </div>
                                        </div>


                                        {/* Subtle progress bar for busy rooms */}
                                        {room.status === 'busy' && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50 overflow-hidden rounded-b-[24px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '75%' }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className="h-full bg-red-400/40"
                                                />
                                            </div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </motion.div>

                {/* Floor Plan (Simplified and Lighter) */}
                <motion.section variants={itemVariants} className="bg-white rounded-[32px] border border-slate-100 p-10 space-y-8 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 uppercase">{t.floorPlanTitle} - <span className="text-accent font-semibold">{getFloorLabel('200')}</span></h2>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{t.socialSciencesBuilding}</p>
                    </div>

                    <div className="aspect-[21/9] bg-slate-50/50 border border-slate-100/40 rounded-[28px] relative flex items-center justify-center p-12 overflow-hidden">
                        <div className="grid grid-cols-5 gap-4 w-full h-full max-w-4xl">
                            {['R201', 'R202'].map((room) => (
                                <motion.div
                                    key={room}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(163, 230, 53, 0.2)' }}
                                    className="bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center text-[11px] font-bold text-lime-700 transition-all cursor-pointer"
                                >
                                    {room}
                                </motion.div>
                            ))}
                            <div className="col-span-1" />
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="col-span-2 row-span-2 bg-red-50 border border-red-50 rounded-xl flex items-center justify-center text-[11px] font-bold text-red-500 hover:bg-red-100/50 transition-all cursor-pointer"
                            >
                                {t.libraryAnnex}
                            </motion.div>

                            <div className="col-span-3 h-12 flex items-center justify-center text-slate-200 font-semibold uppercase tracking-widest text-[7px]">{t.corridorEast}</div>

                            <motion.div
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(163, 230, 53, 0.2)' }}
                                className="col-span-1 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-center text-[11px] font-bold text-lime-700 transition-all cursor-pointer"
                            >
                                R205
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="col-span-4 bg-red-50/50 border border-red-50 rounded-xl flex items-center justify-center text-[11px] font-bold text-accent hover:bg-red-100/50 transition-all cursor-pointer font-heading"
                            >
                                {t.mainLounge}
                            </motion.div>

                        </div>

                        {/* Minimal Legend */}
                        <div className="absolute bottom-6 right-8 flex gap-6 text-[8px] font-bold uppercase text-slate-300 tracking-wide">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-lime-400" /> {t.available}</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {t.filterBusy}</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {t.filterSoon}</div>
                        </div>

                    </div>
                </motion.section>
            </div>

            {/* SIDEBAR ANALYTICS (Cleaner and less weight) */}
            <aside className="w-[360px] space-y-8">
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-2xl lg:sticky lg:top-8"
                >
                    {/* Header Image */}
                    <div className="relative h-56 overflow-hidden">
                        <img src={auditoriumImg} alt={t.roomView} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.2)' }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-5 left-5 w-8 h-8 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80"
                            title={t.close}
                        >
                            <X size={14} />

                        </motion.button>
                        <span className="absolute top-5 right-6 text-[9px] font-bold uppercase tracking-wide text-white/50 bg-black/5 px-2 py-1 rounded-md">{t.roomAnalytics}</span>
                        <div className="absolute bottom-6 left-8 text-white">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={activeRoom?.number}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-bold uppercase tracking-tight"
                                >
                                    {activeRoom?.name || activeRoom?.number || t.unknown}
                                </motion.h2>

                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Summary */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeRoom?.id}
                                variants={sidebarVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {activeRoom?.name ? `${activeRoom.name} (${activeRoom.number})` : `${t.roomLabel} ${activeRoom?.number || '302'}`}
                                    </h3>

                                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${activeRoom?.status === 'free' ? 'bg-lime-400 text-slate-900' : 'bg-red-50 text-red-600'}`}>
                                        {activeRoom?.status === 'free' ? t.available : t.filterBusy}
                                    </div>

                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                    <MapPin size={14} className="text-accent mb-0.5" /> {t.wingLabel} A, {getFloorLabel(activeRoom?.number || '')}
                                </p>

                            </motion.div>
                        </AnimatePresence>


                        {/* Tech Specs (Simplified) */}
                        <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
                            {[
                                { icon: Wifi, label: t.wifi },
                                { icon: Zap, label: t.power },
                                { icon: Monitor, label: t.avSetup },
                                { icon: Users, label: t.hcAccess },

                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                    <s.icon size={14} className="text-slate-300" /> {s.label}
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: '#9b1c1c' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-accent text-white font-bold text-[10px] tracking-wide uppercase rounded-xl shadow-xl shadow-accent/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Bell size={16} /> {t.requestBooking}
                        </motion.button>
                    </div>
                </motion.div>


            </aside>
        </motion.div>
    )
}
