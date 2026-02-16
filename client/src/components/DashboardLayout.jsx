import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: '#0b0b0f' }}>
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content area */}
            <div style={{ marginLeft: 0 }} className="lg:ml-[260px]">
                {/* Top header bar — mobile only shows hamburger */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 30,
                    background: 'rgba(11,11,15,0.85)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    padding: '16px 28px',
                    display: 'flex', alignItems: 'center', gap: 16,
                }}>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden"
                        style={{
                            background: 'none', border: 'none', color: '#e0e0ee',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            padding: 4,
                        }}
                    >
                        <FiMenu size={22} />
                    </button>
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800, fontSize: '1.125rem',
                        letterSpacing: '-0.01em',
                    }}>
                        GYM<span style={{ color: '#39FF14' }}>PRO</span>
                    </h2>
                </header>

                {/* Page content */}
                <main style={{ padding: '28px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
