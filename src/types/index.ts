export interface OrganizationOption {
    id: number;
    title: string;
}

export interface Employee {
    id: number;
    employee_id: number;
    name: string;
    email: string;
    phone: string;
    designation: string;
    status: string;
    // Personal Details
    birthday: string | null;
    official_birthday?: string;
    gender?: string;
    blood_group?: string;
    religion?: string;
    fathers_name?: string;
    mothers_name?: string;
    spouse?: string;
    children?: string;
    relationship_status?: string;
    personal_email?: string;
    present_address?: string;
    permanent_address?: string;
    // Official Details
    joining_date?: string;
    confirmed?: number | boolean; // Normalized to handle legacy/new mismatch
    confirmation_date?: string;
    resign_date?: string | null;
    division_id?: number | null;
    department_id?: number | null;
    sub_department_id?: number | null;
    unit_id?: number | null;
    line_manager_id?: number | null;
    division?: string;
    department?: string;
    sub_department?: string;
    unit?: string;
    permission_value?: string | number | null; // Handle mismatch
    username?: string;
    default_shift?: string;
    // Social
    website?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    gitlab?: string;
    github?: string;
    skype?: string;
    official_gmail?: string;
    nid?: string;
    tin?: string;
    bank_name?: string;
    bank_account_no?: string;
    // Meal
    breakfast?: boolean | number;
    lunch?: boolean | number;
    beef?: boolean | number;
    fish?: boolean | number;
    // Leave Balances
    annual_leave_balance?: number | null;
    sick_leave_balance?: number | null;
    casual_leave_balance?: number | null;
    // Meta
    created_at?: string;
    updated_at?: string;
    profile_image?: string | null;
    // Device
    official_mac?: string;
    personal_mac?: string;
}

export interface Division {
    id: number;
    title: string;
}

export interface Department {
    id: number;
    title: string;
}

export interface SubDepartment {
    id: number;
    title: string;
}

export interface Unit {
    id: number;
    title: string;
}

export interface LineManager {
    id: number | string; // Handle mismatch
    name: string;
}
