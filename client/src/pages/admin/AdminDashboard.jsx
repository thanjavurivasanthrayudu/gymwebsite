import { useEffect, useState, useRef } from 'react';
import { getAnalyticsAPI } from '../../services/api';
import { FiUsers, FiDollarSign, FiActivity } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import gsap from 'gsap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        const load = async () => {
            try { const { data: d } = await getAnalyticsAPI(); setData(d); } catch (e) { console.error(e); }
        };
        load();
    }, []);

    useEffect(() => {
        if (data && ref.current) gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' });
    }, [data]);

    const stats = [
        { label: 'Total Members', value: data?.totalMembers || 0, icon: FiUsers, color: 'from-neon to-neon-dark' },
        { label: 'Total Trainers', value: data?.totalTrainers || 0, icon: FiActivity, color: 'from-info to-blue-700' },
        { label: 'Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'from-warning to-orange-700' },
        { label: 'Workouts', value: data?.totalWorkouts || 0, icon: GiWeightLiftingUp, color: 'from-purple-500 to-purple-700' },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{ label: 'Revenue (₹)', data: [15000, 22000, 18000, 25000, 30000, data?.totalRevenue || 28000], backgroundColor: 'rgba(57, 255, 20, 0.6)', borderColor: '#39FF14', borderWidth: 1, borderRadius: 8 }]
    };

    return (
        <div ref={ref} className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="glass glass-hover p-5">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}><Icon size={20} className="text-white" /></div>
                        <p className="text-gray text-xs uppercase tracking-wider">{label}</p>
                        <p className="font-outfit font-black text-2xl mt-1">{value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6">
                    <h3 className="font-outfit font-bold text-lg mb-4">Revenue Overview</h3>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#666' }, grid: { color: '#222' } }, y: { ticks: { color: '#666' }, grid: { color: '#222' } } } }} />
                </div>

                <div className="glass p-6">
                    <h3 className="font-outfit font-bold text-lg mb-4">Recent Members</h3>
                    <div className="space-y-3">
                        {(data?.recentMembers || []).map(m => (
                            <div key={m._id} className="flex items-center gap-3 p-3 bg-dark-lighter rounded-xl">
                                <div className="w-9 h-9 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-sm">{m.name?.charAt(0)}</div>
                                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{m.name}</p><p className="text-xs text-gray truncate">{m.email}</p></div>
                                <span className="text-xs text-gray capitalize px-2 py-1 rounded-lg bg-dark-card">{m.membershipPlan || 'N/A'}</span>
                            </div>
                        ))}
                        {(!data?.recentMembers?.length) && <p className="text-gray text-sm text-center py-4">No members yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
