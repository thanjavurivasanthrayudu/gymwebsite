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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-outfit font-black text-2xl">Manage Trainers</h1>
                <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', password: '', phone: '' }); }} className="btn-neon px-4 py-2.5 text-sm flex items-center gap-2"><FiPlus size={16} /> Add Trainer</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
                    <div className="flex justify-between items-center"><h3 className="font-outfit font-bold">{editing ? 'Edit' : 'Add'} Trainer</h3><button type="button" onClick={() => setShowForm(false)}><FiX /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Name" required />
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Email" required />
                        {!editing && <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Password" required />}
                        <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Phone" />
                    </div>
                    <button type="submit" className="btn-neon px-6 py-2.5 text-sm">{editing ? 'Update' : 'Create'}</button>
                </form>
            )}

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b border-dark-border">
                            <th className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">Name</th>
                            <th className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">Email</th>
                            <th className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">Phone</th>
                            <th className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">Joined</th>
                            <th className="text-right text-gray text-xs font-medium p-4 uppercase tracking-wider">Actions</th>
                        </tr></thead>
                        <tbody>
                            {trainers.map(t => (
                                <tr key={t._id} className="border-b border-dark-border/50 hover:bg-dark-lighter/50 transition-colors">
                                    <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-info/20 text-info flex items-center justify-center text-sm font-bold">{t.name?.charAt(0)}</div><span className="font-medium text-sm">{t.name}</span></div></td>
                                    <td className="p-4 text-sm text-gray-text">{t.email}</td>
                                    <td className="p-4 text-sm text-gray-text">{t.phone || '-'}</td>
                                    <td className="p-4 text-sm text-gray">{new Date(t.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right space-x-2"><button onClick={() => handleEdit(t)} className="p-2 hover:bg-neon/10 rounded-lg text-neon transition-colors"><FiEdit2 size={15} /></button><button onClick={() => handleDelete(t._id)} className="p-2 hover:bg-danger/10 rounded-lg text-danger transition-colors"><FiTrash2 size={15} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!trainers.length && <p className="text-center text-gray text-sm py-8">No trainers found</p>}
                </div>
            </div>
        </div>
    );
}
