import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import CountdownTimer from '../../components/CountdownTimer';
import BMICalculator from '../../components/BMICalculator';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FiHeart, FiDollarSign, FiUser } from 'react-icons/fi';
import gsap from 'gsap';

export default function MemberDashboard() {
    const { user } = useAuth();
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' });
    }, []);

    const quickLinks = [
        { to: '/member/workout-plan', icon: GiWeightLiftingUp, label: 'Workout Plan', color: 'from-neon to-neon-dark' },
        { to: '/member/diet-plan', icon: FiHeart, label: 'Diet Plan', color: 'from-pink-500 to-rose-700' },
        { to: '/member/payments', icon: FiDollarSign, label: 'Payments', color: 'from-warning to-orange-700' },
        { to: '/member/profile', icon: FiUser, label: 'Profile', color: 'from-info to-blue-700' },
    ];

    return (
        <div ref={ref} className="space-y-6">
            <div className="glass p-6">
                <h1 className="font-outfit font-black text-2xl mb-1">Welcome back, <span className="gradient-text">{user?.name}</span>!</h1>
                <p className="text-gray text-sm">Here's your fitness overview</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map(({ to, icon: Icon, label, color }) => (
                    <Link key={to} to={to} className="glass glass-hover p-5 block text-center">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3`}><Icon size={22} className="text-white" /></div>
                        <p className="font-medium text-sm">{label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6">
                    <h3 className="font-outfit font-bold text-lg mb-1">Membership Status</h3>
                    <p className="text-xs text-gray mb-4 capitalize">{user?.membershipPlan || 'No'} Plan</p>
                    {user?.membershipPlan && (
                        <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-neon/20 text-neon uppercase mb-4">{user.membershipPlan} Member</div>
                    )}
                    <p className="text-sm text-gray-text mb-3">Expires in:</p>
                    <CountdownTimer expiryDate={user?.membershipExpiry} />
                </div>
                <BMICalculator />
            </div>
        </div>
    );
}
