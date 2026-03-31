import { LeaveBalance, LeaveRecord } from '../types';

export const mockLeaveBalances: LeaveBalance[] = [
    { type: 'Annual', current: '12', startOfYear: '15' },
    { type: 'Sick', current: '8', startOfYear: '10' },
    { type: 'Casual', current: '5', startOfYear: '8' },
];

export const mockLeaveRecords: LeaveRecord[] = [
    {
        id: 1,
        name: 'Rakibul Hassan Rakib',
        days: 2,
        description: 'Personal errands',
        start_date: '2025-02-10',
        end_date: '2025-02-11',
        type: 'Casual',
        status: 'APPROVED_BY_HR'
    },
    {
        id: 2,
        name: 'John Doe',
        days: 5,
        description: 'Annual vacation',
        start_date: '2025-03-01',
        end_date: '2025-03-05',
        type: 'Annual',
        status: 'PENDING'
    },
    {
        id: 3,
        name: 'Michael Scott',
        days: 1,
        description: 'Doctors appointment',
        start_date: '2025-02-15',
        end_date: '2025-02-15',
        type: 'Sick',
        status: 'APPROVED_BY_LINE_MANAGER'
    },
    {
        id: 4,
        name: 'Toby Flenderson',
        days: 3,
        description: 'Family emergency',
        start_date: '2025-01-20',
        end_date: '2025-01-22',
        type: 'Casual',
        status: 'REJECTED_BY_LINE_MANAGER'
    },
    {
        id: 5,
        name: 'John Doe',
        days: 1,
        description: 'Fever',
        start_date: '2025-01-10',
        end_date: '2025-01-10',
        type: 'Sick',
        status: 'APPROVED_BY_HR'
    },
    {
        id: 6,
        name: 'Rakibul Hassan Rakib',
        days: 1,
        description: 'Bank work',
        start_date: '2025-01-05',
        end_date: '2025-01-05',
        type: 'Casual',
        status: 'APPROVED_BY_LINE_MANAGER'
    }
];
