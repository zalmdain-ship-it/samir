import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import { PlusCircle, CloudOff, Check, X } from 'lucide-react';
import { addLeaveRequest, getAllLeaveRequests, updateLeaveRequestStatus } from '../db/idb';
import { LeaveRequest, LeaveStatus, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToasts } from '../hooks/useToasts';

const LeaveStatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
    const statusStyles = {
        [LeaveStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        [LeaveStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        [LeaveStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    const statusText = {
        [LeaveStatus.PENDING]: 'معلق',
        [LeaveStatus.APPROVED]: 'موافق عليه',
        [LeaveStatus.REJECTED]: 'مرفوض',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>{statusText[status]}</span>;
};


const LeavePage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const { addToast } = useToasts();

    const fetchRequests = useCallback(async () => {
        const data = await getAllLeaveRequests();
        if (user?.role === UserRole.EMPLOYEE) {
            setLeaveRequests(data.filter(r => r.employeeId === user.id));
        } else {
            setLeaveRequests(data);
        }
    }, [user]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);
    
    const handleStatusChange = async (id: string, status: LeaveStatus) => {
        await updateLeaveRequestStatus(id, status);
        addToast({message: `تم تحديث حالة الطلب محلياً.`, type: 'success'});
        fetchRequests();
    };

    const handleAddRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newRequest: LeaveRequest = {
            id: `leave-${Date.now()}`,
            employeeId: user!.id,
            employeeName: user!.name,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            reason: formData.get('reason') as string,
            status: LeaveStatus.PENDING,
            isSynced: false,
        };
        await addLeaveRequest(newRequest);
        addToast({message: 'تم إرسال طلب الإجازة محلياً.', type: 'success'});
        fetchRequests();
        setIsModalOpen(false);
    };

    return (
        <Layout pageTitle="إدارة الإجازات">
            <Card
                title="طلبات الإجازة"
                headerActions={
                    user?.role === UserRole.EMPLOYEE && (
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <PlusCircle size={18} className="me-2" />
                            طلب إجازة
                        </button>
                    )
                }
            >
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                {user?.role === UserRole.ADMIN && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">اسم الموظف</th>}
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">تاريخ البدء</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">تاريخ الانتهاء</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">
                            {leaveRequests.map(req => (
                                <tr key={req.id}>
                                    {user?.role === UserRole.ADMIN && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{req.employeeName}</td>}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{req.startDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{req.endDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><LeaveStatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            {/* Fix: Wrap CloudOff icon in a span with a title attribute for tooltip as title prop is not supported */}
                                            {!req.isSynced && <span title="لم تتم المزامنة"><CloudOff className="w-4 h-4 text-yellow-500" /></span>}
                                            {user?.role === UserRole.ADMIN && req.status === LeaveStatus.PENDING && (
                                                <>
                                                    <button onClick={() => handleStatusChange(req.id, LeaveStatus.APPROVED)} className="p-1 text-green-600 hover:text-green-800"><Check size={18}/></button>
                                                    <button onClick={() => handleStatusChange(req.id, LeaveStatus.REJECTED)} className="p-1 text-red-600 hover:text-red-800"><X size={18}/></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">طلب إجازة جديد</h3>
                        <form onSubmit={handleAddRequest}>
                            <div className="space-y-4">
                                <input type="date" name="startDate" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                <input type="date" name="endDate" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                <textarea name="reason" placeholder="سبب الإجازة" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"></textarea>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">إرسال</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default LeavePage;