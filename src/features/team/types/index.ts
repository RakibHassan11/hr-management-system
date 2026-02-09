export interface TeamMember {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: string;
    designation: string;
    profile_image?: string;
}

export interface AttendanceRequest {
    id: number;
    employee_id: number;
    employee_name: string;
    date: string;
    time: string;
    type: 'IN' | 'OUT';
    status: 'PENDING' | 'APPROVED_BY_LINE_MANAGER' | 'REJECTED_BY_LINE_MANAGER' | 'APPROVED_BY_HR' | 'REJECTED_BY_HR';
    description: string;
    note_by_team_lead?: string | null;
    note_by_hr?: string | null;
    created_at: string;
    updated_at?: string;
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    name: string; // employee name
    type: 'SICK' | 'ANNUAL' | 'CASUAL' | 'HALF_DAY';
    start_date: string;
    end_date: string;
    days: number;
    status: 'PENDING' | 'APPROVED_BY_LINE_MANAGER' | 'REJECTED_BY_LINE_MANAGER' | 'APPROVED_BY_HR' | 'REJECTED_BY_HR';
    description: string;
    note_by_team_lead?: string | null;
    note_by_hr?: string | null;
    created_at: string;
    updated_at?: string;
}
