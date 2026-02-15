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
    const diffColor = { beginner: 'bg-neon/10 text-neon', intermediate: 'bg-warning/10 text-warning', advanced: 'bg-danger/10 text-danger' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="font-outfit font-black text-2xl">Workout Library</h1>
                <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', muscleGroup: 'chest', difficulty: 'beginner', sets: 3, reps: '10-12', restTime: '60s', videoUrl: '', gifUrl: '' }); }} className="btn-neon px-4 py-2.5 text-sm flex items-center gap-2"><FiPlus size={16} /> Add Workout</button>
            </div>

            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!filter ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text hover:text-white'}`}>All</button>
                {muscles.map(m => <button key={m} onClick={() => setFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === m ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text hover:text-white'}`}>{m}</button>)}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
                    <div className="flex justify-between"><h3 className="font-outfit font-bold">{editing ? 'Edit' : 'Add'} Workout</h3><button type="button" onClick={() => setShowForm(false)}><FiX /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Title" required />
                        <select value={form.muscleGroup} onChange={e => setForm(p => ({ ...p, muscleGroup: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">{muscles.map(m => <option key={m} value={m}>{m}</option>)}</select>
                        <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                        </select>
                        <input value={form.sets} onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Sets" type="number" />
                        <input value={form.reps} onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Reps" />
                        <input value={form.restTime} onChange={e => setForm(p => ({ ...p, restTime: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Rest Time" />
                        <input value={form.gifUrl} onChange={e => setForm(p => ({ ...p, gifUrl: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white col-span-full" placeholder="GIF URL" />
                        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white col-span-full" placeholder="Description" rows={2} required />
                    </div>
                    <button type="submit" className="btn-neon px-6 py-2.5 text-sm">{editing ? 'Update' : 'Create'}</button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map(w => (
                    <div key={w._id} className="glass glass-hover p-5 space-y-3">
                        {w.gifUrl && <img src={w.gifUrl} alt={w.title} className="w-full h-32 object-cover rounded-xl bg-dark-lighter" />}
                        <div className="flex items-start justify-between">
                            <h3 className="font-outfit font-bold text-sm">{w.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded capitalize ${diffColor[w.difficulty]}`}>{w.difficulty}</span>
                        </div>
                        <p className="text-xs text-gray capitalize">{w.muscleGroup} • {w.sets}×{w.reps}</p>
                        <div className="flex gap-1">
                            <button onClick={() => setSelected(w)} className="p-2 hover:bg-neon/10 rounded-lg text-neon transition-colors"><FiEye size={14} /></button>
                            <button onClick={() => handleEdit(w)} className="p-2 hover:bg-info/10 rounded-lg text-info transition-colors"><FiEdit2 size={14} /></button>
                            <button onClick={() => handleDelete(w._id)} className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors"><FiTrash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {!workouts.length && <p className="text-center text-gray py-8">No workouts found</p>}
            {selected && <WorkoutModal workout={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
