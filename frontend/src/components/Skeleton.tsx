import { motion, Variants } from 'framer-motion'

interface SkeletonProps {
    className?: string
}

const pulseVariants: Variants = {
    initial: { opacity: 0.4 },
    animate: {
        opacity: [0.4, 0.7, 0.4],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
            className={`bg-slate-200 rounded ${className}`}
        />
    )
}

export function CardSkeleton() {
    return (
        <div className="glass-card p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
        </div>
    )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
            ))}
        </div>
    )
}

export function ChatMessageSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    )
}

export function ScheduleBlockSkeleton() {
    return (
        <div className="glass-card p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    )
}

export function RoomCardSkeleton() {
    return (
        <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
        </div>
    )
}

export function EventCardSkeleton() {
    return (
        <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-3 w-full" />
        </div>
    )
}
