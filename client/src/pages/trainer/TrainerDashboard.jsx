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
        <div ref={ref} className="space-y-6">
            <h1 className="font-outfit font-black text-2xl">Trainer Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass glass-hover p-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon to-neon-dark flex items-center justify-center mb-3"><FiUsers size={20} className="text-dark" /></div>
                    <p className="text-gray text-xs uppercase tracking-wider">Assigned Members</p>
                    <p className="font-outfit font-black text-2xl mt-1">{members.length}</p>
                </div>
                <Link to="/trainer/assign-plans" className="glass glass-hover p-5 block">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-info to-blue-700 flex items-center justify-center mb-3"><FiClipboard size={20} className="text-white" /></div>
                    <p className="text-gray text-xs uppercase tracking-wider">Assign Plans</p>
                    <p className="font-medium text-sm mt-1 text-neon">Go →</p>
                </Link>
                <Link to="/trainer/progress" className="glass glass-hover p-5 block">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-warning to-orange-700 flex items-center justify-center mb-3"><FiActivity size={20} className="text-white" /></div>
                    <p className="text-gray text-xs uppercase tracking-wider">Member Progress</p>
                    <p className="font-medium text-sm mt-1 text-neon">Go →</p>
                </Link>
            </div>

            <div className="glass p-6">
                <h3 className="font-outfit font-bold text-lg mb-4">My Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map(m => (
                        <div key={m._id} className="bg-dark-lighter rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon/20 text-neon flex items-center justify-center font-bold text-sm">{m.name?.charAt(0)}</div>
                            <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-gray">{m.email}</p></div>
                        </div>
                    ))}
                    {!members.length && <p className="text-gray text-sm col-span-full text-center py-4">No members assigned to you yet.</p>}
                </div>
            </div>
        </div>
    );
}
