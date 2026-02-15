import { useEffect, useState } from 'react';
import { getMyWorkoutPlanAPI } from '../../services/api';
import WorkoutModal from '../../components/WorkoutModal';

export default function WorkoutPlan() {
    const [plan, setPlan] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => { const load = async () => { try { const { data } = await getMyWorkoutPlanAPI(); setPlan(data); } catch (e) { } }; load(); }, []);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const diffColor = { beginner: 'text-neon', intermediate: 'text-warning', advanced: 'text-danger' };

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">My Workout Plan</h1>
            {plan ? (
                <>
                    <div className="glass p-5">
                        <h2 className="font-outfit font-bold text-lg">{plan.title}</h2>
                        <p className="text-xs text-gray mt-1">Assigned by {plan.assignedBy?.name || 'Trainer'}</p>
                        {plan.notes && <p className="text-sm text-gray-text mt-3 bg-dark-lighter rounded-xl p-3">{plan.notes}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {days.map(day => {
                            const dayWorkouts = plan.workouts?.filter(w => w.day === day) || [];
                            if (!dayWorkouts.length) return null;
                            return (
                                <div key={day} className="glass p-5">
                                    <h3 className="font-outfit font-bold capitalize text-sm mb-3 text-neon">{day}</h3>
                                    <div className="space-y-2">
                                        {dayWorkouts.map((w, i) => (
                                            <button key={i} onClick={() => w.workout && setSelected(w.workout)} className="w-full text-left bg-dark-lighter rounded-xl p-3 hover:border-neon/30 border border-transparent transition-colors">
                                                <p className="font-medium text-sm">{w.workout?.title || 'Exercise'}</p>
                                                <p className="text-xs text-gray mt-0.5">
                                                    {w.workout && <><span className="capitalize">{w.workout.muscleGroup}</span> • <span className={diffColor[w.workout.difficulty]}>{w.workout.difficulty}</span> • {w.workout.sets}×{w.workout.reps}</>}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : <div className="glass p-8 text-center text-gray">No workout plan assigned yet. Contact your trainer!</div>}
            {selected && <WorkoutModal workout={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
