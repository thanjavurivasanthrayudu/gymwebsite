import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-dark">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:ml-64">
                <header className="sticky top-0 z-30 bg-dark/80 backdrop-blur-lg border-b border-dark-border px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white"><FiMenu size={22} /></button>
                    <h2 className="font-outfit font-bold text-lg gradient-text">GYM PRO</h2>
                </header>
                <main className="p-6"><Outlet /></main>
            </div>
        </div>
    );
}
