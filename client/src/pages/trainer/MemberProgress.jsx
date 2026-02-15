import { useEffect, useState } from 'react';
import { getAssignedMembersAPI, getMemberWorkoutPlanAPI, updateMemberProgressAPI } from '../../services/api';

export default function MemberProgress() {
    const [members, setMembers] = useState([]);
    const [selMember, setSelMember] = useState('');
    const [plan, setPlan] = useState(null);
    const [notes, setNotes] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => { const load = async () => { try { const { data } = await getAssignedMembersAPI(); setMembers(data); } catch (e) { } }; load(); }, []);

    const loadPlan = async (id) => {
        setSelMember(id); setMsg('');
        try { const { data } = await getMemberWorkoutPlanAPI(id); setPlan(data); setNotes(data?.notes || ''); } catch (e) { setPlan(null); }
    };

    const handleUpdate = async () => {
        try { await updateMemberProgressAPI(selMember, { notes }); setMsg('Progress updated!'); } catch (e) { alert('Failed'); }
    };

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Member Progress</h1>
            <select value={selMember} onChange={e => loadPlan(e.target.value)} className="w-full max-w-md px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                <option value="">Select a Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>

            {selMember && (
                <div className="glass p-6 space-y-4">
                    {plan ? (
                        <>
                            <h3 className="font-outfit font-bold">{plan.title}</h3>
                            <div className="space-y-2">
                                {plan.workouts?.map((w, i) => (
                                    <div key={i} className="bg-dark-lighter rounded-xl p-3 flex items-center justify-between">
                                        <span className="text-sm font-medium">{w.workout?.title || 'Exercise'}</span>
                                        <span className="text-xs text-gray capitalize">{w.day}</span>
                                    </div>
                                ))}
                            </div>
                            {msg && <div className="p-3 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm">{msg}</div>}
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Notes / Feedback" rows={3} />
                            <button onClick={handleUpdate} className="btn-neon px-6 py-2.5 text-sm">Update Progress</button>
                        </>
                    ) : <p className="text-gray text-sm">No active plan for this member.</p>}
                </div>
            )}
        </div>
    );
}
