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
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900, fontSize: '1.5rem',
                color: '#fff', marginBottom: '24px',
            }}>Member Progress</h1>

            <select value={selMember} onChange={e => loadPlan(e.target.value)} style={{ ...inputStyle, maxWidth: '400px', marginBottom: '24px' }}>
                <option value="">Select a Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>

            {selMember && (
                <div className="glass" style={{ padding: '24px' }}>
                    {plan ? (
                        <>
                            <h3 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700, color: '#fff', marginBottom: '16px',
                            }}>{plan.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                {plan.workouts?.map((w, i) => (
                                    <div key={i} style={{
                                        background: '#22222e', borderRadius: '12px', padding: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e0e0ee' }}>{w.workout?.title || 'Exercise'}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#555566', textTransform: 'capitalize' }}>{w.day}</span>
                                    </div>
                                ))}
                            </div>
                            {msg && (
                                <div style={{
                                    padding: '12px', background: 'rgba(57,255,20,0.1)',
                                    border: '1px solid rgba(57,255,20,0.3)', borderRadius: '12px',
                                    color: '#39FF14', fontSize: '0.875rem', marginBottom: '16px',
                                }}>{msg}</div>
                            )}
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', marginBottom: '16px' }} placeholder="Notes / Feedback" rows={3} />
                            <button onClick={handleUpdate} className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>Update Progress</button>
                        </>
                    ) : <p style={{ color: '#555566', fontSize: '0.875rem' }}>No active plan for this member.</p>}
                </div>
            )}
        </div>
    );
}
