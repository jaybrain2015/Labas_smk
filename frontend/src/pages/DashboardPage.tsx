import { useAuthStore } from '../store/authStore'
import {
    Star, ArrowRight, ChevronLeft, ChevronRight,
    Search, Award, Target, BookOpen
} from 'lucide-react'

// Specific data to mimic mockup
const RECOMMENDED_SKILLS = [
    { title: 'Accounting', action: 'Learn Skill', icon: Award },
    { title: 'Copywriting', action: 'Learn Skill', icon: Target },
    { title: 'Finance', action: 'Learn Skill', icon: BookOpen },
]

export default function DashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* 1. Hero Card: Skills level points */}
            <div className="bg-white rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-10 shadow-card">
                {/* 1a. Circular Score Visualization */}
                <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        {/* Multi-color segments (approximate) */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#9b1c1c" strokeWidth="7" strokeDasharray="210 282" strokeLinecap="round" /> {/* Red segment */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#ffb703" strokeWidth="7" strokeDasharray="70 282" strokeDashoffset="-215" strokeLinecap="round" /> {/* Yellow segment */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#219ebc" strokeWidth="7" strokeDasharray="40 282" strokeDashoffset="-290" strokeLinecap="round" /> {/* Blue segment */}
                    </svg>
                    <div className="absolute inset-2 rounded-full border-2 border-[#f1f5f9] flex items-center justify-center p-2">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=e63946&color=fff`}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* 1b. Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <span className="text-7xl font-heading font-black text-text-primary tracking-tighter">86</span>
                        <div>
                            <h3 className="text-xl font-heading font-bold text-text-primary">Your skills level points</h3>
                            <p className="text-sm text-text-muted mt-1 max-w-xs">
                                Keep it up and improve your skills!
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1c. Rating Side Info */}
                <div className="md:border-l border-border/50 md:pl-10 text-center md:text-right">
                    <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">Rating</p>
                    <p className="text-4xl font-heading font-black text-text-primary">4.5</p>
                    <div className="flex items-center justify-center md:justify-end gap-1 mt-1 text-yellow-400">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} />)}
                    </div>
                </div>
            </div>

            {/* 2. Middle Row: Your skills & Your Ratings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2a. Your Skills Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-card flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-heading font-bold text-text-primary">Your skills</h3>
                        <button className="text-sidebar-red text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            See More <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
                        {/* Circular Chart Component */}
                        <div className="relative w-44 h-44 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#9b1c1c" strokeWidth="12" strokeDasharray="180 251" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="#ffb703" strokeWidth="8" strokeDasharray="120 188" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-heading font-black text-text-primary leading-none">86</span>
                                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Points</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 w-full space-y-4">
                            {[
                                { label: 'Programming', value: 85, color: '#9b1c1c' },
                                { label: 'Design', value: 75, color: '#ffb703' },
                                { label: 'Editing', value: 50, color: '#219ebc' },
                                { label: 'Marketing', value: 55, color: '#8e44ad' },
                            ].map((skill) => (
                                <div key={skill.label} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 font-bold text-text-secondary uppercase tracking-tight">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: skill.color }} />
                                            {skill.label}
                                        </div>
                                        <span className="text-text-muted font-medium">{skill.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${skill.value}%`, backgroundColor: skill.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2b. Your Ratings Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-card flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-heading font-bold text-text-primary">Your Ratings</h3>
                        <button className="text-sidebar-red text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            See More <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 flex-1">
                        {/* Main Rating */}
                        <div className="flex flex-col justify-center text-center md:text-left md:border-r border-border/50 pr-10 shrink-0">
                            <p className="text-7xl font-heading font-black text-text-primary leading-none">4.5<span className="text-2xl text-text-muted font-normal">/5</span></p>
                            <div className="flex items-center justify-center md:justify-start gap-1 mt-4 text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill={i <= 4 ? "currentColor" : "none"} />)}
                            </div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-6">
                                <span className="text-sidebar-red">164</span> Completed requests
                            </p>
                        </div>

                        {/* Recent Reviews List */}
                        <div className="flex-1 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                        <img src={`https://i.pravatar.cc/100?u=rating${i}`} alt="user" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-text-primary">Design UI/UX for X Company</h4>
                                        <p className="text-[10px] text-text-muted mt-0.5">Created By Request Manager</p>
                                        <div className="flex items-center gap-1 mt-1 text-yellow-400">
                                            {[1, 2, 3, 4, 5].map(j => <Star key={j} size={10} fill={j <= 4 ? "currentColor" : "none"} />)}
                                            <span className="text-[10px] text-text-muted font-bold ml-1">4.5</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Row: Recommended skills */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-text-primary flex items-center gap-2">
                        Recommended skills <span className="text-text-muted font-normal"><Award size={16} /></span>
                    </h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full border border-border/60 hover:bg-white transition-colors text-text-muted hover:text-text-primary shadow-sm">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="p-2 rounded-full border border-border/60 bg-sidebar-red text-white transition-opacity hover:opacity-90 shadow-md translate-x-1">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {RECOMMENDED_SKILLS.map((skill, idx) => {
                        const Icon = skill.icon;
                        return (
                            <div key={idx} className="bg-white rounded-[28px] p-6 shadow-card group hover:shadow-card-hover transition-all flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f4f7fa] flex items-center justify-center text-text-muted group-hover:bg-sidebar-red/10 group-hover:text-sidebar-red transition-colors">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{skill.title}</p>
                                        <h4 className="text-sm font-bold text-text-primary">{skill.action}</h4>
                                    </div>
                                </div>
                                <div className="p-1 text-text-muted group-hover:text-sidebar-red transition-colors">
                                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
