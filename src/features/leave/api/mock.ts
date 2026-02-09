import { LeaveBalance, LeaveRecord } from '../types';

export const mockLeaveBalances: LeaveBalance[] = [
    { type: 'Annual', current: '12', startOfYear: '15' },
    { type: 'Sick', current: '8', startOfYear: '10' },
    { type: 'Casual', current: '5', startOfYear: '8' },
];

export const mockLeaveRecords: LeaveRecord[] = [
    {
        id: 1,
        name: 'John Doe',
        days: 2,
        description: 'Family vacation',
        start_date: '2025-05-10',
        end_date: '2025-05-11',
        type: 'Annual',
        status: 'APPROVED_BY_HR'
    },
    {
        id: 2,
        name: 'Jane Smith',
        days: 1,
        description: 'Medical appointment',
        start_date: '2025-06-01',
        end_date: '2025-06-01',
        type: 'Sick',
        status: 'PENDING'
    },
    {
        id: 3,
        name: 'Robert Brown',
        days: 3,
        description: 'Personal leave',
        start_date: '2025-07-20',
        end_date: '2025-07-22',
        type: 'Casual',
        status: 'REJECTED_BY_LINE_MANAGER'
    }
];
