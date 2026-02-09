export interface Admin {
    id: number;
    full_name: string;
    email: string;
    role: 'admin' | 'super_admin';
}

export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    designation: string;
    department: string;
    permission_value: number; // 1: Staff, 2: Manager, 3: HR/Admin access within user panel?
    avatar?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
        profile?: User;
        admin?: Admin;
    };
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
    confirm_password: string;
}
