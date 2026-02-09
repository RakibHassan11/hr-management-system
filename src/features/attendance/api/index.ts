import { AttendanceRecord, AttendanceStatistics, MonthlySummaryData, DailyAttendanceRecord, TimeUpdateRequest, CreateTimeUpdateRequest } from '../types';
import { mockAttendanceRecords, mockStatistics, mockMonthlySummaries, mockDailyAttendance, mockTimeUpdateRequests } from './mock';

const DELAY_MS = 800;

export const attendanceApi = {
    getRecords: async (start: string, end: string): Promise<AttendanceRecord[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return mock records regardless of date range for simplicity
                resolve(mockAttendanceRecords);
            }, DELAY_MS);
        });
    },

    getStatistics: async (month: string): Promise<AttendanceStatistics> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...mockStatistics, month: month || 'Current' });
            }, DELAY_MS);
        });
    },

    getMonthlySummaries: async (month: string, year: string): Promise<MonthlySummaryData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockMonthlySummaries);
            }, DELAY_MS);
        });
    },

    getDailyAttendance: async (date: string, commentFilter: string = 'All'): Promise<{ summary: any, data: DailyAttendanceRecord[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = mockDailyAttendance;
                // Simple filter logic for mock
                if (commentFilter !== 'All') {
                    // In real app, filter by status/comment
                }

                const present = filtered.filter(r => r.comment === 'Present' || r.comment === 'Late In').length;
                const absent = filtered.filter(r => r.comment === 'Absent' || r.comment === 'Sick Leave').length;

                resolve({
                    summary: { present, absent },
                    data: filtered
                });
            }, DELAY_MS);
        });
    },

    createTimeUpdate: async (data: CreateTimeUpdateRequest): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRequest: TimeUpdateRequest = {
                    id: mockTimeUpdateRequests.length + 1,
                    employee_id: 1, // Mock current user
                    date: data.date,
                    type: data.type,
                    requested_time: data.requested_time,
                    current_time: new Date().toTimeString().slice(0, 5),
                    reason: data.reason,
                    status: 'PENDING'
                };
                mockTimeUpdateRequests.push(newRequest);
                resolve({ success: true, message: 'Time update request submitted successfully' });
            }, DELAY_MS);
        });
    },

    getTimeUpdateRequests: async (): Promise<{ success: boolean; data: TimeUpdateRequest[] }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data: mockTimeUpdateRequests });
            }, DELAY_MS);
        });
    }
};
