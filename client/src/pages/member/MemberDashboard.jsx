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
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── Welcome Banner ── */}
            <div style={{
                background: 'rgba(18,18,26,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '28px 32px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle gradient accent */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(57,255,20,0.06), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <h1 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 900, fontSize: '1.75rem',
                    color: '#fff', marginBottom: 6,
                    letterSpacing: '-0.02em',
                }}>
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p style={{ color: '#88889a', fontSize: '0.9rem', fontWeight: 400 }}>
                    Here's your fitness overview for today
                </p>
            </div>

            {/* ── Quick Links Grid ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                gap: 20,
            }}>
                {quickLinks.map(({ to, icon: Icon, label, gradient, glow }) => (
                    <Link
                        key={to}
                        to={to}
                        className="dash-card"
                    >
                        <div className="dash-card-icon" style={{
                            background: gradient,
                            boxShadow: `0 8px 24px ${glow}`,
                        }}>
                            <Icon size={28} color="#fff" />
                        </div>
                        <span className="dash-card-label">{label}</span>
                    </Link>
                ))}
            </div>

            {/* ── Bottom Grid: Membership + BMI ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 24,
            }} className="member-bottom-grid">
                {/* Membership Status */}
                <div style={{
                    background: 'rgba(18,18,26,0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 700, fontSize: '1.125rem',
                            color: '#fff',
                        }}>Membership Status</h3>

                        {user?.membershipPlan && (
                            <span style={{
                                padding: '5px 14px', borderRadius: 10,
                                fontSize: '0.7rem', fontWeight: 700,
                                background: 'rgba(57,255,20,0.08)',
                                color: '#39FF14',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                border: '1px solid rgba(57,255,20,0.15)',
                            }}>
                                {user.membershipPlan}
                            </span>
                        )}
                    </div>

                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    }}>
                        <p style={{
                            fontSize: '0.85rem', color: '#88889a',
                            marginBottom: 12, fontWeight: 500,
                        }}>
                            {user?.membershipPlan ? 'Your plan expires in:' : 'No active plan'}
                        </p>
                        <CountdownTimer expiryDate={user?.membershipExpiry} />
                    </div>
                </div>

                {/* BMI Calculator */}
                <BMICalculator />
            </div>

            {/* Responsive fix for bottom grid */}
            <style>{`
                @media (min-width: 768px) {
                    .member-bottom-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </div>
    );
}
