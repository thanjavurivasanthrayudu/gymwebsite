import { useEffect, useState, useRef } from 'react';
import { getAssignedMembersAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { FiUsers, FiClipboard, FiActivity } from 'react-icons/fi';
import gsap from 'gsap';

export default function TrainerDashboard() {
    const [members, setMembers] = useState([]);
    const ref = useRef(null);

    useEffect(() => {
        const load = async () => { try { const { data } = await getAssignedMembersAPI(); setMembers(data); } catch (e) { } };
        load();
    }, []);

    useEffect(() => {
        if (ref.current) gsap.fromTo(ref.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' });
    }, [members]);

    return (
        <div ref={ref}>
            <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: '24px',
            }}>Trainer Dashboard</h1>

            {/* Stat Cards */}
            <div className="trainer-stats-grid" style={{ marginBottom: '24px' }}>
                <div className="glass glass-hover" style={{ padding: '20px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #39FF14, #2bcc10)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px',
                    }}>
                        <FiUsers size={20} color="#0b0b0f" />
                    </div>
                    <p style={{
                        color: '#555566', fontSize: '0.7rem',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        fontWeight: 600,
                    }}>Assigned Members</p>
                    <p style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 900, fontSize: '1.5rem',
                        color: '#fff', marginTop: '4px',
                    }}>{members.length}</p>
                </div>

                <Link to="/trainer/assign-plans" className="glass glass-hover" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px',
                    }}>
                        <FiClipboard size={20} color="#fff" />
                    </div>
                    <p style={{
                        color: '#555566', fontSize: '0.7rem',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        fontWeight: 600,
                    }}>Assign Plans</p>
                    <p style={{
                        fontWeight: 500, fontSize: '0.875rem',
                        color: '#39FF14', marginTop: '4px',
                    }}>Go →</p>
                </Link>

                <Link to="/trainer/progress" className="glass glass-hover" style={{ padding: '20px', textDecoration: 'none', display: 'block' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ffaa00, #cc7700)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '12px',
                    }}>
                        <FiActivity size={20} color="#fff" />
                    </div>
                    <p style={{
                        color: '#555566', fontSize: '0.7rem',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        fontWeight: 600,
                    }}>Member Progress</p>
                    <p style={{
                        fontWeight: 500, fontSize: '0.875rem',
                        color: '#39FF14', marginTop: '4px',
                    }}>Go →</p>
                </Link>
            </div>

            {/* Members List */}
            <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700, fontSize: '1.125rem',
                    color: '#fff', marginBottom: '16px',
                }}>My Members</h3>
                <div className="trainer-members-grid">
                    {members.map(m => (
                        <div key={m._id} style={{
                            background: '#22222e', borderRadius: '12px',
                            padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(57,255,20,0.15)',
                                color: '#39FF14',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                            }}>{m.name?.charAt(0)}</div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#e0e0ee' }}>{m.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#555566' }}>{m.email}</p>
                            </div>
                        </div>
                    ))}
                    {!members.length && (
                        <p style={{
                            color: '#555566', fontSize: '0.875rem',
                            textAlign: 'center', padding: '16px 0',
                            gridColumn: '1 / -1',
                        }}>No members assigned to you yet.</p>
                    )}
                </div>
            </div>

            <style>{`
                .trainer-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                .trainer-members-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
                @media (min-width: 640px) {
                    .trainer-stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .trainer-members-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .trainer-members-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
