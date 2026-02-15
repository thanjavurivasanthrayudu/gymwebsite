import { useEffect, useState } from 'react';
import { getMyDietPlanAPI } from '../../services/api';

export default function DietPlan() {
    const [plan, setPlan] = useState(null);
    useEffect(() => { const load = async () => { try { const { data } = await getMyDietPlanAPI(); setPlan(data); } catch (e) { } }; load(); }, []);

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">My Diet Plan</h1>
            {plan ? (
                <>
                    <div className="glass p-5">
                        <h2 className="font-outfit font-bold text-lg">{plan.title}</h2>
                        <p className="text-xs text-gray mt-1">Assigned by {plan.assignedBy?.name || 'Trainer'}</p>
                        {plan.totalCalories > 0 && <p className="text-sm text-neon mt-2 font-semibold">Total: {plan.totalCalories} kcal/day</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plan.meals?.map((meal, i) => (
                            <div key={i} className="glass glass-hover p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-outfit font-bold text-sm">{meal.name}</h3>
                                    <span className="text-xs text-neon bg-neon/10 px-2 py-1 rounded-lg">{meal.time}</span>
                                </div>
                                <div className="space-y-1.5">
                                    {meal.items?.map((item, j) => (
                                        <div key={j} className="flex items-center gap-2 text-sm text-gray-text">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neon flex-shrink-0" /> {item}
                                        </div>
                                    ))}
                                </div>
                                {meal.calories > 0 && <p className="text-xs text-gray mt-3 pt-3 border-t border-dark-border">{meal.calories} kcal • {meal.protein || 'N/A'} protein</p>}
                                {meal.notes && <p className="text-xs text-gray-text mt-2 italic">{meal.notes}</p>}
                            </div>
                        ))}
                    </div>
                </>
            ) : <div className="glass p-8 text-center text-gray">No diet plan assigned yet. Contact your trainer!</div>}
        </div>
    );
}
