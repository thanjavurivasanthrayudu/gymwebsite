import { useEffect, useState } from 'react';
import { getWorkoutsAPI } from '../../services/api';
import WorkoutModal from '../../components/WorkoutModal';

export default function WorkoutLibrary() {
    const [workouts, setWorkouts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const load = async () => { try { const { data } = await getWorkoutsAPI(filter ? { muscleGroup: filter } : {}); setWorkouts(data); } catch (e) { } };
        load();
    }, [filter]);

    const muscles = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full-body', 'cardio'];
    const diffColor = { beginner: 'bg-neon/10 text-neon', intermediate: 'bg-warning/10 text-warning', advanced: 'bg-danger/10 text-danger' };

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Workout Library</h1>
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!filter ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text'}`}>All</button>
                {muscles.map(m => <button key={m} onClick={() => setFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter === m ? 'bg-neon text-dark' : 'bg-dark-lighter text-gray-text'}`}>{m}</button>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workouts.map(w => (
                    <button key={w._id} onClick={() => setSelected(w)} className="glass glass-hover p-5 text-left">
                        {w.gifUrl && <img src={w.gifUrl} alt={w.title} className="w-full h-32 object-cover rounded-xl bg-dark-lighter mb-3" />}
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="font-outfit font-bold text-sm">{w.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded capitalize flex-shrink-0 ml-2 ${diffColor[w.difficulty]}`}>{w.difficulty}</span>
                        </div>
                        <p className="text-xs text-gray capitalize">{w.muscleGroup} • {w.sets}×{w.reps}</p>
                    </button>
                ))}
            </div>
            {!workouts.length && <p className="text-center text-gray py-8">No workouts available</p>}
            {selected && <WorkoutModal workout={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
