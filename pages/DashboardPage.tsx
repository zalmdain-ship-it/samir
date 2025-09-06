
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import { Users, Calendar, CheckCircle } from 'lucide-react';
import { getAllEmployees, getAllLeaveRequests } from '../db/idb';
import { Employee, LeaveRequest, LeaveStatus } from '../types';

const DashboardPage: React.FC = () => {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [pendingLeaves, setPendingLeaves] = useState(0);
    const [approvedLeaves, setApprovedLeaves] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const employees: Employee[] = await getAllEmployees();
            const leaveRequests: LeaveRequest[] = await getAllLeaveRequests();
            
            setEmployeeCount(employees.length);
            setPendingLeaves(leaveRequests.filter(r => r.status === LeaveStatus.PENDING).length);
            setApprovedLeaves(leaveRequests.filter(r => r.status === LeaveStatus.APPROVED).length);
        };
        fetchData();
    }, []);

    return (
        <Layout pageTitle="لوحة التحكم">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-r-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">إجمالي الموظفين</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{employeeCount}</p>
                        </div>
                    </div>
                </Card>
                <Card className="border-r-4 border-yellow-500">
                     <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900">
                            <Calendar className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">طلبات إجازة معلقة</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{pendingLeaves}</p>
                        </div>
                    </div>
                </Card>
                <Card className="border-r-4 border-green-500">
                     <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">إجازات موافق عليها</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{approvedLeaves}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-8">
                <Card title="مرحباً بك!">
                    <p className="text-slate-600 dark:text-slate-300">
                        هذا هو نظام إدارة الموارد البشرية الخاص بك. يمكنك التنقل بين الأقسام باستخدام القائمة الجانبية.
                        يعمل هذا التطبيق بشكل كامل دون اتصال بالإنترنت، وسيتم مزامنة أي تغييرات تجريها تلقائيًا عند عودة الاتصال.
                    </p>
                </Card>
            </div>
        </Layout>
    );
};

export default DashboardPage;
