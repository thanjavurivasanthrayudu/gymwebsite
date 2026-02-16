import { useState, useRef } from 'react';
import gsap from 'gsap';

const catColor = {
    Underweight: '#3b82f6',
    Normal: '#39FF14',
    Overweight: '#f59e0b',
    Obese: '#ff4466',
};

const catEmoji = {
    Underweight: '🔵',
    Normal: '🟢',
    Overweight: '🟡',
    Obese: '🔴',
};

export default function BMICalculator() {
    const [h, setH] = useState('');
    const [w, setW] = useState('');
    const [bmi, setBmi] = useState(null);
    const [cat, setCat] = useState('');
    const resRef = useRef(null);

    const calc = (e) => {
        e.preventDefault();
        const hm = parseFloat(h) / 100;
        const wk = parseFloat(w);
        if (!hm || !wk) return;
        const v = (wk / (hm * hm)).toFixed(1);
        setBmi(v);
        setCat(v < 18.5 ? 'Underweight' : v < 25 ? 'Normal' : v < 30 ? 'Overweight' : 'Obese');

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (resRef.current && !prefersReduced) {
            gsap.fromTo(resRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        background: '#0b0b0f',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        fontSize: '0.875rem',
        fontFamily: "'Inter', sans-serif",
        color: '#e0e0ee',
        outline: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <div style={{
            background: 'rgba(18,18,26,0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700, fontSize: '1.125rem',
                marginBottom: 20, color: '#fff',
            }}>BMI Calculator</h3>

            <form onSubmit={calc} style={{
                display: 'flex', flexDirection: 'column', gap: 14,
            }}>
                <div>
                    <label style={{ fontSize: '0.75rem', color: '#88889a', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.03em' }}>
                        Height
                    </label>
                    <input
                        type="number" step="0.1" value={h}
                        onChange={e => setH(e.target.value)}
                        placeholder="Enter height in cm"
                        required style={inputStyle}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.75rem', color: '#88889a', fontWeight: 600, display: 'block', marginBottom: 6, letterSpacing: '0.03em' }}>
                        Weight
                    </label>
                    <input
                        type="number" step="0.1" value={w}
                        onChange={e => setW(e.target.value)}
                        placeholder="Enter weight in kg"
                        required style={inputStyle}
                    />
                </div>
                <button type="submit" className="btn-neon" style={{
                    width: '100%', padding: '14px',
                    fontSize: '0.875rem', fontWeight: 700,
                    marginTop: 4,
                }}>
                    Calculate BMI
                </button>
            </form>

            {bmi && (
                <div ref={resRef} style={{
                    marginTop: 20,
                    padding: '20px 24px',
                    background: `linear-gradient(135deg, ${catColor[cat]}08, ${catColor[cat]}04)`,
                    border: `1px solid ${catColor[cat]}20`,
                    borderRadius: 14,
                    textAlign: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: '1.25rem' }}>{catEmoji[cat]}</span>
                        <p style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900, fontSize: '2.5rem',
                            color: catColor[cat], lineHeight: 1.1,
                        }}>{bmi}</p>
                    </div>
                    <p style={{
                        fontWeight: 600, color: catColor[cat],
                        fontSize: '0.85rem', letterSpacing: '0.03em',
                    }}>{cat}</p>
                </div>
            )}
        </div>
    );
}
