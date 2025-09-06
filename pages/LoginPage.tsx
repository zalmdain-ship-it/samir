import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/ui/Spinner';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username);
        setIsLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('اسم المستخدم غير صحيح. جرب "admin" أو "employee".');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl dark:bg-slate-800">
                <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
                    تسجيل الدخول
                </h1>
                <p className="text-center text-slate-600 dark:text-slate-400">
                    مرحباً بك في نظام إدارة الموارد البشرية
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            اسم المستخدم
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-slate-900 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                            placeholder="ادخل 'admin' أو 'employee'"
                        />
                    </div>
                    {/* In a real app, a password field would be here */}

                    {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {isLoading ? <Spinner className="w-5 h-5" /> : 'دخول'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;