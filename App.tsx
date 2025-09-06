import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToasts } from './hooks/useToasts';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { getUnsyncedEmployees, getUnsyncedLeaveRequests, updateEmployeesAsSynced, updateLeaveRequestsAsSynced } from './db/idb';
import { mockApi } from './services/mockApi';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import LeavePage from './pages/LeavePage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/ui/Spinner';
import CookieConsentBanner from './components/ui/CookieConsentBanner';


const SyncManager: React.FC = () => {
    const isOnline = useOnlineStatus();
    const { addToast } = useToasts();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const syncData = async () => {
            if (isSyncing) return;

            const unsyncedEmployees = await getUnsyncedEmployees();
            const unsyncedLeaveRequests = await getUnsyncedLeaveRequests();

            if (unsyncedEmployees.length === 0 && unsyncedLeaveRequests.length === 0) {
                console.log('🔄 No data to sync.');
                return;
            }

            setIsSyncing(true);
            addToast({ message: 'بدء مزامنة البيانات مع السحابة...', type: 'success' });

            try {
                const response = await mockApi.syncData({
                    employees: unsyncedEmployees,
                    leaveRequests: unsyncedLeaveRequests,
                });
                
                if (response.success) {
                    await updateEmployeesAsSynced(unsyncedEmployees.map(e => e.id));
                    await updateLeaveRequestsAsSynced(unsyncedLeaveRequests.map(r => r.id));
                    addToast({ message: 'اكتملت المزامنة بنجاح!', type: 'success' });
                } else {
                    throw new Error('Sync failed on the server');
                }
            } catch (error) {
                console.error('Sync failed:', error);
                addToast({ message: 'فشلت المزامنة، سيتم المحاولة مرة أخرى.', type: 'error' });
            } finally {
                setIsSyncing(false);
            }
        };

        if (isOnline) {
            syncData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline]);

    return null; // This component doesn't render anything
};


const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />
            <Route path="/employees" element={<PrivateRoute element={<EmployeesPage />} />} />
            <Route path="/leave" element={<PrivateRoute element={<LeavePage />} />} />
            <Route path="/settings" element={<PrivateRoute element={<DashboardPage />} />} />
            <Route path="*" element={<PrivateRoute element={<NotFoundPage />} />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                 <SyncManager />
                 <HashRouter>
                    <AppRoutes />
                 </HashRouter>
                 <CookieConsentBanner />
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;