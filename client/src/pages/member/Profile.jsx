import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileAPI, changePasswordAPI } from '../../services/api';
import { FiUser, FiMail, FiPhone, FiShield, FiSave } from 'react-icons/fi';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
    const [msg, setMsg] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [error, setError] = useState('');

    const handleProfile = async (e) => {
        e.preventDefault(); setMsg(''); setError('');
        try {
            const { data } = await updateProfileAPI(form);
            updateUser(data);
            setMsg('Profile updated!');
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const handlePassword = async (e) => {
        e.preventDefault(); setPwMsg(''); setError('');
        if (pwForm.newPassword !== pwForm.confirm) return setError('Passwords do not match');
        try {
            await changePasswordAPI({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
            setPwMsg('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
        } catch (e) { setError(e.response?.data?.message || 'Failed'); }
    };

    const planBadge = { basic: 'bg-gray/20 text-gray-text', pro: 'bg-neon/20 text-neon', elite: 'bg-warning/20 text-warning' };

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="font-outfit font-black text-2xl">Profile</h1>

            <div className="glass p-6 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center font-outfit font-black text-3xl text-dark">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                    <h2 className="font-outfit font-bold text-xl">{user?.name}</h2>
                    <p className="text-sm text-gray">{user?.email}</p>
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2.5 py-1 rounded-lg capitalize bg-info/20 text-info"><FiShield className="inline mr-1" size={12} />{user?.role}</span>
                        {user?.membershipPlan && <span className={`text-xs px-2.5 py-1 rounded-lg capitalize ${planBadge[user.membershipPlan]}`}>{user.membershipPlan}</span>}
                    </div>
                </div>
            </div>

            {error && <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">{error}</div>}

            <form onSubmit={handleProfile} className="glass p-6 space-y-4">
                <h3 className="font-outfit font-bold text-lg">Edit Profile</h3>
                {msg && <div className="p-3 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm">{msg}</div>}
                <div className="space-y-3">
                    <div className="relative"><FiUser className="absolute left-4 top-3.5 text-gray" size={16} /><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Name" /></div>
                    <div className="relative"><FiMail className="absolute left-4 top-3.5 text-gray" size={16} /><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full pl-11 pr-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Email" /></div>
                    <div className="relative"><FiPhone className="absolute left-4 top-3.5 text-gray" size={16} /><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full pl-11 pr-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Phone" /></div>
                </div>
                <button type="submit" className="btn-neon px-6 py-2.5 text-sm flex items-center gap-2"><FiSave size={16} /> Save Changes</button>
            </form>

            <form onSubmit={handlePassword} className="glass p-6 space-y-4">
                <h3 className="font-outfit font-bold text-lg">Change Password</h3>
                {pwMsg && <div className="p-3 bg-neon/10 border border-neon/30 rounded-xl text-neon text-sm">{pwMsg}</div>}
                <input type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Current Password" required />
                <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="New Password" required />
                <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Confirm New Password" required />
                <button type="submit" className="btn-neon px-6 py-2.5 text-sm">Change Password</button>
            </form>
        </div>
    );
}
