import { useEffect, useState } from 'react';
import { getPaymentsAPI, createPaymentAPI, getMembersAPI } from '../../services/api';
import { FiPlus, FiX, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';

export default function ManagePayments() {
    const [payments, setPayments] = useState([]);
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ userId: '', amount: '', plan: 'basic', duration: 1, status: 'paid', notes: '' });

    const load = async () => { try { const [{ data: p }, { data: m }] = await Promise.all([getPaymentsAPI(), getMembersAPI()]); setPayments(p); setMembers(m); } catch (e) { } };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { await createPaymentAPI(form); setShowForm(false); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); }
    };

    const downloadReceipt = (p) => {
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text('GYM PRO - Payment Receipt', 20, 30);
        doc.setFontSize(12);
        doc.text(`Receipt ID: ${p.receiptId || 'N/A'}`, 20, 50);
        doc.text(`Member: ${p.user?.name || 'N/A'}`, 20, 60);
        doc.text(`Email: ${p.user?.email || 'N/A'}`, 20, 70);
        doc.text(`Plan: ${p.plan?.toUpperCase()}`, 20, 80);
        doc.text(`Amount: INR ${p.amount}`, 20, 90);
        doc.text(`Status: ${p.status}`, 20, 100);
        doc.text(`Date: ${new Date(p.paymentDate || p.createdAt).toLocaleDateString()}`, 20, 110);
        doc.save(`receipt_${p.receiptId || p._id}.pdf`);
    };

    const statusColors = { paid: 'bg-neon/10 text-neon', pending: 'bg-warning/10 text-warning', overdue: 'bg-danger/10 text-danger' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-outfit font-black text-2xl">Payments</h1>
                <button onClick={() => setShowForm(true)} className="btn-neon px-4 py-2.5 text-sm flex items-center gap-2"><FiPlus size={16} /> Add Payment</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
                    <div className="flex justify-between"><h3 className="font-outfit font-bold">New Payment</h3><button type="button" onClick={() => setShowForm(false)}><FiX /></button></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" required>
                            <option value="">Select Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                        </select>
                        <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Amount (₹)" required />
                        <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white">
                            <option value="basic">Basic</option><option value="pro">Pro</option><option value="elite">Elite</option>
                        </select>
                        <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} className="px-4 py-3 bg-dark-lighter border border-dark-border rounded-xl text-sm text-white" placeholder="Duration (months)" min="1" />
                    </div>
                    <button type="submit" className="btn-neon px-6 py-2.5 text-sm">Record Payment</button>
                </form>
            )}

            <div className="glass overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="border-b border-dark-border">
                        {['Member', 'Plan', 'Amount', 'Status', 'Date', 'Receipt'].map(h => <th key={h} className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p._id} className="border-b border-dark-border/50 hover:bg-dark-lighter/50">
                                <td className="p-4 text-sm font-medium">{p.user?.name || 'N/A'}</td>
                                <td className="p-4 text-sm capitalize">{p.plan}</td>
                                <td className="p-4 text-sm font-semibold text-neon">₹{p.amount}</td>
                                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-lg capitalize ${statusColors[p.status]}`}>{p.status}</span></td>
                                <td className="p-4 text-sm text-gray">{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                                <td className="p-4"><button onClick={() => downloadReceipt(p)} className="p-2 hover:bg-neon/10 rounded-lg text-neon transition-colors"><FiDownload size={15} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!payments.length && <p className="text-center text-gray text-sm py-8">No payments found</p>}
            </div>
        </div>
    );
}
