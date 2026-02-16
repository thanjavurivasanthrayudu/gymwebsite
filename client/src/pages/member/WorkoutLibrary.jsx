import { useEffect, useState, useRef } from 'react';
import { exerciseData, getBodyParts, getLevels, filterExercises } from '../../data/exerciseData';
import { getWorkoutStats } from '../../data/fitnessData';
import { FiSearch, FiFilter, FiX, FiZap, FiClock, FiUsers } from 'react-icons/fi';
import gsap from 'gsap';

const levelColor = { Beginner: 'bg-blue-500/20 text-blue-400', Intermediate: 'bg-yellow-500/20 text-yellow-400', Expert: 'bg-red-500/20 text-red-400' };
const typeColors = { Yoga: '#a855f7', HIIT: '#ef4444', Cardio: '#3b82f6', Strength: '#39FF14' };

export default function WorkoutLibrary() {
    const ref = useRef(null);
    const [search, setSearch] = useState('');
    const [bodyPart, setBodyPart] = useState('');
    const [level, setLevel] = useState('');
    const [selected, setSelected] = useState(null);

    const bodyParts = getBodyParts();
    const levels = getLevels();
    const workoutStats = getWorkoutStats();
    const filtered = filterExercises({ bodyPart: bodyPart || undefined, level: level || undefined, search: search || undefined });

    useEffect(() => {
        if (ref.current) gsap.fromTo(ref.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power3.out' });
    }, []);

    const selectStyle = {
        padding: '0.5rem 1rem', background: '#1a1a1a', border: '1px solid #2a2a2a',
        borderRadius: '10px', fontSize: '0.8rem', color: '#fff', outline: 'none', cursor: 'pointer',
    };

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div className="glass" style={{ padding: '1.75rem 2rem' }}>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>
                    Workout <span className="gradient-text">Library</span>
                </h1>
                <p style={{ color: '#999', fontSize: '0.875rem' }}>{exerciseData.length} exercises across {bodyParts.length} body parts</p>
            </div>

            {/* Workout Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {workoutStats.map(s => (
                    <div key={s.type} className="glass glass-hover" style={{ padding: '1rem 1.25rem', cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[s.type] }} />
                            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{s.type}</h4>
                        </div>
                        <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#999' }}>
                                <FiZap size={12} /> {s.avgCalories} kcal avg
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#999' }}>
                                <FiClock size={12} /> {s.avgDuration}h avg
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#999' }}>
                                <FiUsers size={12} /> {s.count} records
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: '1 1 200px', position: 'relative' }}>
                    <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input type="text" placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ ...selectStyle, width: '100%', paddingLeft: '2.25rem' }} />
                </div>
                <select value={bodyPart} onChange={e => setBodyPart(e.target.value)} style={selectStyle}>
                    <option value="">All Body Parts</option>
                    {bodyParts.map(bp => <option key={bp} value={bp}>{bp}</option>)}
                </select>
                <select value={level} onChange={e => setLevel(e.target.value)} style={selectStyle}>
                    <option value="">All Levels</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {(search || bodyPart || level) && (
                    <button onClick={() => { setSearch(''); setBodyPart(''); setLevel(''); }}
                        style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                        <FiX size={14} /> Clear
                    </button>
                )}
            </div>

            {/* Results count */}
            <p style={{ fontSize: '0.8rem', color: '#666' }}>{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>

            {/* Exercise Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {filtered.map(ex => (
                    <button key={ex.id} onClick={() => setSelected(ex)}
                        className="glass glass-hover"
                        style={{ padding: '1.25rem 1.5rem', textAlign: 'left', border: '1px solid rgba(57,255,20,0.08)', cursor: 'pointer', background: 'rgba(17,17,17,0.8)', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#fff', lineHeight: 1.3, flex: 1, marginRight: '0.5rem' }}>{ex.title}</h3>
                            <span className={levelColor[ex.level] || ''} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}>{ex.level}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#999', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ex.desc}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.7rem' }}>
                            <span style={{ color: '#39FF14', background: 'rgba(57,255,20,0.08)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>{ex.bodyPart}</span>
                            <span style={{ color: '#999', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>{ex.equipment}</span>
                            {ex.rating && <span style={{ color: '#ffaa00' }}>★ {ex.rating}</span>}
                        </div>
                    </button>
                ))}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div onClick={() => setSelected(null)}
                    style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
                    <div onClick={e => e.stopPropagation()} className="glass" style={{ maxWidth: 500, width: '100%', padding: '2rem', position: 'relative', maxHeight: '80vh', overflow: 'auto' }}>
                        <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><FiX size={20} /></button>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem', paddingRight: '2rem' }}>{selected.title}</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.75rem' }}>
                            <span style={{ color: '#39FF14', background: 'rgba(57,255,20,0.1)', padding: '0.25rem 0.625rem', borderRadius: '8px' }}>{selected.bodyPart}</span>
                            <span style={{ color: '#999', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.625rem', borderRadius: '8px' }}>{selected.equipment}</span>
                            <span className={levelColor[selected.level] || ''} style={{ padding: '0.25rem 0.625rem', borderRadius: '8px' }}>{selected.level}</span>
                            <span style={{ color: '#999', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.625rem', borderRadius: '8px' }}>{selected.type}</span>
                        </div>
                        {selected.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ color: '#ffaa00', fontSize: '1rem' }}>★</span>
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{selected.rating}</span>
                                <span style={{ color: '#666', fontSize: '0.8rem' }}>/ 10</span>
                            </div>
                        )}
                        <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: '#39FF14', marginBottom: '0.5rem' }}>How to perform</h4>
                        <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.7 }}>{selected.desc}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
