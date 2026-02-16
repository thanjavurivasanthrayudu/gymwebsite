import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiDollarSign, FiActivity, FiLogOut, FiUser, FiClipboard, FiHeart, FiGrid, FiBook } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';

export default function Sidebar({ isOpen, setIsOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };

    const adminLinks = [
        { to: '/admin', icon: FiHome, label: 'Dashboard' },
        { to: '/admin/trainers', icon: FiUsers, label: 'Trainers' },
        { to: '/admin/members', icon: FiUser, label: 'Members' },
        { to: '/admin/payments', icon: FiDollarSign, label: 'Payments' },
        { to: '/admin/workouts', icon: GiWeightLiftingUp, label: 'Workouts' },
    ];
    const trainerLinks = [
        { to: '/trainer', icon: FiHome, label: 'Dashboard' },
        { to: '/trainer/assign-plans', icon: FiClipboard, label: 'Assign Plans' },
        { to: '/trainer/progress', icon: FiActivity, label: 'Progress' },
    ];
    const memberLinks = [
        { to: '/member', icon: FiHome, label: 'Dashboard' },
        { to: '/member/workout-plan', icon: GiWeightLiftingUp, label: 'Workout Plan' },
        { to: '/member/diet-plan', icon: FiHeart, label: 'Diet Plan' },
        { to: '/member/library', icon: FiBook, label: 'Library' },
        { to: '/member/analytics', icon: FiActivity, label: 'Analytics' },
        { to: '/member/recommendations', icon: FiGrid, label: 'Recommendations' },
        { to: '/member/payments', icon: FiDollarSign, label: 'Payments' },
        { to: '/member/profile', icon: FiUser, label: 'Profile' },
    ];

    const links = user?.role === 'admin' ? adminLinks : user?.role === 'trainer' ? trainerLinks : memberLinks;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 40,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    }}
                    className="lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{
                    width: 260,
                    background: '#0e0e14',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 14,
                        background: 'linear-gradient(135deg, #39FF14, #2bcc10)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                        color: '#0b0b0f', fontSize: '1.125rem',
                        boxShadow: '0 4px 20px rgba(57,255,20,0.2)',
                    }}>
                        G
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                            fontSize: '1.125rem', color: '#fff', letterSpacing: '-0.01em',
                        }}>
                            GYM<span style={{ color: '#39FF14' }}>PRO</span>
                        </h1>
                        <p style={{
                            fontSize: '0.7rem', color: '#555566',
                            textTransform: 'capitalize', marginTop: 2,
                            fontWeight: 500, letterSpacing: '0.05em',
                        }}>{user?.role} Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{
                    flex: 1, padding: '16px 12px',
                    display: 'flex', flexDirection: 'column', gap: 2,
                    overflowY: 'auto',
                }}>
                    <p style={{
                        fontSize: '0.65rem', fontWeight: 600, color: '#555566',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        padding: '8px 16px 12px', marginTop: 4,
                    }}>Navigation</p>

                    {links.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/admin' || to === '/trainer' || to === '/member'}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User & Logout */}
                <div style={{
                    padding: '16px 12px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                    {/* User info */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 16px', marginBottom: 8,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(57,255,20,0.05))',
                            border: '1px solid rgba(57,255,20,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#39FF14', fontWeight: 700, fontSize: '0.8rem',
                            fontFamily: "'Outfit', sans-serif",
                            flexShrink: 0,
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                fontSize: '0.8rem', fontWeight: 600, color: '#e0e0ee',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{user?.name}</p>
                            <p style={{
                                fontSize: '0.7rem', color: '#555566',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '12px 16px', borderRadius: 12,
                            width: '100%', border: 'none', cursor: 'pointer',
                            background: 'rgba(255,68,102,0.06)',
                            color: '#ff4466',
                            fontSize: '0.875rem', fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,68,102,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,68,102,0.06)'; }}
                    >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
