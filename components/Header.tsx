
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const Header: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
    const { user } = useAuth();
    const isOnline = useOnlineStatus();

    return (
        <header className="bg-white dark:bg-slate-800 p-4 shadow-sm flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{pageTitle}</h2>
            <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <span>{isOnline ? 'متصل' : 'غير متصل'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <img 
                        src={user?.avatarUrl || `https://picsum.photos/seed/${user?.id}/100`} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
