export interface AttendanceRecord {
    date: string;
    in: string; // HH:mm
    out: string; // HH:mm
    duration?: string; // HH:mm
    status?: 'present' | 'absent' | 'late' | 'early_out' | 'weekend';
}

export interface AttendanceStatistics {
    month: string;
    present: number;
    absent: number;
    halfDay: number;
    lateInEarlyOut: number;
    sick: number;
    annual: number;
    holidays: number;
}

export interface MonthlySummaryData {
    employee_id: number;
    name: string;
    calendar_days_in_month: number;
    total_days_in_month: number;
    present_days: number;
    weekly_govt_holidays: number;
    al: number;
    med_l: number;
    ml: number;
    patnity: number;
    lwp: number;
    monthly_present: number;
    absent: number;
    late_in_early_out: number;
    late_deduction_day: number;
    joining_resign_gap: number;
    total_deduction: number;
    payable: number;
}

export interface DailyAttendanceRecord {
    id: number;
    employee_id: number;
    name: string;
    check_in_time: string | null;
    check_out_time: string | null;
    date: string;
    comment: string;
}

export interface TimeUpdateRequest {
    id: number;
    employee_id: number;
    date: string;
    type: 'CHECK_IN' | 'CHECK_OUT';
    requested_time: string;
    current_time: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CreateTimeUpdateRequest {
    date: string;
    type: 'CHECK_IN' | 'CHECK_OUT';
    requested_time: string;
    reason: string;
}
