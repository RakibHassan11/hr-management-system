export interface LeaveBalance {
    type: string;
    current: string;
    startOfYear: string;
}

export interface LeaveRecord {
    id: number;
    name: string;
    days: number;
    description: string;
    start_date: string;
    end_date: string;
    type: string;
    status: string;
}

export interface LeaveRequest {
    type: string;
    start_date: string;
    end_date: string;
    days: number;
    description: string;
    without_pay?: boolean;
}

export interface LeaveResponse {
    success: boolean;
    message: string;
}
