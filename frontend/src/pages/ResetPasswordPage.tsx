import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi, getCsrfCookie } from '../lib/api'
import { useTranslation, Language } from '../lib/translations'

import campusBg from '../assets/campus-bg.webp'
import labsLogo from '../assets/labs-smk-logo.webp'
import './Login.css'

const W = 320, H = 72
const COLS = 80, ROWS = 18

type BtnState = 'idle' | 'loading' | 'success' | 'error'

function ResetPasswordPage() {
    const navigate = useNavigate()
    const { t } = useTranslation('en')

    const [searchParams] = useSearchParams()

    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [btnState, setBtnState] = useState<BtnState>('idle')
    const [message, setMessage] = useState<string | null>(null)
    const [btnHover, setBtnHover] = useState(false)
    const [btnPressed, setBtnPressed] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const simRef = useRef<{
        cur: Float32Array
        prev: Float32Array
        vel: Float32Array
        t: number
    } | null>(null)
    const mouseRef = useRef({ x: -1, y: -1, inside: false })
    const drainRef = useRef(0)
    const rafRef = useRef<number>(0)

    const token = searchParams.get('token')
    const email = searchParams.get('email')

    useEffect(() => {
        const size = COLS * ROWS
        simRef.current = {
            cur: new Float32Array(size),
            prev: new Float32Array(size),
            vel: new Float32Array(size),
            t: 0,
        }
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

        const tick = () => {
            const sim = simRef.current!
            sim.t += 0.016
            const { cur, vel } = sim
            const state = btnState
            const mouse = mouseRef.current

            if (state === 'loading') drainRef.current = Math.min(0.54, drainRef.current + 0.007)
            else if (state === 'success') drainRef.current = Math.min(1.08, drainRef.current + 0.013)
            else drainRef.current = Math.max(0, drainRef.current - 0.014)

            const drain = drainRef.current
            const isHover = mouse.inside

            if (isHover) {
                const mc = Math.floor(mouse.x * COLS), mr = Math.floor(mouse.y * ROWS)
                for (let dc = -2; dc <= 2; dc++) for (let dr = -2; dr <= 2; dr++) {
                    const nc = mc + dc, nr = mr + dr
                    if (nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS) vel[idx(nc, nr)] -= 3.2 * Math.exp(-Math.sqrt(dc * dc + dr * dr) * 0.7)
                }
            }

            for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
                const i = idx(c, r)
                const lap = cur[idx(c - 1, r)] + cur[idx(c + 1, r)] + cur[idx(c, r - 1)] + cur[idx(c, r + 1)] - 4 * cur[i]
                vel[i] = (vel[i] + 0.22 * lap) * 0.982; sim.prev[i] = cur[i]
            }
            for (let i = 0; i < cur.length; i++) cur[i] = Math.max(-4, Math.min(4, cur[i] + vel[i]))

            ctx.clearRect(0, 0, W, H)
            ctx.fillStyle = '#120202'
            ctx.fillRect(0, 0, W, H)

            const fluidTopY = H * drain
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(0, fluidTopY)
            for (let x = 0; x <= W; x += 3) {
                const wy = fluidTopY + Math.sin((x / W) * Math.PI * 3 + sim.t * 2.4) * (2 + drain * 3.5)
                ctx.lineTo(x, wy)
            }
            ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.clip()

            const bg = ctx.createLinearGradient(0, fluidTopY, 0, H)
            bg.addColorStop(0, '#bf2626'); bg.addColorStop(1, '#450a0a')
            ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

            for (let r = 1; r < ROWS - 1; r++) for (let c = 1; c < COLS - 1; c++) {
                if (Math.abs(cur[idx(c, r)]) < 0.01) continue
                const dx = cur[idx(c + 1, r)] - cur[idx(c - 1, r)], dy = cur[idx(c, r + 1)] - cur[idx(c, r - 1)]
                const b = Math.tanh((dx * -0.6 + dy * -0.9) * 0.9), a = Math.abs(b) * 0.55
                ctx.fillStyle = b > 0 ? `rgba(255,160,130,${a})` : `rgba(40,0,0,${a * 0.8})`
                ctx.fillRect(c * cw, r * ch, cw + 0.5, ch + 0.5)
            }
            ctx.restore()
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafRef.current)
    }, [btnState])
    const handleSubmit = async () => {
        if (!password || !passwordConfirmation) {
            setErrors({ password: 'Both password fields are required' })
            return
        }
        if (password !== passwordConfirmation) {
            setErrors({ password: 'Passwords do not match' })
            return
        }
        if (password.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters' })
            return
        }

        setBtnState('loading')
        setErrors({})
        try {
            await getCsrfCookie()
            await authApi.resetPassword({
                token: token || '',
                email: email || '',
                password,
                password_confirmation: passwordConfirmation
            })
            setBtnState('success')
            setMessage(t.passwordUpdated)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err: any) {
            setBtnState('error')
            setErrors({ api: err.response?.data?.message || 'Failed to reset password' })
            setTimeout(() => setBtnState('idle'), 1000)
        }
    }


    if (!token || !email) {
        return (
            <div className="login-page">
                <div className="login-left flex flex-col justify-center items-center text-center">
                    <h1 className="text-red-500 mb-4">Invalid Reset Link</h1>
                    <p className="mb-6">This password reset link is invalid or malformed.</p>
                    <button onClick={() => navigate('/login')} className="bg-[#9b1c1c] text-white px-6 py-2 rounded-xl">{t.backToLogin}</button>
                </div>

            </div>
        )
    }

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-heading">
                    <h1>{t.resetPasswordTitle.split(' ')[0]} <span>{t.resetPasswordTitle.split(' ')[1]}</span></h1>
                    <p>{t.resetPasswordDesc}</p>
                </div>


                {message ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl text-sm mb-6">
                        {message}
                    </div>
                ) : (
                    <>
                        {errors.api && <div className="login-error">{errors.api}</div>}
                        <div className="login-form-card">
                            <div className="login-field">
                                <label>{t.newPassword}</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t.passwordPlaceholder}
                                />
                            </div>

                            <div className="login-field">
                                <label>{t.confirmPassword}</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder={t.passwordPlaceholder}
                                />

                                {errors.password && <p className="login-field-error">{errors.password}</p>}
                            </div>
                            <button
                                type="button"
                                className="login-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ top: 'auto', bottom: '65px' }}
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
                        </div>

                        <div className="login-btn-wrap" style={{ marginTop: '2rem' }}>
                            <button
                                className={`login-btn ${btnState !== 'idle' ? `login-btn--${btnState}` : ''}`}
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => { setBtnHover(false); handleMouseLeave() }}
                                onMouseMove={handleMouseMove}
                                onMouseDown={() => setBtnPressed(true)}
                                onMouseUp={() => setBtnPressed(false)}
                                onClick={handleSubmit}
                            >
                                <canvas ref={canvasRef} width={W} height={H} className="login-canvas" />
                                <span className="login-track" style={{ transform: `translateX(${btnState === 'loading' ? -W : btnState === 'success' ? -W * 2 : 0}px)` }}>
                                    <span className="login-label">{t.resetPasswordBtn}</span>
                                    <span className="login-label"><span className="login-spinner" />{t.saving.replace('...', '…')}</span>
                                    <span className="login-label">{t.passwordResetSuccess}!</span>
                                </span>

                            </button>
                        </div>
                    </>
                )}

                <p className="login-signup-link" style={{ zIndex: 10, position: 'relative' }}>
                    {t.backToLogin.split(' ')[0]} {t.backToLogin.split(' ')[1]} <button type="button" onClick={() => navigate('/login')}>{t.backToLogin.split(' ')[2]}</button>
                </p>


                <div className="login-logo" style={{ marginTop: '2rem' }}>


                    <img src={labsLogo} alt="Logo" className="login-logo-img" />
                </div>
            </div>
            <div className="login-right">
                <img src={campusBg} alt="Campus" />
            </div>
        </div>
    )
}

export default ResetPasswordPage
