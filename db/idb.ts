
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Employee, LeaveRequest, User, UserRole } from '../types';

const DB_NAME = 'HRMS_DB';
const DB_VERSION = 1;

interface HRMSDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  employees: {
    key: string;
    value: Employee;
    indexes: { 'by-name': string };
  };
  leaveRequests: {
    key: string;
    value: LeaveRequest;
    indexes: { 'by-employeeId': string };
  };
}

let db: IDBPDatabase<HRMSDB> | null = null;

async function getDb(): Promise<IDBPDatabase<HRMSDB>> {
  if (db) {
    return db;
  }
  
  db = await openDB<HRMSDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('employees')) {
        const store = db.createObjectStore('employees', { keyPath: 'id' });
        store.createIndex('by-name', 'name');
      }
      if (!db.objectStoreNames.contains('leaveRequests')) {
        const store = db.createObjectStore('leaveRequests', { keyPath: 'id' });
        store.createIndex('by-employeeId', 'employeeId');
      }
    },
  });

  // Seed initial data if necessary
  const userCount = await db.count('users');
  if (userCount === 0) {
      const initialUsers: User[] = [
        { id: 'admin-01', username: 'admin', role: UserRole.ADMIN, name: 'المدير العام', avatarUrl: `https://picsum.photos/seed/admin/100` },
        { id: 'employee-01', username: 'employee', role: UserRole.EMPLOYEE, name: 'موظف تجريبي', avatarUrl: `https://picsum.photos/seed/employee/100` },
      ];
      const tx = db.transaction('users', 'readwrite');
      await Promise.all(initialUsers.map(user => tx.store.add(user)));
      await tx.done;
  }

  return db;
}

// Employee Functions
export const addEmployee = async (employee: Employee) => (await getDb()).add('employees', employee);
export const getAllEmployees = async () => (await getDb()).getAll('employees');
export const getUnsyncedEmployees = async () => {
    const allEmployees = await getAllEmployees();
    return allEmployees.filter(e => !e.isSynced);
};
export const updateEmployeesAsSynced = async (employeeIds: string[]) => {
    const db = await getDb();
    const tx = db.transaction('employees', 'readwrite');
    const store = tx.objectStore('employees');
    const updates = employeeIds.map(async id => {
        const employee = await store.get(id);
        if (employee) {
            await store.put({ ...employee, isSynced: true });
        }
    });
    await Promise.all(updates);
    await tx.done;
};

// Leave Request Functions
export const addLeaveRequest = async (request: LeaveRequest) => (await getDb()).add('leaveRequests', request);
export const getAllLeaveRequests = async () => (await getDb()).getAll('leaveRequests');
export const updateLeaveRequestStatus = async (id: string, status: LeaveRequest['status']) => {
    const db = await getDb();
    const request = await db.get('leaveRequests', id);
    if(request) {
        await db.put('leaveRequests', {...request, status, isSynced: false });
    }
};
export const getUnsyncedLeaveRequests = async () => {
    const allRequests = await getAllLeaveRequests();
    return allRequests.filter(r => !r.isSynced);
};
export const updateLeaveRequestsAsSynced = async (requestIds: string[]) => {
    const db = await getDb();
    const tx = db.transaction('leaveRequests', 'readwrite');
    const store = tx.objectStore('leaveRequests');
    const updates = requestIds.map(async id => {
        const request = await store.get(id);
        if (request) {
            await store.put({ ...request, isSynced: true });
        }
    });
    await Promise.all(updates);
    await tx.done;
};


// User Functions
export const getUserByUsername = async (username: string): Promise<User | undefined> => {
    const users = await (await getDb()).getAll('users');
    return users.find(u => u.username === username);
};
