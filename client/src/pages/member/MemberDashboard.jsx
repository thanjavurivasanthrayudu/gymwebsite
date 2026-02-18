import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import CountdownTimer from '../../components/CountdownTimer';
import BMICalculator from '../../components/BMICalculator';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FiHeart, FiDollarSign, FiUser, FiActivity, FiGrid, FiBook } from 'react-icons/fi';
import gsap from 'gsap';

export default function MemberDashboard() {
    const { user } = useAuth();
    const ref = useRef(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (ref.current && !prefersReduced) {
            gsap.fromTo(ref.current.children,
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, []);

    const quickLinks = [
        { to: '/member/workout-plan', icon: GiWeightLiftingUp, label: 'Workout Plan', gradient: 'linear-gradient(135deg, #39FF14, #2bcc10)', glow: 'rgba(57,255,20,0.15)' },
        { to: '/member/diet-plan', icon: FiHeart, label: 'Diet Plan', gradient: 'linear-gradient(135deg, #ec4899, #be123c)', glow: 'rgba(236,72,153,0.15)' },
        { to: '/member/library', icon: FiBook, label: 'Library', gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', glow: 'rgba(168,85,247,0.15)' },
        { to: '/member/analytics', icon: FiActivity, label: 'Analytics', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', glow: 'rgba(59,130,246,0.15)' },
        { to: '/member/recommendations', icon: FiGrid, label: 'Recommendations', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.15)' },
        { to: '/member/payments', icon: FiDollarSign, label: 'Payments', gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.15)' },
        { to: '/member/profile', icon: FiUser, label: 'Profile', gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)', glow: 'rgba(6,182,212,0.15)' },
    ];

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* ── Welcome Banner ── */}
            <div className="glass p-7 md:p-9" style={{ position: 'relative', overflow: 'hidden', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Subtle gradient accent */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 250, height: 250,
                    background: 'radial-gradient(circle, rgba(57,255,20,0.04), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                        color: '#fff', marginBottom: 8,
                        letterSpacing: '-0.02em',
                    }}>
                        Welcome back, <span className="gradient-text">{user?.name || 'Member'}</span>
                    </h1>
                    <p style={{ color: '#88889a', fontSize: '0.95rem', fontWeight: 400 }}>
                        Here's your fitness overview for today
                    </p>
                </div>
            </div>

            {/* ── Quick Links Grid ── */}
            <div>
                <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700, fontSize: '1.125rem',
                    color: '#fff', marginBottom: 16,
                }} className="mb-4">Quick Access</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 16,
                }}>
                    {quickLinks.map(({ to, icon: Icon, label, gradient, glow }) => (
                        <Link
                            key={to}
                            to={to}
                            className="dash-card group"
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="dash-card-icon group-hover:scale-110 transition-transform duration-300" style={{
                                background: gradient,
                                boxShadow: `0 8px 24px ${glow}`,
                            }}>
                                <Icon size={24} color="#fff" />
                            </div>
                            <span className="dash-card-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Membership & BMI Section ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 24,
                width: '100%',
            }}>
                {/* Membership Status */}
                <div className="glass p-7 md:p-9" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '240px',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                            <h3 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700, fontSize: '1.125rem',
                                color: '#fff',
                            }}>Membership Status</h3>

                            {user?.membershipPlan && (
                                <span style={{
                                    padding: '6px 16px', borderRadius: 8,
                                    fontSize: '0.75rem', fontWeight: 700,
                                    background: 'rgba(57,255,20,0.08)',
                                    color: '#39FF14',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    border: '1px solid rgba(57,255,20,0.2)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {user.membershipPlan}
                                </span>
                            )}
                        </div>

                        <p style={{
                            fontSize: '0.85rem', color: '#88889a',
                            marginBottom: 16, fontWeight: 500,
                        }}>
                            {user?.membershipPlan ? 'Your plan expires in:' : 'No active membership plan'}
                        </p>
                    </div>

                    <div>
                        <CountdownTimer expiryDate={user?.membershipExpiry} />
                    </div>
                </div>

                {/* BMI Calculator */}
                <div style={{ width: '100%' }}>
                    <BMICalculator />
                </div>
            </div>

            {/* ── Additional Info Section ── */}
            <div className="glass p-7 md:p-9">
                <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700, fontSize: '1.125rem',
                    color: '#fff', marginBottom: 16,
                }}>Progress Tips</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16,
                }}>
                    {[
                        { icon: '🎯', title: 'Stay Consistent', desc: 'Complete your workouts regularly' },
                        { icon: '💧', title: 'Stay Hydrated', desc: 'Drink water before, during & after' },
                        { icon: '🥗', title: 'Eat Healthy', desc: 'Follow your assigned diet plan' },
                    ].map((tip, idx) => (
                        <div key={idx} style={{
                            padding: '16px',
                            background: 'rgba(57, 255, 20, 0.05)',
                            border: '1px solid rgba(57, 255, 20, 0.1)',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{tip.icon}</div>
                            <h4 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 600, fontSize: '0.95rem',
                                color: '#fff', marginBottom: 4,
                            }}>{tip.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#88889a' }}>{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
