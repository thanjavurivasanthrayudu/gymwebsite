import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../threejs/ParticleBackground';
import gsap from 'gsap';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'member' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const cardRef = useRef(null);

    useEffect(() => { if (user) navigate(user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/member'); }, [user, navigate]);

    useEffect(() => {
        gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        gsap.fromTo('.reg-field', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.4 });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) return setError('Passwords do not match');
        if (form.password.length < 6) return setError('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password, role: form.role });
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
        setLoading(false);
    };

    const upd = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    if (success) {
        return (
            <div className="min-h-screen relative flex items-center justify-center px-4">
                <ParticleBackground />
                <div className="relative z-10 glass p-8 max-w-md text-center">
                    <div className="w-16 h-16 rounded-full bg-neon/20 flex items-center justify-center mx-auto mb-4 text-neon text-3xl">✓</div>
                    <h2 className="font-outfit font-black text-2xl mb-2">Account Created!</h2>
                    <p className="text-gray text-sm mb-6">Check your email to confirm your account, then sign in.</p>
                    <Link to="/login" className="btn-neon px-8 py-3 text-sm font-bold inline-block">Go to Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-dark">
            <ParticleBackground />
            <div ref={cardRef} className="relative z-10 w-full max-w-md">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center font-outfit font-black text-dark text-2xl">G</div>
                        <span className="font-outfit font-bold text-3xl">GYM<span className="text-neon">PRO</span></span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="glass p-8 md:p-10 mb-6">
                    <h1 className="font-outfit font-black text-3xl mb-3 reg-field text-center">Create Account</h1>
                    <p className="text-gray-text text-sm mb-8 reg-field text-center">Start your fitness journey</p>

                    {error && (
                        <div className="reg-field mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="reg-field">
                            <label className="block text-sm text-gray-text mb-3 font-medium">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={upd('name')}
                                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-sm text-white placeholder-gray focus:outline-none focus:border-neon/50 transition"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="reg-field">
                            <label className="block text-sm text-gray-text mb-3 font-medium">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={upd('email')}
                                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-sm text-white placeholder-gray focus:outline-none focus:border-neon/50 transition"
                                placeholder="you@email.com"
                                required
                            />
                        </div>

                        {/* Select Role */}
                        <div className="reg-field">
                            <label className="block text-sm text-gray-text mb-3 font-medium">Select Role</label>
                            <select
                                value={form.role}
                                onChange={upd('role')}
                                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-neon/50 transition"
                            >
                                <option value="member">Member</option>
                                <option value="trainer">Trainer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Password Fields */}
                        <div className="reg-field grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-text mb-3 font-medium">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={upd('password')}
                                    className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-sm text-white placeholder-gray focus:outline-none focus:border-neon/50 transition"
                                    placeholder="Min 6 chars"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-text mb-3 font-medium">Confirm</label>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={upd('confirmPassword')}
                                    className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-sm text-white placeholder-gray focus:outline-none focus:border-neon/50 transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="reg-field w-full py-3.5 btn-neon text-sm font-bold disabled:opacity-50 tracking-wide rounded-lg transition mt-6"
                        >
                            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="reg-field mt-8 pt-6 border-t border-dark-border text-center">
                        <p className="text-gray-text text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-neon font-semibold hover:text-neon-light transition">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="glass p-6 text-center">
                    <h3 className="font-outfit font-bold text-lg mb-4">Join the GYM PRO Family</h3>
                    <p className="text-gray-text text-xs mb-5">Start your transformation today</p>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ n: '500+', l: 'Members' }, { n: '50+', l: 'Workouts' }, { n: '20+', l: 'Trainers' }].map(s => (
                            <div key={s.l} className="text-center">
                                <p className="font-outfit font-black text-lg text-neon">{s.n}</p>
                                <p className="text-xs text-gray">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
