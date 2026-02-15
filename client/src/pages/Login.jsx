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
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const cardRef = useRef(null);

    useEffect(() => {
        if (user) {
            const dest = user.role === 'admin' ? '/admin' : user.role === 'trainer' ? '/trainer' : '/member';
            navigate(dest);
        }
    }, [user, navigate]);

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
            setError(err.message || 'Login failed');
            gsap.fromTo('.error-box', { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
            <ParticleBackground />
            <div ref={cardRef} className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 glass overflow-hidden">
                <div className="bg-gradient-to-br from-dark-card to-dark-lighter p-8 lg:p-12 flex flex-col items-center justify-center border-r border-dark-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center font-outfit font-black text-dark text-xl">G</div>
                        <span className="font-outfit font-bold text-2xl">GYM<span className="text-neon">PRO</span></span>
                    </div>
                    <DumbbellModel />
                    <h2 className="font-outfit font-black text-2xl mt-4 text-center">Power Up Your<br /><span className="gradient-text">Fitness Journey</span></h2>
                    <p className="text-gray text-sm mt-3 text-center max-w-xs">Manage your gym, track workouts, and achieve your fitness goals.</p>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h1 className="font-outfit font-black text-2xl mb-1 login-field">Welcome Back</h1>
                    <p className="text-gray text-sm mb-8 login-field">Sign in to your account</p>
                    {error && <div className="error-box login-field mb-4 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm text-center">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="login-field">
                            <label className="block text-sm text-gray-text mb-2 font-medium">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="you@email.com" required />
                        </div>
                        <div className="login-field">
                            <label className="block text-sm text-gray-text mb-2 font-medium">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="••••••••" required />
                        </div>
                        <div className="login-field flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-neon hover:text-neon-light transition-colors">Forgot Password?</Link>
                        </div>
                        <button type="submit" disabled={loading} className="login-field w-full py-3.5 btn-neon text-sm font-bold disabled:opacity-50 tracking-wide">
                            {loading ? 'Signing in...' : 'SIGN IN'}
                        </button>
                    </form>
                    <div className="login-field mt-6 pt-6 border-t border-dark-border text-center">
                        <p className="text-gray text-sm">Don't have an account? <Link to="/register" className="text-neon font-semibold hover:text-neon-light">Create Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
