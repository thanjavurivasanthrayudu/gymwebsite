import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../services/api';
import ParticleBackground from '../threejs/ParticleBackground';
import gsap from 'gsap';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setError(''); setLoading(true);
        try {
            await forgotPasswordAPI(email);
            setMsg('Password reset link sent to your email!');
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4">
            <ParticleBackground />
            <div ref={cardRef} className="relative z-10 glass p-8 w-full max-w-md text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center mx-auto mb-4 font-outfit font-black text-dark text-2xl">G</div>
                <h1 className="font-outfit font-black text-2xl mb-2">Reset Password</h1>
                <p className="text-gray text-sm mb-6">Enter your email to receive a reset link</p>
                {msg && <div className="mb-4 p-3 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm">{msg}</div>}
                {error && <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm text-gray-text mb-2 font-medium">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white placeholder-gray" placeholder="you@email.com" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 btn-neon text-sm font-bold disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
                </form>
                <div className="mt-6 pt-6 border-t border-dark-border"><Link to="/login" className="text-neon text-sm font-semibold">← Back to Sign In</Link></div>
            </div>
        </div>
    );
}
