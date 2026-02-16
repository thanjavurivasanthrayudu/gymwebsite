import { useState, useEffect } from 'react';

export default function CountdownTimer({ expiryDate }) {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const timer = setInterval(() => {
            const diff = new Date(expiryDate) - new Date();
            if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); clearInterval(timer); return; }
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [expiryDate]);

    if (!expiryDate) return <p style={{ color: '#555566', fontSize: '0.875rem' }}>No active membership</p>;

    const blocks = [
        { label: 'Days', value: timeLeft.d },
        { label: 'Hours', value: timeLeft.h },
        { label: 'Min', value: timeLeft.m },
        { label: 'Sec', value: timeLeft.s },
    ];

    return (
        <div style={{ display: 'flex', gap: 12 }}>
            {blocks.map(({ label, value }) => (
                <div key={label} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '14px 12px',
                    textAlign: 'center',
                    minWidth: 60,
                    flex: 1,
                }}>
                    <p style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 900, fontSize: '1.5rem',
                        color: '#39FF14',
                        lineHeight: 1.2,
                    }}>{String(value ?? 0).padStart(2, '0')}</p>
                    <p style={{
                        fontSize: '0.65rem', color: '#555566',
                        fontWeight: 600, marginTop: 4,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{label}</p>
                </div>
            ))}
        </div>
    );
}
