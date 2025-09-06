
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string; 
  isSynced: boolean;
}

export enum LeaveStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    isSynced: boolean;
}
