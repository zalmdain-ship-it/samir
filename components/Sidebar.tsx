import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarOff, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }): string => {
        const base = "flex items-center p-3 my-1 rounded-lg transition-colors duration-200";
        return isActive 
            ? `${base} bg-blue-600 text-white` 
            : `${base} text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700`;
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-800 h-screen flex flex-col p-4 shadow-lg fixed top-0 right-0">
            <div className="flex items-center justify-center p-4 mb-5 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-500">HRMS</h1>
            </div>
            <nav className="flex-grow">
                <NavLink to="/" className={navLinkClasses}>
                    <LayoutDashboard className="me-3" />
                    <span>لوحة التحكم</span>
                </NavLink>
                <NavLink to="/employees" className={navLinkClasses}>
                    <Users className="me-3" />
                    <span>الموظفون</span>
                </NavLink>
                <NavLink to="/leave" className={navLinkClasses}>
                    <CalendarOff className="me-3" />
                    <span>الإجازات</span>
                </NavLink>
                <NavLink to="/settings" className={navLinkClasses}>
                    <Settings className="me-3" />
                    <span>الإعدادات</span>
                </NavLink>
            </nav>
            <div className="mt-auto">
                <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                    <LogOut className="me-3" />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;