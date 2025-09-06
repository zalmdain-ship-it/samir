
import { Employee, LeaveRequest } from '../types';

// Simulate a network delay
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  syncData: async (data: { employees: Employee[], leaveRequests: LeaveRequest[] }): Promise<{ success: boolean }> => {
    console.log('☁️ [API] Starting sync with cloud...', data);
    await networkDelay(1500); // Simulate API call latency
    
    // In a real app, you would post this data to your backend
    // and handle success/error responses.
    
    console.log('☁️ [API] Sync with cloud successful.');
    return { success: true };
  }
};
