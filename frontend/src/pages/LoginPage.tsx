import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi, getCsrfCookie } from '../lib/api'
import campusBg from '../assets/campus-bg.png'
import labsLogo from '../assets/labs-smk-logo.png'
import './Login.css'

const W = 320, H = 72
const COLS = 80, ROWS = 18

type BtnState = 'idle' | 'loading' | 'success' | 'error'

function LoginPage() {
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isFlipped, setIsFlipped] = useState(false)
    const [btnHover, setBtnHover] = useState(false)
    const [btnPressed, setBtnPressed] = useState(false)
    const [btnState, setBtnState] = useState<BtnState>('idle')
    const [isFormHovered, setIsFormHovered] = useState(false)

    const unflipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearTimer = () => {
        if (unflipTimer.current) {
            clearTimeout(unflipTimer.current)
            unflipTimer.current = null
        }
    }

    useEffect(() => {
        return () => clearTimer()
    }, [])

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const simRef = useRef<{
        cur: Float32Array
        prev: Float32Array
        vel: Float32Array
        t: number
    } | null>(null)
    const mouseRef = useRef({ x: -1, y: -1, inside: false })
    const hoverRef = useRef(false)
    const pressRef = useRef(false)
    const btnStateRef = useRef<BtnState>('idle')
    const drainRef = useRef(0)
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const size = COLS * ROWS
        simRef.current = {
            cur: new Float32Array(size),
            prev: new Float32Array(size),
            vel: new Float32Array(size),
            t: 0,
        }
    }, [])

    useEffect(() => { hoverRef.current = btnHover }, [btnHover])
    useEffect(() => { pressRef.current = btnPressed }, [btnPressed])
    useEffect(() => { btnStateRef.current = btnState }, [btnState])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!hoverRef.current) return
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseRef.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
            inside: true,
        }
    }, [])

    const handleMouseLeave = useCallback(() => {
        mouseRef.current.inside = false
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !simRef.current) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const cw = W / COLS, ch = H / ROWS
        const idx = (c: number, r: number) => r * COLS + c
        let lastMx = -1, lastMy = -1

        const tick = () => {
            const sim = simRef.current!
            sim.t += 0.016
            const { cur, vel } = sim
            const isHover = hoverRef.current
            const isPress = pressRef.current
            const mouse = mouseRef.current
            const state = btnStateRef.current

            if (state === 'loading') {
                drainRef.current = Math.min(0.54, drainRef.current + 0.007)
            } else if (state === 'success') {
                drainRef.current = Math.min(1.08, drainRef.current + 0.013)
            } else if (state === 'idle') {
                drainRef.current = Math.max(0, drainRef.current - 0.014)
            }
            const drain = drainRef.current

            if (isHover && mouse.inside) {
                const mc = Math.floor(mouse.x * COLS), mr = Math.floor(mouse.y * ROWS)
                if (mc !== lastMx || mr !== lastMy) {
                    for (let dc = -2; dc <= 2; dc++) for (let dr = -2; dr <= 2; dr++) {
                        const nc = mc + dc, nr = mr + dr
                        if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) vel[idx(nc, nr)] -= 3.2 * Math.exp(-Math.sqrt(dc * dc + dr * dr) * 0.7)
                    }
                    lastMx = mc; lastMy = mr
                }
            }
            if (isPress) {
                const cc = COLS / 2, cr = ROWS / 2
                for (let dc = -4; dc <= 4; dc++) for (let dr = -2; dr <= 2; dr++) {
                    const nc = Math.floor(cc + dc), nr = Math.floor(cr + dr)
                    if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) vel[idx(nc, nr)] -= 1.5 * Math.exp(-Math.sqrt(dc * dc * 0.5 + dr * dr) * 0.5)
                }
            }
            if (isHover) {
                for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
                    const i = idx(c, r)
                    const lap = cur[idx(c - 1, r)] + cur[idx(c + 1, r)] + cur[idx(c, r - 1)] + cur[idx(c, r + 1)] - 4 * cur[i]
                    vel[i] = (vel[i] + 0.22 * lap) * 0.982; sim.prev[i] = cur[i]
                }
                for (let i = 0; i < cur.length; i++) cur[i] = Math.max(-4, Math.min(4, cur[i] + vel[i]))
            } else {
                for (let i = 0; i < cur.length; i++) { vel[i] *= 0.88; cur[i] *= 0.92 }
            }

            ctx.clearRect(0, 0, W, H)
            ctx.fillStyle = '#120202'
            ctx.fillRect(0, 0, W, H)

            const fluidTopY = H * drain
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(0, fluidTopY)
            for (let x = 0; x <= W; x += 3) {
                const wy = fluidTopY
                    + Math.sin((x / W) * Math.PI * 3 + sim.t * 2.4) * (2 + drain * 3.5)
                    + Math.sin((x / W) * Math.PI * 6 + sim.t * 1.7) * (1.2 + drain * 2)
                    + Math.cos(sim.t * 1.3) * 1.5
                ctx.lineTo(x, wy)
            }
            ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
            ctx.clip()

            const bg = ctx.createLinearGradient(0, fluidTopY, 0, H)
            bg.addColorStop(0, '#bf2626')
            bg.addColorStop(0.3, '#991b1b')
            bg.addColorStop(0.7, '#7f1d1d')
            bg.addColorStop(1, '#450a0a')
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, W, H)

            if (isHover || cur.some(v => Math.abs(v) > 0.05)) {
                for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
                    if (Math.abs(cur[idx(c, r)]) < 0.01) continue
                    const dx = cur[idx(c + 1, r)] - cur[idx(c - 1, r)], dy = cur[idx(c, r + 1)] - cur[idx(c, r - 1)]
                    const b = Math.tanh((dx * -0.6 + dy * -0.9) * 0.9), a = Math.abs(b) * 0.55
                    ctx.fillStyle = b > 0 ? `rgba(255,160,130,${a})` : `rgba(40,0,0,${a * 0.8})`
                    ctx.fillRect(c * cw, r * ch, cw + 0.5, ch + 0.5)
                }
            }

            for (let band = 0; band < 2; band++) {
                const bx = W * (0.35 + Math.sin(sim.t * 0.12 + band * 1.3) * 0.2)
                const by = H * (0.25 + band * 0.45 + Math.sin(sim.t * 0.18 + band * 2.1) * 0.12)
                const g = ctx.createRadialGradient(bx, by, 0, bx, by, W * 0.28)
                g.addColorStop(0, `rgba(220,80,60,${0.12 + band * 0.04})`)
                g.addColorStop(0.5, 'rgba(160,30,20,0.06)')
                g.addColorStop(1, 'rgba(100,10,10,0)')
                ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
            }
            ctx.restore()

            if (drain > 0.01 && drain < 1.0) {
                const surfY = fluidTopY + Math.sin(sim.t * 1.3) * 1.5
                const men = ctx.createLinearGradient(0, surfY - 2, 0, surfY + 4)
                men.addColorStop(0, `rgba(255,190,160,${0.7 * (1 - drain * 0.5)})`)
                men.addColorStop(1, 'rgba(180,40,30,0)')
                ctx.fillStyle = men
                ctx.fillRect(0, surfY - 2, W, 6)

                if (state === 'loading' || state === 'success') {
                    for (let b = 0; b < 7; b++) {
                        const bx = W * (0.08 + b * 0.13 + Math.sin(sim.t * 1.2 + b) * 0.03)
                        const by2 = surfY + Math.sin(sim.t * 2.1 + b * 0.9) * 2.5
                        const br = 1.2 + Math.sin(sim.t * 3 + b) * 0.7
                        ctx.beginPath(); ctx.arc(bx, by2, br, 0, Math.PI * 2)
                        ctx.fillStyle = `rgba(255,150,120,${0.3 + Math.sin(sim.t * 2 + b) * 0.15})`
                        ctx.fill()
                    }
                }
            }

            if (drain > 0.04) {
                const stain = ctx.createLinearGradient(0, 0, 0, fluidTopY)
                stain.addColorStop(0, 'rgba(60,5,5,0)')
                stain.addColorStop(0.6, 'rgba(60,5,5,0)')
                stain.addColorStop(1, `rgba(100,12,12,${drain * 0.22})`)
                ctx.fillStyle = stain
                ctx.fillRect(0, 0, W, H)
            }

            const edge = ctx.createLinearGradient(0, 0, W, 0)
            edge.addColorStop(0, 'rgba(255,200,180,0.13)')
            edge.addColorStop(0.04, 'rgba(255,120,100,0.04)')
            edge.addColorStop(0.96, 'rgba(255,120,100,0.04)')
            edge.addColorStop(1, 'rgba(255,200,180,0.13)')
            ctx.fillStyle = edge; ctx.fillRect(0, 0, W, H)

            const bot = ctx.createLinearGradient(0, H * 0.55, 0, H)
            bot.addColorStop(0, 'rgba(0,0,0,0)'); bot.addColorStop(1, 'rgba(0,0,0,0.28)')
            ctx.fillStyle = bot; ctx.fillRect(0, 0, W, H)

            rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const validate = () => {
        const e: Record<string, string> = {}
        if (!email) e.email = 'Email is required'
        if (!password) e.password = 'Password is required'
        return e
    }

    const handleLogin = async () => {
        if (btnState !== 'idle') return
        const e = validate()
        setErrors(e)
        if (Object.keys(e).length > 0) return
        setBtnState('loading')
        try {
            await getCsrfCookie()
            const { data: response } = await authApi.login(email, password)
            if (response.success) {
                setBtnState('success')
                setAuth(response.data.user, response.data.token)
                setTimeout(() => navigate('/dashboard'), 900)
            } else {
                setBtnState('error')
                setErrors({ api: response.message || 'Login failed' })
                setTimeout(() => setBtnState('idle'), 820)
            }
        } catch (err: any) {
            setBtnState('error')
            setErrors({ api: err.response?.data?.message || 'Login failed. Please check your credentials.' })
            setTimeout(() => setBtnState('idle'), 820)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleLogin()
    }

    return (
        <>
            <div
                className={`login-page ${isFlipped ? 'login-page--flipped' : ''}`}
                onMouseLeave={() => {
                    clearTimer()
                    setIsFlipped(false)
                }}
            >
                {/* ---- Left: form ---- */}
                <div className="login-left">
                    <div className="login-heading">
                        <h1>
                            Welcome Back, <span>Please login</span>
                        </h1>
                        <p>to your account</p>
                    </div>

                    {errors.api && <div className="login-error">{errors.api}</div>}

                    <div
                        className={`login-form-card ${isFormHovered ? 'login-form-card--hover' : ''}`}
                        onMouseEnter={() => {
                            clearTimer()
                            setIsFormHovered(true)
                            unflipTimer.current = setTimeout(() => {
                                setIsFlipped(true)
                            }, 600)
                        }}
                        onMouseLeave={() => {
                            clearTimer()
                            setIsFormHovered(false)
                        }}
                    >
                        <div className="login-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    clearTimer()
                                    setEmail(e.target.value)
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="login-field-error">{errors.email}</p>
                            )}
                        </div>

                        <div className="login-field">
                            <label>Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    clearTimer()
                                    setPassword(e.target.value)
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                className="login-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                            {errors.password && (
                                <p className="login-field-error">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div className="login-meta">
                        <label className="login-remember">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember me
                        </label>
                        <button className="login-forgot">Forgot password?</button>
                    </div>

                    {/* FLUID GLASS BUTTON */}
                    <div className="login-btn-wrap">
                        <div className="login-glow" style={{ opacity: btnHover ? 0.28 : 0.10 }} />
                        <div className="login-rim" />
                        <button
                            className={`login-btn ${btnState !== 'idle' ? `login-btn--${btnState}` : ''}`}
                            disabled={btnState === 'loading' || btnState === 'success'}
                            onMouseEnter={() => setBtnHover(true)}
                            onMouseLeave={() => { setBtnHover(false); setBtnPressed(false); mouseRef.current.inside = false }}
                            onMouseMove={handleMouseMove}
                            onMouseDown={() => setBtnPressed(true)}
                            onMouseUp={() => setBtnPressed(false)}
                            onClick={handleLogin}
                            style={{ transform: `scale(${btnPressed && btnState === 'idle' ? 0.97 : btnHover && btnState === 'idle' ? 1.02 : 1})` }}
                        >
                            <canvas ref={canvasRef} width={W} height={H} className="login-canvas" />
                            <div className="login-hl-top" style={{ opacity: btnHover ? 0.55 : 0.28 }} />
                            <div className="login-hl-bot" />

                            <span
                                className="login-track"
                                style={{ transform: `translateX(${btnState === 'loading' ? -W : btnState === 'success' ? -W * 2 : 0}px)` }}
                            >
                                <span className="login-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: .75 }}>
                                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                                    </svg>
                                    Login
                                </span>
                                <span className="login-label">
                                    <span className="login-spinner" />
                                    Signing in…
                                </span>
                                <span className="login-label">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Welcome!
                                </span>
                            </span>
                        </button>
                    </div>

                    <p className="login-signup-link">
                        No account?{' '}
                        <button onClick={() => navigate('/signup')}>Create one</button>
                    </p>

                    <div className="login-logo">
                        <img
                            src={labsLogo}
                            alt="Labs SMK Logo"
                            className="login-logo-img"
                        />
                    </div>
                </div>

                {/* ---- Right: campus image ---- */}
                <div
                    className="login-right"
                    onMouseEnter={() => {
                        clearTimer()
                        unflipTimer.current = setTimeout(() => {
                            setIsFlipped(false)
                        }, 120000)
                    }}
                >
                    <img src={campusBg} alt="Campus" />
                </div>
            </div>

            {/* SVG burn filter */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <filter id="burn-edge" x="-10%" y="-5%" width="120%" height="110%" colorInterpolationFilters="sRGB">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.065"
                            numOctaves="4"
                            seed="8"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="22"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="displaced"
                        />
                        <feFlood floodColor="#3a1a00" floodOpacity="0.85" result="burnColor" />
                        <feComposite in="burnColor" in2="displaced" operator="in" result="burnMask" />
                        <feMorphology in="displaced" operator="dilate" radius="3" result="dilated" />
                        <feFlood floodColor="#1a0a00" floodOpacity="0.6" result="darkBurn" />
                        <feComposite in="darkBurn" in2="dilated" operator="in" result="darkEdge" />
                        <feMerge>
                            <feMergeNode in="darkEdge" />
                            <feMergeNode in="burnMask" />
                            <feMergeNode in="displaced" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </>
    )
}

export default LoginPage