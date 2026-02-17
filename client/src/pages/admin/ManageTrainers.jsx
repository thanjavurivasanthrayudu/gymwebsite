import { useEffect, useState } from 'react';
import { getTrainersAPI, createTrainerAPI, updateTrainerAPI, deleteTrainerAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export default function ManageTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

    const load = async () => { try { const { data } = await getTrainersAPI(); setTrainers(data); } catch (e) { console.error(e); } };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) await updateTrainerAPI(editing, form);
            else await createTrainerAPI(form);
            setShowForm(false); setEditing(null); setForm({ name: '', email: '', password: '', phone: '' }); load();
        } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const handleEdit = (t) => { setEditing(t._id); setForm({ name: t.name, email: t.email, password: '', phone: t.phone || '' }); setShowForm(true); };
    const handleDelete = async (id) => { if (confirm('Delete this trainer?')) { await deleteTrainerAPI(id); load(); } };

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
                }}>Manage Trainers</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', password: '', phone: '' }); }}
                    className="btn-neon"
                    style={{ padding: '10px 16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiPlus size={16} /> Add Trainer
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff' }}>{editing ? 'Edit' : 'Add'} Trainer</h3>
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
                                <th style={thStyle}>Phone</th>
                                <th style={thStyle}>Joined</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainers.map(t => (
                                <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,34,46,0.5)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'rgba(59,130,246,0.15)', color: '#3b82f6',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
                                            }}>{t.name?.charAt(0)}</div>
                                            <span style={{ fontWeight: 500, fontSize: '0.875rem', color: '#e0e0ee' }}>{t.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#b8b8cc' }}>{t.email}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#b8b8cc' }}>{t.phone || '-'}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: '#555566' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button onClick={() => handleEdit(t)} style={{
                                                padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                                color: '#39FF14', cursor: 'pointer', transition: 'background 0.2s', display: 'flex',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(57,255,20,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            ><FiEdit2 size={15} /></button>
                                            <button onClick={() => handleDelete(t._id)} style={{
                                                padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                                color: '#ff4466', cursor: 'pointer', transition: 'background 0.2s', display: 'flex',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,68,102,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            ><FiTrash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!trainers.length && <p style={{ textAlign: 'center', color: '#555566', fontSize: '0.875rem', padding: '32px 0' }}>No trainers found</p>}
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
