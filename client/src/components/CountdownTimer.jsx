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

    if (!expiryDate) return <p className="text-gray text-sm">No membership</p>;

    const blocks = [
        { label: 'Days', value: timeLeft.d },
        { label: 'Hours', value: timeLeft.h },
        { label: 'Min', value: timeLeft.m },
        { label: 'Sec', value: timeLeft.s },
    ];

    return (
        <div className="flex gap-3">
            {blocks.map(({ label, value }) => (
                <div key={label} className="bg-dark-lighter rounded-xl p-3 text-center min-w-[60px]">
                    <p className="font-outfit font-black text-2xl text-neon">{String(value ?? 0).padStart(2, '0')}</p>
                    <p className="text-xs text-gray">{label}</p>
                </div>
            ))}
        </div>
    );
}
