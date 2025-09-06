
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import { PlusCircle, CloudOff } from 'lucide-react';
import { addEmployee, getAllEmployees } from '../db/idb';
import { Employee } from '../types';
import { useToasts } from '../hooks/useToasts';

const EmployeeRow: React.FC<{ employee: Employee }> = ({ employee }) => (
    <tr className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{employee.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{employee.position}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{employee.department}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{employee.email}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
            {!employee.isSynced && (
                <span title="لم تتم المزامنة" className="inline-flex items-center">
                    <CloudOff className="w-4 h-4 text-yellow-500"/>
                </span>
            )}
        </td>
    </tr>
);

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ name: '', position: '', department: '', email: '' });
    const { addToast } = useToasts();
    
    const fetchEmployees = useCallback(async () => {
        const data = await getAllEmployees();
        setEmployees(data);
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        const employeeToAdd: Employee = {
            id: `emp-${Date.now()}`,
            ...newEmployee,
            phone: '',
            hireDate: new Date().toISOString().split('T')[0],
            isSynced: false,
        };
        await addEmployee(employeeToAdd);
        addToast({ message: 'تمت إضافة الموظف محليًا بنجاح!', type: 'success' });
        fetchEmployees();
        setIsModalOpen(false);
        setNewEmployee({ name: '', position: '', department: '', email: '' });
    };

    return (
        <Layout pageTitle="إدارة الموظفين">
            <Card
                title="قائمة الموظفين"
                headerActions={
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <PlusCircle size={18} className="me-2" />
                        إضافة موظف
                    </button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">الاسم</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">المنصب</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">القسم</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">البريد الإلكتروني</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200 dark:bg-slate-800 dark:divide-slate-700">
                            {employees.length > 0 ? (
                                employees.map(emp => <EmployeeRow key={emp.id} employee={emp} />)
                            ) : (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">لا يوجد موظفون لعرضهم.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">إضافة موظف جديد</h3>
                        <form onSubmit={handleAddEmployee}>
                            <div className="space-y-4">
                                <input name="name" value={newEmployee.name} onChange={handleInputChange} placeholder="الاسم الكامل" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                <input name="position" value={newEmployee.position} onChange={handleInputChange} placeholder="المنصب الوظيفي" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                <input name="department" value={newEmployee.department} onChange={handleInputChange} placeholder="القسم" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                                <input name="email" type="email" value={newEmployee.email} onChange={handleInputChange} placeholder="البريد الإلكتروني" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">إضافة</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EmployeesPage;
