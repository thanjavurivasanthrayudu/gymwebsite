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
        <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
            <ParticleBackground />
            <div ref={cardRef} className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 glass overflow-hidden">
                <div className="bg-gradient-to-br from-dark-card to-dark-lighter p-8 lg:p-12 flex flex-col items-center justify-center border-r border-dark-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center font-outfit font-black text-dark text-xl">G</div>
                        <span className="font-outfit font-bold text-2xl">GYM<span className="text-neon">PRO</span></span>
                    </div>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon/20 to-neon-dark/10 flex items-center justify-center mb-6 pulse-neon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </div>
                    <h2 className="font-outfit font-black text-2xl text-center">Join the<br /><span className="gradient-text">GYM PRO Family</span></h2>
                    <p className="text-gray text-sm mt-3 text-center max-w-xs">Create your account and start your transformation today.</p>
                    <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
                        {[{ n: '500+', l: 'Members' }, { n: '50+', l: 'Workouts' }, { n: '20+', l: 'Trainers' }].map(s => (
                            <div key={s.l} className="text-center"><p className="font-outfit font-black text-xl text-neon">{s.n}</p><p className="text-xs text-gray">{s.l}</p></div>
                        ))}
                    </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h1 className="font-outfit font-black text-2xl mb-1 reg-field">Create Account</h1>
                    <p className="text-gray text-sm mb-8 reg-field">Start your fitness journey</p>
                    {error && <div className="reg-field mb-4 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="reg-field"><label className="block text-sm text-gray-text mb-2 font-medium">Full Name</label><input type="text" value={form.name} onChange={upd('name')} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="John Doe" required /></div>
                        <div className="reg-field"><label className="block text-sm text-gray-text mb-2 font-medium">Email Address</label><input type="email" value={form.email} onChange={upd('email')} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="you@email.com" required /></div>
                        <div className="reg-field"><label className="block text-sm text-gray-text mb-2 font-medium">Select Role</label><select value={form.role} onChange={upd('role')} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white"><option value="member">Member</option><option value="trainer">Trainer</option><option value="admin">Admin</option></select></div>
                        <div className="reg-field grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm text-gray-text mb-2 font-medium">Password</label><input type="password" value={form.password} onChange={upd('password')} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="Min 6 chars" required /></div>
                            <div><label className="block text-sm text-gray-text mb-2 font-medium">Confirm Password</label><input type="password" value={form.confirmPassword} onChange={upd('confirmPassword')} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="••••••••" required /></div>
                        </div>
                        <button type="submit" disabled={loading} className="reg-field w-full py-3.5 btn-neon text-sm font-bold disabled:opacity-50 tracking-wide">{loading ? 'Creating Account...' : 'CREATE ACCOUNT'}</button>
                    </form>
                    <div className="reg-field mt-6 pt-6 border-t border-dark-border text-center"><p className="text-gray text-sm">Already have an account? <Link to="/login" className="text-neon font-semibold hover:text-neon-light">Sign In</Link></p></div>
                </div>
            </div>
        </div>
    );
}
