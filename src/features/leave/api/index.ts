import { LeaveBalance, LeaveRecord, LeaveRequest, LeaveResponse } from '../types';
import { mockLeaveBalances, mockLeaveRecords } from './mock';

const DELAY_MS = 600;

export const leaveApi = {
    getBalances: async (): Promise<LeaveBalance[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockLeaveBalances);
            }, DELAY_MS);
        });
    },

    getLeaveRecords: async (): Promise<LeaveRecord[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockLeaveRecords);
            }, DELAY_MS);
        });
    },

    submitLeave: async (request: LeaveRequest): Promise<LeaveResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRecord: LeaveRecord = {
                    id: Math.max(...mockLeaveRecords.map(r => r.id), 0) + 1,
                    name: 'Current User', // Mock user name
                    days: request.days,
                    description: request.description,
                    start_date: request.start_date,
                    end_date: request.end_date,
                    type: request.type,
                    status: 'PENDING'
                };
                mockLeaveRecords.unshift(newRecord);
                resolve({ success: true, message: 'Leave application submitted successfully' });
            }, DELAY_MS);
        });
    },
};
