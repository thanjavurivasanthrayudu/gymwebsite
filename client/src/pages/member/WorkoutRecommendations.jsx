import { useState, useRef, useEffect } from 'react';
import { getRecommendations } from '../../data/fitnessData';
import { useAuth } from '../../context/AuthContext';
import { FiZap, FiClock, FiDroplet, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import gsap from 'gsap';

const typeColors = { Yoga: '#a855f7', HIIT: '#ef4444', Cardio: '#3b82f6', Strength: '#39FF14' };
const typeIcons = { Yoga: '🧘', HIIT: '🔥', Cardio: '🏃', Strength: '💪' };

export default function WorkoutRecommendations() {
    const { user } = useAuth();
    const ref = useRef(null);
    const [form, setForm] = useState({ age: '', weight: '', height: '', gender: '', experienceLevel: '' });
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (ref.current) gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const age = parseInt(form.age);
        const weight = parseFloat(form.weight);
        const height = parseFloat(form.height) / 100;
        const bmi = height > 0 ? +(weight / (height * height)).toFixed(1) : null;
        const recs = getRecommendations({
            age, bmi,
            experienceLevel: form.experienceLevel ? parseInt(form.experienceLevel) : null,
            gender: form.gender || null,
        });
        setResults({ ...recs, userBMI: bmi });
        // Animate results
        setTimeout(() => {
            const cards = document.querySelectorAll('.rec-card');
            if (cards.length) gsap.fromTo(cards, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'back.out(1.7)' });
        }, 50);
    };

    const inputStyle = {
        width: '100%', padding: '0.75rem 1rem', background: '#1a1a1a',
        border: '1px solid #2a2a2a', borderRadius: '12px', fontSize: '0.875rem', color: '#fff', outline: 'none',
    };
    const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer' };

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div className="glass" style={{ padding: '1.75rem 2rem' }}>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>
                    Workout <span className="gradient-text">Recommendations</span>
                </h1>
                <p style={{ color: '#999', fontSize: '0.875rem' }}>Get personalized workout suggestions based on your profile</p>
            </div>

            {/* Input Form */}
            <div className="glass" style={{ padding: '1.75rem 2rem' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1.25rem' }}>Your Profile</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.875rem' }} className="rec-form-grid">
                    <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required style={inputStyle} />
                    <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required style={inputStyle} />
                    <input type="number" step="0.1" placeholder="Height (cm)" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required style={inputStyle} />
                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={selectStyle}>
                        <option value="">Any Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <select value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} style={selectStyle}>
                        <option value="">Any Experience</option>
                        <option value="1">Beginner</option>
                        <option value="2">Intermediate</option>
                        <option value="3">Advanced</option>
                    </select>
                    <button type="submit" className="btn-neon" style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                        Get Recommendations
                    </button>
                </form>
            </div>

            {/* Results */}
            {results && (
                <>
                    <div className="glass" style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', color: '#999' }}>Matched <strong style={{ color: '#39FF14' }}>{results.matchCount}</strong> similar profiles</span>
                        {results.userBMI && <span style={{ fontSize: '0.875rem', color: '#999' }}>• Your BMI: <strong style={{ color: '#fff' }}>{results.userBMI}</strong></span>}
                    </div>

                    {/* Top Recommendation */}
                    {results.topRecommendation && (
                        <div className="glass neon-glow rec-card" style={{ padding: '2rem', borderColor: typeColors[results.topRecommendation.type] + '40' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem' }}>{typeIcons[results.topRecommendation.type]}</span>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Top Recommendation</p>
                                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: typeColors[results.topRecommendation.type] }}>
                                        {results.topRecommendation.type}
                                    </h2>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FiZap size={16} color={typeColors[results.topRecommendation.type]} />
                                    <div><p style={{ fontSize: '0.7rem', color: '#666' }}>Avg Calories</p><p style={{ fontWeight: 700, color: '#fff' }}>{results.topRecommendation.avgCalories} kcal</p></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FiClock size={16} color={typeColors[results.topRecommendation.type]} />
                                    <div><p style={{ fontSize: '0.7rem', color: '#666' }}>Avg Duration</p><p style={{ fontWeight: 700, color: '#fff' }}>{results.topRecommendation.avgDuration}h</p></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FiDroplet size={16} color={typeColors[results.topRecommendation.type]} />
                                    <div><p style={{ fontSize: '0.7rem', color: '#666' }}>Water Intake</p><p style={{ fontWeight: 700, color: '#fff' }}>{results.topRecommendation.avgWater}L</p></div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FiTrendingUp size={16} color={typeColors[results.topRecommendation.type]} />
                                    <div><p style={{ fontSize: '0.7rem', color: '#666' }}>Frequency</p><p style={{ fontWeight: 700, color: '#fff' }}>{results.topRecommendation.avgFrequency} days/wk</p></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Options */}
                    {results.recommendations.length > 1 && (
                        <>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Also Recommended</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {results.recommendations.slice(1).map(r => (
                                    <div key={r.type} className="glass glass-hover rec-card" style={{ padding: '1.25rem 1.5rem', cursor: 'default' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{typeIcons[r.type]}</span>
                                            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: typeColors[r.type] }}>{r.type}</h4>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                            <p><span style={{ color: '#666' }}>Calories:</span> <strong style={{ color: '#fff' }}>{r.avgCalories} kcal</strong></p>
                                            <p><span style={{ color: '#666' }}>Duration:</span> <strong style={{ color: '#fff' }}>{r.avgDuration}h</strong></p>
                                            <p><span style={{ color: '#666' }}>People doing this:</span> <strong style={{ color: '#fff' }}>{r.count}</strong></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <style>{`
                @media (min-width: 640px) {
                    .rec-form-grid { grid-template-columns: 1fr 1fr 1fr !important; }
                }
            `}</style>
        </div>
    );
}
