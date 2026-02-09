import { TeamMember, AttendanceRequest, LeaveRequest } from '../types';

export const mockTeamMembers: TeamMember[] = [
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '123-456-7890',
        status: 'active',
        designation: 'Software Engineer',
        profile_image: ''
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '098-765-4321',
        status: 'active',
        designation: 'QA Engineer',
        profile_image: ''
    }
];

export const mockAttendanceRequests: AttendanceRequest[] = [
    {
        id: 1,
        employee_id: 2,
        employee_name: 'Jane Smith',
        date: new Date().toISOString(),
        time: '09:30:00',
        type: 'IN',
        status: 'PENDING',
        description: 'Forgot ID card',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        employee_id: 3,
        employee_name: 'Bob Johnson',
        date: new Date(Date.now() - 86400000).toISOString(),
        time: '18:15:00',
        type: 'OUT',
        status: 'APPROVED_BY_LINE_MANAGER',
        description: 'Worked late',
        note_by_team_lead: 'Verified',
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];

export const mockLeaveRequests: LeaveRequest[] = [
    {
        id: 1,
        employee_id: 2,
        name: 'Jane Smith',
        type: 'SICK',
        start_date: new Date(Date.now() + 86400000).toISOString(),
        end_date: new Date(Date.now() + 86400000).toISOString(),
        days: 1,
        status: 'PENDING',
        description: 'Flu',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        employee_id: 3,
        name: 'Bob Johnson',
        type: 'ANNUAL',
        start_date: new Date(Date.now() + 172800000).toISOString(),
        end_date: new Date(Date.now() + 259200000).toISOString(),
        days: 2,
        status: 'APPROVED_BY_LINE_MANAGER',
        description: 'Family Trip',
        note_by_team_lead: 'Have fun',
        created_at: new Date().toISOString()
    }
];
