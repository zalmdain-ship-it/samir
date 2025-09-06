
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => {
    return (
        <Layout pageTitle="الصفحة غير موجودة">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <p className="text-2xl mt-4 text-slate-800 dark:text-slate-200">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">قد تكون قد أزيلت أو تم تغيير اسمها أو أنها غير متاحة مؤقتاً.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    العودة إلى لوحة التحكم
                </Link>
            </div>
        </Layout>
    );
};

export default NotFoundPage;
