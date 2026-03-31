import { AttendanceRecord, AttendanceStatistics, DailyAttendanceRecord, MonthlySummaryData } from '../types';

export const mockAttendanceRecords: AttendanceRecord[] = [
    { date: 'Mon 01', in: '09:05', out: '18:10', duration: '09:05', status: 'present' },
    { date: 'Tue 02', in: '08:55', out: '18:05', duration: '09:10', status: 'present' },
    { date: 'Wed 03', in: '09:15', out: '18:15', duration: '09:00', status: 'present' },
    { date: 'Thu 04', in: '09:00', out: '18:00', duration: '09:00', status: 'present' },
    { date: 'Fri 05', in: '09:02', out: '18:05', duration: '09:03', status: 'present' },
    { date: 'Sat 06', in: '--', out: '--', duration: '--', status: 'weekend' },
    { date: 'Sun 07', in: '--', out: '--', duration: '--', status: 'weekend' },
    { date: 'Mon 08', in: '09:10', out: '18:00', duration: '08:50', status: 'present' },
    { date: 'Tue 09', in: '--', out: '--', duration: '--', status: 'sick' },
    { date: 'Wed 10', in: '09:00', out: '18:00', duration: '09:00', status: 'present' },
    { date: 'Thu 11', in: '09:05', out: '18:10', duration: '09:05', status: 'present' },
    { date: 'Fri 12', in: '08:58', out: '18:02', duration: '09:04', status: 'present' },
    { date: 'Sat 13', in: '--', out: '--', duration: '--', status: 'weekend' },
    { date: 'Sun 14', in: '--', out: '--', duration: '--', status: 'weekend' },
    { date: 'Mon 15', in: '09:30', out: '18:30', duration: '09:00', status: 'late' },
    { date: 'Tue 16', in: '09:00', out: '18:00', duration: '09:00', status: 'present' },
];

// Mock time update requests
export const mockTimeUpdateRequests: any[] = [];

export const mockStatistics: AttendanceStatistics = {
    month: 'Feb',
    present: 14,
    absent: 0,
    halfDay: 0,
    lateInEarlyOut: 1,
    sick: 1,
    annual: 0,
    holidays: 0,
};

export const mockMonthlySummaries: MonthlySummaryData[] = [
    {
        employee_id: 1,
        name: 'Rakibul Hassan Rakib',
        calendar_days_in_month: 28,
        total_days_in_month: 20,
        present_days: 19,
        weekly_govt_holidays: 8,
        al: 0,
        med_l: 1,
        ml: 0,
        patnity: 0,
        lwp: 0,
        monthly_present: 19,
        absent: 0,
        late_in_early_out: 1,
        late_deduction_day: 0,
        joining_resign_gap: 0,
        total_deduction: 0,
        payable: 28
    },
    {
        employee_id: 101,
        name: 'John Doe',
        calendar_days_in_month: 28,
        total_days_in_month: 20,
        present_days: 18,
        weekly_govt_holidays: 8,
        al: 1,
        med_l: 1,
        ml: 0,
        patnity: 0,
        lwp: 0,
        monthly_present: 18,
        absent: 0,
        late_in_early_out: 2,
        late_deduction_day: 0,
        joining_resign_gap: 0,
        total_deduction: 0,
        payable: 28
    }
];

export const mockDailyAttendance: DailyAttendanceRecord[] = [
    {
        id: 1,
        employee_id: 1,
        name: 'Rakibul Hassan Rakib',
        check_in_time: '09:02',
        check_out_time: '18:05',
        date: '2026-02-16',
        comment: 'Present'
    },
    {
        id: 101,
        employee_id: 101,
        name: 'John Doe',
        check_in_time: '09:00',
        check_out_time: '18:00',
        date: '2026-02-16',
        comment: 'Present'
    },
    {
        id: 102,
        employee_id: 102,
        name: 'Michael Scott',
        check_in_time: '09:15',
        check_out_time: '18:15',
        date: '2026-02-16',
        comment: 'Late In'
    },
    {
        id: 103,
        employee_id: 103,
        name: 'Toby Flenderson',
        check_in_time: '08:50',
        check_out_time: '17:50',
        date: '2026-02-16',
        comment: 'Present'
    }
];
