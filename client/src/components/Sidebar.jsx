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
        { to: '/member/library', icon: FiBook, label: 'Workout Library' },
        { to: '/member/payments', icon: FiDollarSign, label: 'Payments' },
        { to: '/member/profile', icon: FiUser, label: 'Profile' },
    ];

    const links = user?.role === 'admin' ? adminLinks : user?.role === 'trainer' ? trainerLinks : memberLinks;

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-dark-card border-r border-dark-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-dark-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center font-outfit font-black text-dark text-lg">G</div>
                        <div>
                            <h1 className="font-outfit font-bold text-lg">GYM<span className="text-neon">PRO</span></h1>
                            <p className="text-xs text-gray capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {links.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} end={to === '/admin' || to === '/trainer' || to === '/member'}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-neon/10 text-neon border border-neon/20' : 'text-gray-text hover:bg-dark-lighter hover:text-white'}`}>
                            <Icon size={18} />{label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-dark-border">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-dark-lighter flex items-center justify-center text-neon font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-all w-full">
                        <FiLogOut size={18} />Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
