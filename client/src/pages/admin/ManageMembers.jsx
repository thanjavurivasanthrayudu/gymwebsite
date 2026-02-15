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

    const planColors = { basic: 'bg-gray/20 text-gray-text', pro: 'bg-neon/10 text-neon', elite: 'bg-warning/10 text-warning' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-outfit font-black text-2xl">Manage Members</h1>
                <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', password: '', phone: '', membershipPlan: 'basic', assignedTrainer: '' }); }} className="btn-neon px-4 py-2.5 text-sm flex items-center gap-2"><FiPlus size={16} /> Add Member</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
                    <div className="flex justify-between items-center"><h3 className="font-outfit font-bold">{editing ? 'Edit' : 'Add'} Member</h3><button type="button" onClick={() => setShowForm(false)}><FiX /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Name" required />
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Email" required />
                        {!editing && <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Password" required />}
                        <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Phone" />
                        <select value={form.membershipPlan} onChange={e => setForm(p => ({ ...p, membershipPlan: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                            <option value="basic">Basic</option><option value="pro">Pro</option><option value="elite">Elite</option>
                        </select>
                        <select value={form.assignedTrainer} onChange={e => setForm(p => ({ ...p, assignedTrainer: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                            <option value="">No Trainer</option>{trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn-neon px-6 py-2.5 text-sm">{editing ? 'Update' : 'Create'}</button>
                </form>
            )}

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-dark-border">
                            {['Name', 'Email', 'Plan', 'Trainer', 'Expiry', 'Actions'].map(h => <th key={h} className={`text-${h === 'Actions' ? 'right' : 'left'} text-gray text-xs font-medium p-4 uppercase tracking-wider`}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {members.map(m => (
                                <tr key={m._id} className="border-b border-dark-border/50 hover:bg-dark-lighter/50 transition-colors">
                                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-neon/20 text-neon flex items-center justify-center text-sm font-bold">{m.name?.charAt(0)}</div><span className="font-medium text-sm">{m.name}</span></div></td>
                                    <td className="p-4 text-sm text-gray-text">{m.email}</td>
                                    <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-lg capitalize ${planColors[m.membershipPlan] || 'bg-dark-lighter text-gray'}`}>{m.membershipPlan || 'None'}</span></td>
                                    <td className="p-4 text-sm text-gray-text">{m.assignedTrainer?.name || '-'}</td>
                                    <td className="p-4 text-sm text-gray">{m.membershipExpiry ? new Date(m.membershipExpiry).toLocaleDateString() : '-'}</td>
                                    <td className="p-4 text-right space-x-2"><button onClick={() => handleEdit(m)} className="p-2 hover:bg-neon/10 rounded-lg text-neon transition-colors"><FiEdit2 size={15} /></button><button onClick={() => handleDelete(m._id)} className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors"><FiTrash2 size={15} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!members.length && <p className="text-center text-gray text-sm py-8">No members found</p>}
                </div>
            </div>
        </div>
    );
}
