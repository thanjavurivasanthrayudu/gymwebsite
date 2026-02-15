import { useEffect, useState } from 'react';
import { getMyPaymentsAPI } from '../../services/api';
import { FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';

export default function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    useEffect(() => { const load = async () => { try { const { data } = await getMyPaymentsAPI(); setPayments(data); } catch (e) { } }; load(); }, []);

    const downloadReceipt = (p) => {
        const doc = new jsPDF();
        doc.setFontSize(20); doc.text('GYM PRO - Payment Receipt', 20, 30);
        doc.setFontSize(12);
        doc.text(`Receipt ID: ${p.receiptId || 'N/A'}`, 20, 50);
        doc.text(`Plan: ${p.plan?.toUpperCase()}`, 20, 60);
        doc.text(`Amount: INR ${p.amount}`, 20, 70);
        doc.text(`Status: ${p.status}`, 20, 80);
        doc.text(`Date: ${new Date(p.paymentDate || p.createdAt).toLocaleDateString()}`, 20, 90);
        doc.save(`receipt_${p.receiptId || p._id}.pdf`);
    };

    const statusColors = { paid: 'bg-neon/10 text-neon', pending: 'bg-warning/10 text-warning', overdue: 'bg-danger/10 text-danger' };

    return (
        <div className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Payment History</h1>
            <div className="glass overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="border-b border-dark-border">
                        {['Plan', 'Amount', 'Status', 'Date', 'Receipt'].map(h => <th key={h} className="text-left text-gray text-xs font-medium p-4 uppercase tracking-wider">{h}</th>)}
                    </tr></thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p._id} className="border-b border-dark-border/50 hover:bg-dark-lighter/50">
                                <td className="p-4 text-sm capitalize font-medium">{p.plan}</td>
                                <td className="p-4 text-sm font-semibold text-neon">₹{p.amount}</td>
                                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-lg capitalize ${statusColors[p.status]}`}>{p.status}</span></td>
                                <td className="p-4 text-sm text-gray">{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</td>
                                <td className="p-4"><button onClick={() => downloadReceipt(p)} className="p-2 hover:bg-neon/10 rounded-lg text-neon transition-colors"><FiDownload size={15} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!payments.length && <p className="text-center text-gray text-sm py-8">No payment records</p>}
            </div>
        </div>
    );
}
