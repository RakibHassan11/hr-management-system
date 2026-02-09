import { Admin, User } from '../types';

export const mockAdmin: Admin = {
    id: 1,
    full_name: 'Super Admin',
    email: 'admin@orangetoolz.com',
    role: 'super_admin',
};

export const mockUser: User = {
    id: 101,
    username: 'jdoe',
    email: 'user@orangetoolz.com',
    full_name: 'John Doe',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    permission_value: 1,
    avatar: 'https://i.pravatar.cc/150?u=jdoe',
};

export const mockManager: User = {
    id: 102,
    username: 'mscott',
    email: 'manager@orangetoolz.com',
    full_name: 'Michael Scott',
    designation: 'Regional Manager',
    department: 'Sales',
    permission_value: 2, // Manager permission
    avatar: 'https://i.pravatar.cc/150?u=mscott',
};
