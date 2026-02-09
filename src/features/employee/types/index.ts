export interface Employee {
    id: number;
    employee_id: number;
    name: string;
    birthday: string | null;
    annual_leave_balance: number | null;
    sick_leave_balance: number | null;
    status: string;
}

export interface EmployeeResponse {
    data: Employee[];
    extraData: {
        total: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
    };
}

export interface EmployeeFilter {
    query?: string;
    birthMonth?: string;
    status?: string;
    page?: number;
    perPage?: number;
    sortDirection?: 'asc' | 'desc';
    sortOn?: string;
}

export interface CreateEmployeeRequest {
    employee_id: string;
    name: string;
    email: string;
    password: string;
}

export interface CreateEmployeeResponse {
    success: boolean;
    message: string;
    data?: Employee;
}

export interface EmployeeProfile extends Employee {
    division_id: string | null;
    department_id: string | null;
    sub_department_id: string | null;
    unit_id: string | null;
    line_manager_id: string | null;
    email?: string;
    phone?: string;
    designation?: string;
    joining_date?: string;
    confirmed?: number;
    confirmation_date?: string;
    permission_value?: string | null;
    gender?: string;
    religion?: string;
    official_birthday?: string;
    blood_group?: string;
    fathers_name?: string;
    mothers_name?: string;
    relationship_status?: string;
    present_address?: string;
    permanent_address?: string;
    skype?: string;
    official_gmail?: string;
    gitlab?: string;
    github?: string;
    nid?: string;
    tin?: string;
    bank_name?: string;
    bank_account_no?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    breakfast: number;
    lunch: number;
    beef: number;
    fish: number;
    resign_date?: string | null;
    official_mac?: string;
    personal_mac?: string;
}

export interface OrganizationOption {
    id: string;
    title: string;
}

export interface LineManagerOption {
    id: number;
    name: string;
}

export interface CategoryOptions {
    divisions: OrganizationOption[];
    departments: OrganizationOption[];
    subDepartments: OrganizationOption[];
    units: OrganizationOption[];
    lines: LineManagerOption[];
}
