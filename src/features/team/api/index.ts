import { TeamMember, AttendanceRequest, LeaveRequest } from '../types';
import { mockTeamMembers, mockAttendanceRequests, mockLeaveRequests } from './mock';

const DELAY_MS = 500;

export const teamApi = {
    getTeamList: async (managerId: number): Promise<TeamMember[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return all mock members for now, in real app filter by managerId
                resolve(mockTeamMembers);
            }, DELAY_MS);
        });
    },

    getTeamAttendanceRequests: async (managerId: number, status?: string): Promise<AttendanceRequest[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = [...mockAttendanceRequests];
                if (status) {
                    data = data.filter(r => r.status === status);
                }
                resolve(data);
            }, DELAY_MS);
        });
    },

    getTeamLeaveRequests: async (managerId: number, status?: string): Promise<LeaveRequest[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = [...mockLeaveRequests];
                if (status) {
                    data = data.filter(r => r.status === status);
                }
                resolve(data);
            }, DELAY_MS);
        });
    },

    updateAttendanceRequestStatus: async (id: number, status: string, note?: string): Promise<{ success: boolean; message: string; data?: any }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockAttendanceRequests.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockAttendanceRequests[index] = {
                        ...mockAttendanceRequests[index],
                        status: status as any,
                        note_by_team_lead: status.includes('LINE_MANAGER') ? note : mockAttendanceRequests[index].note_by_team_lead,
                        note_by_hr: status.includes('HR') ? note : mockAttendanceRequests[index].note_by_hr,
                        updated_at: new Date().toISOString()
                    };
                    resolve({ success: true, message: 'Status updated', data: mockAttendanceRequests[index] });
                } else {
                    resolve({ success: false, message: 'Record not found' });
                }
            }, DELAY_MS);
        });
    },

    updateLeaveRequestStatus: async (id: number, status: string, note?: string): Promise<{ success: boolean; message: string; data?: any }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockLeaveRequests.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockLeaveRequests[index] = {
                        ...mockLeaveRequests[index],
                        status: status as any,
                        note_by_team_lead: status.includes('LINE_MANAGER') ? note : mockLeaveRequests[index].note_by_team_lead,
                        note_by_hr: status.includes('HR') ? note : mockLeaveRequests[index].note_by_hr,
                        updated_at: new Date().toISOString()
                    };
                    resolve({ success: true, message: 'Status updated', data: mockLeaveRequests[index] });
                } else {
                    resolve({ success: false, message: 'Record not found' });
                }
            }, DELAY_MS);
        });
    }
};
