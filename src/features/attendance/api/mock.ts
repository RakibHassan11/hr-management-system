import { AttendanceRecord, AttendanceStatistics, DailyAttendanceRecord, MonthlySummaryData } from '../types';

export const mockAttendanceRecords: AttendanceRecord[] = [
    { date: 'Fri 25', in: '09:00', out: '18:00', duration: '09:00', status: 'present' },
    { date: 'Sat 26', in: '--', out: '--', duration: '--', status: 'weekend' },
];

// Mock time update requests
export const mockTimeUpdateRequests: any[] = [];

export const mockStatistics: AttendanceStatistics = {
    month: 'Oct',
    present: 22,
    absent: 1,
    halfDay: 0,
    lateInEarlyOut: 3,
    sick: 1,
    annual: 2,
    holidays: 4,
};

export const mockMonthlySummaries: MonthlySummaryData[] = [
    {
        employee_id: 101,
        name: 'John Doe',
        calendar_days_in_month: 30,
        total_days_in_month: 22,
        present_days: 20,
        weekly_govt_holidays: 8,
        al: 1,
        med_l: 0,
        ml: 0,
        patnity: 0,
        lwp: 0,
        monthly_present: 20,
        absent: 1,
        late_in_early_out: 2,
        late_deduction_day: 0,
        joining_resign_gap: 0,
        total_deduction: 0,
        payable: 30
    },
    {
        employee_id: 102,
        name: 'Jane Smith',
        calendar_days_in_month: 30,
        total_days_in_month: 22,
        present_days: 22,
        weekly_govt_holidays: 8,
        al: 0,
        med_l: 0,
        ml: 0,
        patnity: 0,
        lwp: 0,
        monthly_present: 22,
        absent: 0,
        late_in_early_out: 0,
        late_deduction_day: 0,
        joining_resign_gap: 0,
        total_deduction: 0,
        payable: 30
    }
];

export const mockDailyAttendance: DailyAttendanceRecord[] = [
    {
        id: 101,
        employee_id: 101,
        name: 'John Doe',
        check_in_time: '09:00 AM',
        check_out_time: '06:00 PM',
        date: '2026-02-09',
        comment: 'Present'
    },
    {
        id: 102,
        employee_id: 102,
        name: 'Jane Smith',
        check_in_time: '09:15 AM',
        check_out_time: '06:15 PM',
        date: '2026-02-09',
        comment: 'Late In'
    },
    {
        id: 103,
        employee_id: 103,
        name: 'Robert Brown',
        check_in_time: null,
        check_out_time: null,
        date: '2026-02-09',
        comment: 'Absent'
    },
    {
        id: 104,
        employee_id: 104,
        name: 'Alice Johnson',
        check_in_time: '08:50 AM',
        check_out_time: '05:50 PM',
        date: '2026-02-09',
        comment: 'Present'
    },
    {
        id: 105,
        employee_id: 105,
        name: 'Charlie Davis',
        check_in_time: null,
        check_out_time: null,
        date: '2026-02-09',
        comment: 'Sick Leave'
    }
];
