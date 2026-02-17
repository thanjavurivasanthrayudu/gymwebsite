import { useEffect, useState } from 'react';
import { getAssignedMembersAPI, getWorkoutsAPI, assignWorkoutPlanAPI, assignDietPlanAPI } from '../../services/api';

export default function AssignPlans() {
    const [members, setMembers] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [selMember, setSelMember] = useState('');
    const [tab, setTab] = useState('workout');
    const [wpForm, setWpForm] = useState({ title: '', workouts: [], notes: '' });
    const [dpForm, setDpForm] = useState({ title: '', meals: [{ name: 'Breakfast', time: '8:00 AM', items: [''], calories: 400, protein: '', notes: '' }], totalCalories: 0, notes: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const load = async () => { try { const [{ data: m }, { data: w }] = await Promise.all([getAssignedMembersAPI(), getWorkoutsAPI()]); setMembers(m); setWorkouts(w); } catch (e) { } };
        load();
    }, []);

    const toggleWorkout = (wId, day) => {
        setWpForm(p => {
            const existing = p.workouts.findIndex(w => w.workout === wId && w.day === day);
            if (existing >= 0) return { ...p, workouts: p.workouts.filter((_, i) => i !== existing) };
            return { ...p, workouts: [...p.workouts, { workout: wId, day, order: p.workouts.length }] };
        });
    };

    const handleAssignWorkout = async (e) => {
        e.preventDefault(); setMsg('');
        try { await assignWorkoutPlanAPI({ ...wpForm, memberId: selMember }); setMsg('Workout plan assigned!'); } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const handleAssignDiet = async (e) => {
        e.preventDefault(); setMsg('');
        try { await assignDietPlanAPI({ ...dpForm, memberId: selMember }); setMsg('Diet plan assigned!'); } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const addMeal = () => setDpForm(p => ({ ...p, meals: [...p.meals, { name: '', time: '', items: [''], calories: 0, protein: '', notes: '' }] }));

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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

    const smallInputStyle = {
        padding: '8px 12px',
        background: '#12121a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#fff',
        outline: 'none',
        width: '100%',
        fontFamily: "'Inter', sans-serif",
    };

    return (
        <div>
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900, fontSize: '1.5rem',
                color: '#fff', marginBottom: '24px',
            }}>Assign Plans</h1>

            <select value={selMember} onChange={e => setSelMember(e.target.value)} style={{ ...inputStyle, maxWidth: '400px', marginBottom: '24px' }}>
                <option value="">Select a Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>

            {selMember && (
                <>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <button onClick={() => setTab('workout')} style={{
                            padding: '8px 16px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500,
                            background: tab === 'workout' ? '#39FF14' : '#22222e',
                            color: tab === 'workout' ? '#0b0b0f' : '#b8b8cc',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        }}>Workout Plan</button>
                        <button onClick={() => setTab('diet')} style={{
                            padding: '8px 16px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500,
                            background: tab === 'diet' ? '#39FF14' : '#22222e',
                            color: tab === 'diet' ? '#0b0b0f' : '#b8b8cc',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        }}>Diet Plan</button>
                    </div>

                    {msg && (
                        <div style={{
                            padding: '12px', background: 'rgba(57,255,20,0.1)',
                            border: '1px solid rgba(57,255,20,0.3)', borderRadius: '12px',
                            color: '#39FF14', fontSize: '0.875rem', marginBottom: '24px',
                        }}>{msg}</div>
                    )}

                    {tab === 'workout' && (
                        <form onSubmit={handleAssignWorkout} className="glass" style={{ padding: '24px' }}>
                            <input value={wpForm.title} onChange={e => setWpForm(p => ({ ...p, title: e.target.value }))} style={{ ...inputStyle, marginBottom: '16px' }} placeholder="Plan Title" required />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                {workouts.map(w => (
                                    <div key={w._id} style={{ background: '#22222e', borderRadius: '12px', padding: '16px' }}>
                                        <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#e0e0ee', marginBottom: '8px' }}>
                                            {w.title} <span style={{ fontSize: '0.75rem', color: '#555566', textTransform: 'capitalize' }}>({w.muscleGroup})</span>
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {days.map(d => {
                                                const sel = wpForm.workouts.some(wp => wp.workout === w._id && wp.day === d);
                                                return (
                                                    <button key={d} type="button" onClick={() => toggleWorkout(w._id, d)} style={{
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                                        textTransform: 'capitalize', border: 'none', cursor: 'pointer',
                                                        background: sel ? '#39FF14' : '#12121a',
                                                        color: sel ? '#0b0b0f' : '#b8b8cc',
                                                        transition: 'all 0.2s',
                                                    }}>{d.slice(0, 3)}</button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <textarea value={wpForm.notes} onChange={e => setWpForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', marginBottom: '16px' }} placeholder="Notes" rows={2} />
                            <button type="submit" className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>Assign Workout Plan</button>
                        </form>
                    )}

                    {tab === 'diet' && (
                        <form onSubmit={handleAssignDiet} className="glass" style={{ padding: '24px' }}>
                            <input value={dpForm.title} onChange={e => setDpForm(p => ({ ...p, title: e.target.value }))} style={{ ...inputStyle, marginBottom: '16px' }} placeholder="Diet Plan Title" required />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                {dpForm.meals.map((meal, i) => (
                                    <div key={i} style={{ background: '#22222e', borderRadius: '12px', padding: '16px' }}>
                                        <div className="assign-meal-grid" style={{ marginBottom: '12px' }}>
                                            <input value={meal.name} onChange={e => { const m = [...dpForm.meals]; m[i].name = e.target.value; setDpForm(p => ({ ...p, meals: m })); }} style={smallInputStyle} placeholder="Meal name" />
                                            <input value={meal.time} onChange={e => { const m = [...dpForm.meals]; m[i].time = e.target.value; setDpForm(p => ({ ...p, meals: m })); }} style={smallInputStyle} placeholder="Time" />
                                        </div>
                                        <input value={meal.items.join(', ')} onChange={e => { const m = [...dpForm.meals]; m[i].items = e.target.value.split(',').map(s => s.trim()); setDpForm(p => ({ ...p, meals: m })); }} style={{ ...smallInputStyle, marginBottom: '12px' }} placeholder="Food items (comma separated)" />
                                        <input type="number" value={meal.calories} onChange={e => { const m = [...dpForm.meals]; m[i].calories = +e.target.value; setDpForm(p => ({ ...p, meals: m })); }} style={smallInputStyle} placeholder="Calories" />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button type="button" onClick={addMeal} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>+ Add Meal</button>
                                <button type="submit" className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>Assign Diet Plan</button>
                            </div>
                        </form>
                    )}
                </>
            )}

            <style>{`
                .assign-meal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                @media (max-width: 480px) {
                    .assign-meal-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
