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
        { label: 'Total Members', value: data?.totalMembers || 0, icon: FiUsers, gradient: 'linear-gradient(135deg, #39FF14, #2bcc10)' },
        { label: 'Total Trainers', value: data?.totalTrainers || 0, icon: FiActivity, gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
        { label: 'Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, gradient: 'linear-gradient(135deg, #ffaa00, #cc7700)' },
        { label: 'Workouts', value: data?.totalWorkouts || 0, icon: GiWeightLiftingUp, gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)' },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue (₹)',
            data: [15000, 22000, 18000, 25000, 30000, data?.totalRevenue || 28000],
            backgroundColor: 'rgba(57, 255, 20, 0.6)',
            borderColor: '#39FF14',
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#666' }, grid: { color: '#222' } },
            y: { ticks: { color: '#666' }, grid: { color: '#222' } },
        },
    };

    return (
        <div ref={ref}>
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '24px',
            }}>Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="admin-stats-grid" style={{ marginBottom: '24px' }}>
                {stats.map(({ label, value, icon: Icon, gradient }) => (
                    <div key={label} className="glass glass-hover" style={{ padding: '20px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '12px',
                        }}>
                            <Icon size={20} color="#fff" />
                        </div>
                        <p style={{
                            color: '#555566', fontSize: '0.7rem',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            fontWeight: 600,
                        }}>{label}</p>
                        <p style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 900, fontSize: '1.5rem',
                            color: '#fff', marginTop: '4px',
                        }}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Recent Members */}
            <div className="admin-bottom-grid">
                {/* Chart */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700, fontSize: '1.125rem',
                        color: '#fff', marginBottom: '16px',
                    }}>Revenue Overview</h3>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Recent Members */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700, fontSize: '1.125rem',
                        color: '#fff', marginBottom: '16px',
                    }}>Recent Members</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(data?.recentMembers || []).map(m => (
                            <div key={m._id} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px', background: '#22222e', borderRadius: '12px',
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'rgba(57,255,20,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#39FF14', fontWeight: 700, fontSize: '0.875rem',
                                    flexShrink: 0,
                                }}>{m.name?.charAt(0)}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e0e0ee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#555566', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</p>
                                </div>
                                <span style={{
                                    fontSize: '0.7rem', padding: '4px 10px',
                                    borderRadius: '8px', background: '#12121a',
                                    color: '#555566', textTransform: 'capitalize',
                                    flexShrink: 0,
                                }}>{m.membershipPlan || 'N/A'}</span>
                            </div>
                        ))}
                        {(!data?.recentMembers?.length) && (
                            <p style={{ color: '#555566', fontSize: '0.875rem', textAlign: 'center', padding: '16px 0' }}>No members yet</p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .admin-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .admin-bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                @media (min-width: 640px) {
                    .admin-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .admin-stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .admin-bottom-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
