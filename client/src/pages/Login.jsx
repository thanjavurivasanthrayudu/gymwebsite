import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DumbbellModel from '../threejs/DumbbellModel';
import ParticleBackground from '../threejs/ParticleBackground';
import gsap from 'gsap';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const cardRef = useRef(null);

    useEffect(() => {
        if (!authLoading && user) {
            const dest = user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/member';
            navigate(dest);
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        gsap.fromTo('.login-field', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.4 });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            const msg = err.message || 'Login failed';
            // Provide user-friendly error messages
            if (msg.includes('Invalid login credentials')) {
                setError('Invalid email or password. Please try again.');
            } else if (msg.includes('Email not confirmed')) {
                setError('Please confirm your email address before logging in. Check your inbox.');
            } else {
                setError(msg);
            }
            gsap.fromTo('.error-box', { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        }
        setLoading(false);
    };

    // Show a loading spinner while auth session is being resolved
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="w-10 h-10 border-3 border-neon border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <ParticleBackground />
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '960px',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    background: 'rgba(17, 17, 17, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(57, 255, 20, 0.1)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(57, 255, 20, 0.03)',
                }}
                className="login-card-grid"
            >
                {/* Left Panel - Branding */}
                <div style={{
                    background: 'linear-gradient(135deg, #111111, #1a1a1a)',
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    borderBottom: '1px solid #2a2a2a',
                }} className="login-left-panel">
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #39FF14, #2bcc10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900,
                            fontSize: '1.25rem',
                            color: '#0a0a0a',
                        }}>G</div>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#fff' }}>
                            GYM<span style={{ color: '#39FF14' }}>PRO</span>
                        </span>
                    </div>

                    {/* 3D Model */}
                    <DumbbellModel />

                    {/* Tagline */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900,
                            fontSize: '1.5rem',
                            lineHeight: 1.3,
                            marginBottom: '0.75rem',
                            color: '#fff',
                        }}>
                            Power Up Your<br />
                            <span className="gradient-text">Fitness Journey</span>
                        </h2>
                        <p style={{
                            color: '#999',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            maxWidth: '280px',
                            margin: '0 auto',
                        }}>
                            Manage your gym, track workouts, and achieve your fitness goals.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div style={{
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {/* Header */}
                    <div className="login-field" style={{ marginBottom: '2rem' }}>
                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900,
                            fontSize: '1.75rem',
                            color: '#fff',
                            marginBottom: '0.375rem',
                        }}>Welcome Back</h1>
                        <p style={{ color: '#999', fontSize: '0.875rem' }}>Sign in to your account</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="error-box login-field" style={{
                            marginBottom: '1.25rem',
                            padding: '0.875rem 1rem',
                            background: 'rgba(255, 68, 68, 0.08)',
                            border: '1px solid rgba(255, 68, 68, 0.25)',
                            borderRadius: '12px',
                            color: '#ff4444',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Email */}
                        <div className="login-field">
                            <label style={{
                                display: 'block',
                                fontSize: '0.8125rem',
                                color: '#ccc',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                            }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@email.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    background: '#1a1a1a',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div className="login-field">
                            <label style={{
                                display: 'block',
                                fontSize: '0.8125rem',
                                color: '#ccc',
                                marginBottom: '0.5rem',
                                fontWeight: 500,
                            }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    background: '#1a1a1a',
                                    border: '1px solid #2a2a2a',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                }}
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className="login-field" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/forgot-password" style={{
                                fontSize: '0.75rem',
                                color: '#39FF14',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}>Forgot Password?</Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="login-field btn-neon"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                letterSpacing: '0.05em',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.5 : 1,
                                border: 'none',
                                marginTop: '0.25rem',
                            }}
                        >
                            {loading ? 'Signing in...' : 'SIGN IN'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="login-field" style={{
                        marginTop: '1.75rem',
                        paddingTop: '1.75rem',
                        borderTop: '1px solid #2a2a2a',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: '#999', fontSize: '0.875rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{
                                color: '#39FF14',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}>Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Responsive CSS for two-column layout */}
            <style>{`
                @media (min-width: 768px) {
                    .login-card-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                    .login-left-panel {
                        border-bottom: none !important;
                        border-right: 1px solid #2a2a2a !important;
                        padding: 3rem !important;
                    }
                }
                @media (max-width: 767px) {
                    .login-left-panel {
                        padding: 2rem 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
