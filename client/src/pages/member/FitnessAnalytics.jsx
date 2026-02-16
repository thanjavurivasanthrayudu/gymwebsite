import { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line, Scatter } from 'react-chartjs-2';
import { getWorkoutStats, getSummaryStats, getAgeGroups, fitnessData } from '../../data/fitnessData';
import { FiActivity, FiZap, FiTarget, FiClock } from 'react-icons/fi';
import gsap from 'gsap';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const chartColors = {
    Yoga: '#a855f7', HIIT: '#ef4444', Cardio: '#3b82f6', Strength: '#39FF14',
};
const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#999', font: { size: 12 } } } },
    scales: {
        x: { ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#666' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
};

export default function FitnessAnalytics() {
    const ref = useRef(null);
    const summary = getSummaryStats();
    const workoutStats = getWorkoutStats();
    const ageGroups = getAgeGroups();

    useEffect(() => {
        if (ref.current) gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' });
    }, []);

    const statCards = [
        { icon: FiActivity, label: 'Total Records', value: summary.totalRecords, color: '#39FF14' },
        { icon: FiZap, label: 'Avg Calories', value: `${summary.avgCalories} kcal`, color: '#ef4444' },
        { icon: FiTarget, label: 'Avg BMI', value: summary.avgBMI, color: '#3b82f6' },
        { icon: FiClock, label: 'Avg Duration', value: `${summary.avgDuration}h`, color: '#a855f7' },
    ];

    // Chart 1: Workout Type Distribution (Doughnut)
    const doughnutData = {
        labels: workoutStats.map(s => s.type),
        datasets: [{
            data: workoutStats.map(s => s.count),
            backgroundColor: workoutStats.map(s => chartColors[s.type]),
            borderWidth: 0, hoverOffset: 8,
        }],
    };

    // Chart 2: Avg Calories by Workout Type (Bar)
    const caloriesBarData = {
        labels: workoutStats.map(s => s.type),
        datasets: [{
            label: 'Avg Calories Burned',
            data: workoutStats.map(s => s.avgCalories),
            backgroundColor: workoutStats.map(s => chartColors[s.type] + '99'),
            borderColor: workoutStats.map(s => chartColors[s.type]),
            borderWidth: 2, borderRadius: 8,
        }],
    };

    // Chart 3: BPM by Age Group (Line)
    const bpmLineData = {
        labels: ageGroups.map(g => g.label),
        datasets: [
            { label: 'Max BPM', data: ageGroups.map(g => g.avgMaxBPM), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
            { label: 'Avg BPM', data: ageGroups.map(g => g.avgAvgBPM), borderColor: '#39FF14', backgroundColor: 'rgba(57,255,20,0.1)', fill: true, tension: 0.4 },
            { label: 'Resting BPM', data: ageGroups.map(g => g.avgRestBPM), borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
        ],
    };

    // Chart 4: Experience Level (Horizontal Bar)
    const expBarData = {
        labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [{
            label: 'Members',
            data: [summary.experienceSplit.beginner, summary.experienceSplit.intermediate, summary.experienceSplit.advanced],
            backgroundColor: ['rgba(59,130,246,0.7)', 'rgba(255,170,0,0.7)', 'rgba(57,255,20,0.7)'],
            borderRadius: 8,
        }],
    };

    // Chart 5: BMI vs Calories (Scatter)
    const scatterData = {
        datasets: [{
            label: 'BMI vs Calories',
            data: fitnessData.slice(0, 200).map(d => ({ x: d.bmi, y: d.caloriesBurned })),
            backgroundColor: fitnessData.slice(0, 200).map(d => chartColors[d.workoutType] + '80'),
            pointRadius: 4,
        }],
    };

    return (
        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div className="glass" style={{ padding: '1.75rem 2rem' }}>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>
                    Fitness <span className="gradient-text">Analytics</span>
                </h1>
                <p style={{ color: '#999', fontSize: '0.875rem' }}>Insights from {summary.totalRecords} workout records</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {statCards.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={20} color={color} />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#fff' }}>{value}</p>
                            <p style={{ fontSize: '0.75rem', color: '#999' }}>{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="analytics-grid-2col">
                <div className="glass" style={{ padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Workout Type Distribution</h3>
                    <div style={{ height: 260, display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={doughnutData} options={{ ...chartOpts, scales: undefined, plugins: { ...chartOpts.plugins, legend: { position: 'bottom', labels: { color: '#999', padding: 16, font: { size: 12 } } } } }} />
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Avg Calories by Workout Type</h3>
                    <div style={{ height: 260 }}>
                        <Bar data={caloriesBarData} options={{ ...chartOpts, plugins: { ...chartOpts.plugins, legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="analytics-grid-2col">
                <div className="glass" style={{ padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Heart Rate by Age Group</h3>
                    <div style={{ height: 260 }}>
                        <Line data={bpmLineData} options={chartOpts} />
                    </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem 2rem' }}>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Experience Level Breakdown</h3>
                    <div style={{ height: 260 }}>
                        <Bar data={expBarData} options={{ ...chartOpts, indexAxis: 'y', plugins: { ...chartOpts.plugins, legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            {/* Chart Row 3 */}
            <div className="glass" style={{ padding: '1.5rem 2rem' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>BMI vs Calories Burned</h3>
                <div style={{ height: 300 }}>
                    <Scatter data={scatterData} options={{
                        ...chartOpts,
                        plugins: { ...chartOpts.plugins, legend: { display: false } },
                        scales: {
                            x: { ...chartOpts.scales.x, title: { display: true, text: 'BMI', color: '#999' } },
                            y: { ...chartOpts.scales.y, title: { display: true, text: 'Calories Burned', color: '#999' } },
                        },
                    }} />
                </div>
            </div>

            {/* Workout Type Detail Cards */}
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#fff' }}>Workout Type Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {workoutStats.map(s => (
                    <div key={s.type} className="glass" style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: chartColors[s.type] }} />
                            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{s.type}</h4>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div><span style={{ color: '#666' }}>Participants</span><br /><strong style={{ color: '#fff' }}>{s.count}</strong></div>
                            <div><span style={{ color: '#666' }}>Avg Calories</span><br /><strong style={{ color: '#fff' }}>{s.avgCalories}</strong></div>
                            <div><span style={{ color: '#666' }}>Avg Duration</span><br /><strong style={{ color: '#fff' }}>{s.avgDuration}h</strong></div>
                            <div><span style={{ color: '#666' }}>Avg BMI</span><br /><strong style={{ color: '#fff' }}>{s.avgBMI}</strong></div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .analytics-grid-2col { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </div>
    );
}
