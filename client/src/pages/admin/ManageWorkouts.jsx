import { useEffect, useState } from 'react';
import { getWorkoutsAPI, createWorkoutAPI, updateWorkoutAPI, deleteWorkoutAPI } from '../../services/api';
import WorkoutModal from '../../components/WorkoutModal';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';

export default function ManageWorkouts() {
    const [workouts, setWorkouts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [filter, setFilter] = useState('');
    const [form, setForm] = useState({ title: '', description: '', muscleGroup: 'chest', difficulty: 'beginner', sets: 3, reps: '10-12', restTime: '60s', videoUrl: '', gifUrl: '' });

    const load = async () => { try { const { data } = await getWorkoutsAPI(filter ? { muscleGroup: filter } : {}); setWorkouts(data); } catch (e) { } };
    useEffect(() => { load(); }, [filter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) await updateWorkoutAPI(editing, form);
            else await createWorkoutAPI(form);
            setShowForm(false); setEditing(null); load();
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const handleEdit = (w) => { setEditing(w._id); setForm({ title: w.title, description: w.description, muscleGroup: w.muscleGroup, difficulty: w.difficulty, sets: w.sets, reps: w.reps, restTime: w.restTime, videoUrl: w.videoUrl || '', gifUrl: w.gifUrl || '' }); setShowForm(true); };
    const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteWorkoutAPI(id); load(); } };

    const muscles = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body', 'cardio'];

    const diffColor = {
        beginner: { bg: 'rgba(57,255,20,0.1)', color: '#39FF14' },
        intermediate: { bg: 'rgba(255,170,0,0.1)', color: '#ffaa00' },
        advanced: { bg: 'rgba(255,68,102,0.1)', color: '#ff4466' },
    };

    const inputStyle = {
        padding: '12px 16px',
        background: '#22222e',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        fontSize: '0.875rem',
        color: '#fff',
        outline: 'none',
        width: '100%',
        fontFamily: "'Inter', sans-serif",
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
            }}>
                <h1 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 900, fontSize: '1.5rem', color: '#fff',
                }}>Workout Library</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', muscleGroup: 'chest', difficulty: 'beginner', sets: 3, reps: '10-12', restTime: '60s', videoUrl: '', gifUrl: '' }); }}
                    className="btn-neon"
                    style={{ padding: '10px 16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiPlus size={16} /> Add Workout
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <button onClick={() => setFilter('')} style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500,
                    background: !filter ? '#39FF14' : '#22222e',
                    color: !filter ? '#0b0b0f' : '#b8b8cc',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                }}>All</button>
                {muscles.map(m => (
                    <button key={m} onClick={() => setFilter(m)} style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500,
                        background: filter === m ? '#39FF14' : '#22222e',
                        color: filter === m ? '#0b0b0f' : '#b8b8cc',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        textTransform: 'capitalize',
                    }}>{m}</button>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff' }}>{editing ? 'Edit' : 'Add'} Workout</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                            <FiX size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="manage-form-grid" style={{ marginBottom: '16px' }}>
                            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Title" required />
                            <select value={form.muscleGroup} onChange={e => setForm(p => ({ ...p, muscleGroup: e.target.value }))} style={inputStyle}>
                                {muscles.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} style={inputStyle}>
                                <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                            </select>
                            <input value={form.sets} onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} style={inputStyle} placeholder="Sets" type="number" />
                            <input value={form.reps} onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} style={inputStyle} placeholder="Reps" />
                            <input value={form.restTime} onChange={e => setForm(p => ({ ...p, restTime: e.target.value }))} style={inputStyle} placeholder="Rest Time" />
                        </div>
                        <input value={form.gifUrl} onChange={e => setForm(p => ({ ...p, gifUrl: e.target.value }))} style={{ ...inputStyle, marginBottom: '16px' }} placeholder="GIF URL" />
                        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', marginBottom: '16px' }} placeholder="Description" rows={2} required />
                        <button type="submit" className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>{editing ? 'Update' : 'Create'}</button>
                    </form>
                </div>
            )}

            {/* Workout Cards */}
            <div className="workout-cards-grid">
                {workouts.map(w => {
                    const dc = diffColor[w.difficulty] || { bg: '#22222e', color: '#555566' };
                    return (
                        <div key={w._id} className="glass glass-hover" style={{ padding: '20px' }}>
                            {w.gifUrl && <img src={w.gifUrl} alt={w.title} style={{
                                width: '100%', height: '128px', objectFit: 'cover',
                                borderRadius: '12px', background: '#22222e', marginBottom: '12px',
                            }} />}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{w.title}</h3>
                                <span style={{
                                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px',
                                    background: dc.bg, color: dc.color, textTransform: 'capitalize',
                                    flexShrink: 0, marginLeft: '8px',
                                }}>{w.difficulty}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#555566', textTransform: 'capitalize', marginBottom: '12px' }}>{w.muscleGroup} • {w.sets}×{w.reps}</p>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => setSelected(w)} style={{
                                    padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                    color: '#39FF14', cursor: 'pointer', display: 'flex',
                                }}><FiEye size={14} /></button>
                                <button onClick={() => handleEdit(w)} style={{
                                    padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                    color: '#3b82f6', cursor: 'pointer', display: 'flex',
                                }}><FiEdit2 size={14} /></button>
                                <button onClick={() => handleDelete(w._id)} style={{
                                    padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                    color: '#ff4466', cursor: 'pointer', display: 'flex',
                                }}><FiTrash2 size={14} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!workouts.length && <p style={{ textAlign: 'center', color: '#555566', padding: '32px 0' }}>No workouts found</p>}
            {selected && <WorkoutModal workout={selected} onClose={() => setSelected(null)} />}

            <style>{`
                .manage-form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .workout-cards-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @media (min-width: 640px) {
                    .manage-form-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                    .workout-cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .workout-cards-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
