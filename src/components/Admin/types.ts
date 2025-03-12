// src/Admin/types.ts
export interface Employee {
    id: string;
    employee_id?: number;
    name: string;
    email: string;
    phone: string;
    designation: string;
    gender: string;
    blood_group: string;
    profile_image: string | null;
    present_address: string;
    permanent_address: string;
    birthday: string;
    official_birthday: string;
    joining_date: string;
    confirmed: number;
    confirmation_date: string;
    line_manager_id: number | null;
    website: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    gitlab: string;
    github: string;
    personal_email: string;
    status: string;
    created_at: string;
    updated_at: string;
    division: string;
    department: string;
    sub_department: string;
    unit: string;
    permission_value?: string;
    username?: string;
    default_shift?: string;
    breakfast?: boolean;
    lunch?: boolean;
    beef?: boolean;
    fish?: boolean;
    religion?: string;
    fathers_name?: string;
    mothers_name?: string;
    relationship_status?: string;
    spouse?: string;
    children?: string;
    division_id?: number | null;
    department_id?: number | null;
    sub_department_id?: number | null;
    unit_id?: number | null;
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
    id: string;
    name: string;
  }