import { useState } from 'react'
import { useRoomAvailability, useRoom } from '../hooks/useApi'
import { RoomCardSkeleton } from '../components/Skeleton'
import {
    DoorOpen, X, Users, Monitor, MapPin, Clock, Layers,
    Wifi, Building2,
} from 'lucide-react'

export default function RoomsPage() {
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
    const [floorFilter, setFloorFilter] = useState<number | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const { data: roomsData, isLoading } = useRoomAvailability()
    const { data: roomDetail, isLoading: detailLoading } = useRoom(selectedRoom!)

    const rooms = roomsData?.data || []
    const detail = roomDetail?.data

    const filteredRooms = rooms.filter((room: any) => {
        if (floorFilter !== null && room.floor !== floorFilter) return false
        if (statusFilter && room.status !== statusFilter) return false
        return true
    })

    const floors = [...new Set(rooms.map((r: any) => r.floor))].sort() as number[]

    const statusCounts = {
        free: rooms.filter((r: any) => r.status === 'free').length,
        soon: rooms.filter((r: any) => r.status === 'soon').length,
        busy: rooms.filter((r: any) => r.status === 'busy').length,
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="page-title flex items-center gap-2">
                    <DoorOpen size={24} className="text-accent" />
                    Room Availability
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                    Real-time classroom status • Auto-refreshes every 60s
                </p>
            </div>

            {/* Status cards */}
            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => setStatusFilter(statusFilter === 'free' ? null : 'free')}
                    className={`glass-card p-4 flex flex-col items-center gap-1 cursor-pointer transition-all ${statusFilter === 'free' ? 'border-success shadow-card-hover' : ''}`}
                >
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse-slow" />
                    <p className="text-xl font-heading font-bold text-success">{statusCounts.free}</p>
                    <p className="text-xs text-text-muted">Free</p>
                </button>
                <button
                    onClick={() => setStatusFilter(statusFilter === 'soon' ? null : 'soon')}
                    className={`glass-card p-4 flex flex-col items-center gap-1 cursor-pointer transition-all ${statusFilter === 'soon' ? 'border-warning shadow-card-hover' : ''}`}
                >
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <p className="text-xl font-heading font-bold text-warning">{statusCounts.soon}</p>
                    <p className="text-xs text-text-muted">Soon Free</p>
                </button>
                <button
                    onClick={() => setStatusFilter(statusFilter === 'busy' ? null : 'busy')}
                    className={`glass-card p-4 flex flex-col items-center gap-1 cursor-pointer transition-all ${statusFilter === 'busy' ? 'border-danger shadow-card-hover' : ''}`}
                >
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <p className="text-xl font-heading font-bold text-danger">{statusCounts.busy}</p>
                    <p className="text-xs text-text-muted">Busy</p>
                </button>
            </div>

            {/* Floor filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-muted flex items-center gap-1">
                    <Layers size={14} /> Floor:
                </span>
                <button
                    onClick={() => setFloorFilter(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${floorFilter === null ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:text-text-primary shadow-sm'}`}
                >
                    All
                </button>
                {floors.map((floor) => (
                    <button
                        key={floor}
                        onClick={() => setFloorFilter(floorFilter === floor ? null : floor)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${floorFilter === floor ? 'bg-accent text-white' : 'bg-white border border-border text-text-secondary hover:text-text-primary shadow-sm'}`}
                    >
                        Floor {floor}
                    </button>
                ))}
            </div>

            <div className="flex gap-6">
                {/* Room grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Array.from({ length: 12 }).map((_, i) => <RoomCardSkeleton key={i} />)}
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-12 glass-card">
                            <DoorOpen size={40} className="mx-auto text-text-muted mb-3" />
                            <p className="text-text-secondary">No rooms match your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filteredRooms.map((room: any) => (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoom(room.id)}
                                    className={`glass-card-hover p-4 text-left cursor-pointer ${selectedRoom === room.id ? 'border-accent shadow-card-hover' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-base font-heading font-bold text-text-primary">
                                            {room.number}
                                        </p>
                                        <span className={room.status === 'free' ? 'badge-green' : room.status === 'soon' ? 'badge-yellow' : 'badge-red'}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'free' ? 'bg-success' : room.status === 'soon' ? 'bg-warning' : 'bg-danger'}`} />
                                            {room.status === 'free' ? 'Free' : room.status === 'soon' ? 'Soon' : 'Busy'}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs text-text-muted">
                                        <p className="flex items-center gap-1.5"><Building2 size={12} /> Floor {room.floor} • {room.building || 'Building A'}</p>
                                        <p className="flex items-center gap-1.5"><Users size={12} /> {room.capacity} seats</p>
                                        <p className="flex items-center gap-1.5 capitalize"><Monitor size={12} /> {room.type}</p>
                                    </div>
                                    {room.current_class && (
                                        <div className="mt-2 pt-2 border-t border-border">
                                            <p className="text-[10px] text-text-muted">Current:</p>
                                            <p className="text-xs text-text-secondary truncate">{room.current_class}</p>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room detail panel */}
                {selectedRoom && (
                    <div className="hidden lg:block w-[320px] shrink-0">
                        <div className="glass-card p-5 sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="section-title">Room Details</h3>
                                <button onClick={() => setSelectedRoom(null)} className="p-1.5 rounded-lg hover:bg-bg-hover transition-colors">
                                    <X size={16} className="text-text-muted" />
                                </button>
                            </div>

                            {detailLoading ? (
                                <div className="space-y-3">
                                    <div className="skeleton h-6 w-20" />
                                    <div className="skeleton h-4 w-32" />
                                    <div className="skeleton h-4 w-28" />
                                </div>
                            ) : detail ? (
                                <div className="space-y-4">
                                    <div className="text-center p-4 rounded-xl bg-bg-hover">
                                        <p className="text-2xl font-heading font-bold text-text-primary">{detail.number}</p>
                                        <span className={`mt-2 ${detail.status === 'free' ? 'badge-green' : detail.status === 'soon' ? 'badge-yellow' : 'badge-red'}`}>
                                            {detail.status === 'free' ? '✓ Available' : detail.status === 'soon' ? '◐ Available soon' : '✗ Occupied'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted flex items-center gap-1.5"><Building2 size={14} /> Building</span>
                                            <span className="text-text-primary">{detail.building}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted flex items-center gap-1.5"><Layers size={14} /> Floor</span>
                                            <span className="text-text-primary">{detail.floor}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted flex items-center gap-1.5"><Users size={14} /> Capacity</span>
                                            <span className="text-text-primary">{detail.capacity} seats</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted flex items-center gap-1.5"><Monitor size={14} /> Type</span>
                                            <span className="text-text-primary capitalize">{detail.type}</span>
                                        </div>
                                    </div>

                                    {detail.equipment && detail.equipment.length > 0 && (
                                        <div>
                                            <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Equipment</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {detail.equipment.map((eq: string) => (
                                                    <span key={eq} className="badge bg-bg-hover text-text-secondary">{eq}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {detail.today_schedule && detail.today_schedule.length > 0 && (
                                        <div>
                                            <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Today's Schedule</p>
                                            <div className="space-y-2">
                                                {detail.today_schedule.map((item: any, idx: number) => (
                                                    <div key={idx} className="p-2.5 rounded-lg bg-bg-hover text-xs">
                                                        <p className="font-medium text-accent">{item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}</p>
                                                        <p className="text-text-primary mt-0.5">{item.subject}</p>
                                                        <p className="text-text-muted">{item.lecturer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted">Could not load room details</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
