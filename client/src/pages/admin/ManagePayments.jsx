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

    const statusColors = {
        paid: { bg: 'rgba(57,255,20,0.1)', color: '#39FF14' },
        pending: { bg: 'rgba(255,170,0,0.1)', color: '#ffaa00' },
        overdue: { bg: 'rgba(255,68,102,0.1)', color: '#ff4466' },
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
                }}>Payments</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-neon"
                    style={{ padding: '10px 16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FiPlus size={16} /> Add Payment
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff' }}>New Payment</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
                            <FiX size={18} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="manage-form-grid" style={{ marginBottom: '16px' }}>
                            <select value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} style={inputStyle} required>
                                <option value="">Select Member</option>{members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                            </select>
                            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} style={inputStyle} placeholder="Amount (₹)" required />
                            <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))} style={inputStyle}>
                                <option value="basic">Basic</option><option value="pro">Pro</option><option value="elite">Elite</option>
                            </select>
                            <input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} style={inputStyle} placeholder="Duration (months)" min="1" />
                        </div>
                        <button type="submit" className="btn-neon" style={{ padding: '10px 24px', fontSize: '0.875rem' }}>Record Payment</button>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="glass" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <th style={thStyle}>Member</th>
                                <th style={thStyle}>Plan</th>
                                <th style={thStyle}>Amount</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => {
                                const sc = statusColors[p.status] || { bg: '#22222e', color: '#555566' };
                                return (
                                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,34,46,0.5)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 500, color: '#e0e0ee' }}>{p.user?.name || 'N/A'}</td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', textTransform: 'capitalize', color: '#b8b8cc' }}>{p.plan}</td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 600, color: '#39FF14' }}>₹{p.amount}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                fontSize: '0.7rem', padding: '4px 10px', borderRadius: '8px',
                                                background: sc.bg, color: sc.color, textTransform: 'capitalize',
                                            }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '0.875rem', color: '#555566' }}>{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px' }}>
                                            <button onClick={() => downloadReceipt(p)} style={{
                                                padding: '8px', borderRadius: '8px', background: 'none', border: 'none',
                                                color: '#39FF14', cursor: 'pointer', transition: 'background 0.2s', display: 'flex',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(57,255,20,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            ><FiDownload size={15} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!payments.length && <p style={{ textAlign: 'center', color: '#555566', fontSize: '0.875rem', padding: '32px 0' }}>No payments found</p>}
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
