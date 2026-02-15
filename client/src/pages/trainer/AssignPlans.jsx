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

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Assign Plans</h1>

            <select value={selMember} onChange={e => setSelMember(e.target.value)} className="w-full max-w-md px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                <option value="">Select a Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>

            {selMember && (
                <>
                    <div className="flex gap-2">
                        <button onClick={() => setTab('workout')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'workout' ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text'}`}>Workout Plan</button>
                        <button onClick={() => setTab('diet')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'diet' ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text'}`}>Diet Plan</button>
                    </div>

                    {msg && <div className="p-3 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm">{msg}</div>}

                    {tab === 'workout' && (
                        <form onSubmit={handleAssignWorkout} className="glass p-6 space-y-4">
                            <input value={wpForm.title} onChange={e => setWpForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Plan Title" required />
                            <div className="space-y-3">
                                {workouts.map(w => (
                                    <div key={w._id} className="bg-dark-lighter rounded-xl p-4">
                                        <p className="font-medium text-sm mb-2">{w.title} <span className="text-xs text-gray capitalize">({w.muscleGroup})</span></p>
                                        <div className="flex flex-wrap gap-2">{days.map(d => {
                                            const sel = wpForm.workouts.some(wp => wp.workout === w._id && wp.day === d);
                                            return <button key={d} type="button" onClick={() => toggleWorkout(w._id, d)} className={`px-2 py-1 rounded text-xs capitalize ${sel ? 'bg-neon text-dark' : 'bg-dark-card text-gray-text'}`}>{d.slice(0, 3)}</button>;
                                        })}</div>
                                    </div>
                                ))}
                            </div>
                            <textarea value={wpForm.notes} onChange={e => setWpForm(p => ({ ...p, notes: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Notes" rows={2} />
                            <button type="submit" className="btn-neon px-6 py-2.5 text-sm">Assign Workout Plan</button>
                        </form>
                    )}

                    {tab === 'diet' && (
                        <form onSubmit={handleAssignDiet} className="glass p-6 space-y-4">
                            <input value={dpForm.title} onChange={e => setDpForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Diet Plan Title" required />
                            {dpForm.meals.map((meal, i) => (
                                <div key={i} className="bg-dark-lighter rounded-xl p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input value={meal.name} onChange={e => { const m = [...dpForm.meals]; m[i].name = e.target.value; setDpForm(p => ({ ...p, meals: m })); }} className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white" placeholder="Meal name" />
                                        <input value={meal.time} onChange={e => { const m = [...dpForm.meals]; m[i].time = e.target.value; setDpForm(p => ({ ...p, meals: m })); }} className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white" placeholder="Time" />
                                    </div>
                                    <input value={meal.items.join(', ')} onChange={e => { const m = [...dpForm.meals]; m[i].items = e.target.value.split(',').map(s => s.trim()); setDpForm(p => ({ ...p, meals: m })); }} className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white" placeholder="Food items (comma separated)" />
                                    <input type="number" value={meal.calories} onChange={e => { const m = [...dpForm.meals]; m[i].calories = +e.target.value; setDpForm(p => ({ ...p, meals: m })); }} className="w-full px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white" placeholder="Calories" />
                                </div>
                            ))}
                            <button type="button" onClick={addMeal} className="btn-outline px-4 py-2 text-sm">+ Add Meal</button>
                            <button type="submit" className="btn-neon px-6 py-2.5 text-sm block">Assign Diet Plan</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}
