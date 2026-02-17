import { useEffect, useState } from 'react';
import { getMembersAPI, createMemberAPI, updateMemberAPI, deleteMemberAPI, getTrainersAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export default function ManageMembers() {
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', membershipPlan: 'basic', assignedTrainer: '' });

    const load = async () => {
        try { const [{ data: m }, { data: t }] = await Promise.all([getMembersAPI(), getTrainersAPI()]); setMembers(m); setTrainers(t); } catch (e) { console.error(e); }
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) await updateMemberAPI(editing, form);
            else await createMemberAPI(form);
            setShowForm(false); setEditing(null); load();
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const handleEdit = (m) => { setEditing(m._id); setForm({ name: m.name, email: m.email, password: '', phone: m.phone || '', membershipPlan: m.membershipPlan || 'basic', assignedTrainer: m.assignedTrainer?._id || '' }); setShowForm(true); };
    const handleDelete = async (id) => { if (confirm('Delete this member?')) { await deleteMemberAPI(id); load(); } };

    const planColors = {
        basic: { bg: 'rgba(85,85,102,0.15)', color: '#b8b8cc' },
        pro: { bg: 'rgba(57,255,20,0.1)', color: '#39FF14' },
        elite: { bg: 'rgba(255,170,0,0.1)', color: '#ffaa00' },
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

    const thStyle = {
        textAlign: 'left',
        color: '#555566',
        fontSize: '0.7rem',
        fontWeight: 600,
        padding: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
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
                }}>Manage Members</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', password: '', phone: '', membershipPlan: 'basic', assignedTrainer: '' }); }}
                    className="btn-neon"
                    style={{ padding: '10px 16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiPlus size={16} /> Add Member
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff' }}>{editing ? 'Edit' : 'Add'} Member</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                            <FiX size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="manage-form-grid" style={{ marginBottom: '16px' }}>
                            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} placeholder="Name" required />
                            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} placeholder="Email" required />
                            {!editing && <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} placeholder="Password" required />}
                            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="Phone" />
                            <select value={form.membershipPlan} onChange={e => setForm(p => ({ ...p, membershipPlan: e.target.value }))} style={inputStyle}>
                                <option value="basic">Basic</option><option value="pro">Pro</option><option value="elite">Elite</option>
                            </select>
                            <select value={form.assignedTrainer} onChange={e => setForm(p => ({ ...p, assignedTrainer: e.target.value }))} style={inputStyle}>
                                <option value="">No Trainer</option>{trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>{editing ? 'Update' : 'Create'}</button>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="glass" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <th style={thStyle}>Name</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Plan</th>
                                <th style={thStyle}>Trainer</th>
                                <th style={thStyle}>Expiry</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(m => {
                                const pc = planColors[m.membershipPlan] || { bg: '#22222e', color: '#555566' };
                                return (
                                    <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,34,46,0.5)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'rgba(57,255,20,0.15)', color: '#39FF14',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
                                                }}>{m.name?.charAt(0)}</div>
                                                <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#e0e0ee' }}>{m.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', color: '#b8b8cc' }}>{m.email}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                fontSize: '0.7rem', padding: '4px 10px', borderRadius: '8px',
                                                background: pc.bg, color: pc.color, textTransform: 'capitalize',
                                            }}>{m.membershipPlan || 'None'}</span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', color: '#b8b8cc' }}>{m.assignedTrainer?.name || '-'}</td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', color: '#555566' }}>{m.membershipExpiry ? new Date(m.membershipExpiry).toLocaleDateString() : '-'}</td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <button onClick={() => handleEdit(m)} style={{
                                                    padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                                    color: '#39FF14', cursor: 'pointer', transition: 'background 0.2s', display: 'flex',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(57,255,20,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                ><FiEdit2 size={15} /></button>
                                                <button onClick={() => handleDelete(m._id)} style={{
                                                    padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                                    color: '#ff4466', cursor: 'pointer', transition: 'background 0.2s', display: 'flex',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,68,102,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                ><FiTrash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!members.length && <p style={{ textAlign: 'center', color: '#555566', fontSize: '0.875rem', padding: '32px 0' }}>No members found</p>}
                </div>
            </div>

            <style>{`
                .manage-form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @media (min-width: 640px) {
                    .manage-form-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
