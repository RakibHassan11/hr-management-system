export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    designation: string;
    department: string;
    role: 'superadmin' | 'teamlead' | 'hr' | 'user';
    avatar?: string;
    password?: string;
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
