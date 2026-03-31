import { User } from '../types';

export const mockAdmin: User = {
    id: 1,
    username: 'superadmin',
    full_name: 'Super Admin',
    email: 'admin@peopleflow.com',
    designation: 'System Administrator',
    department: 'Executive',
    role: 'superadmin',
    password: 'password123',
};

export const mockUser: User = {
    id: 101,
    username: 'jdoe',
    email: 'user@peopleflow.com',
    full_name: 'John Doe',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=jdoe',
    password: 'password123',
};

export const mockManager: User = {
    id: 102,
    username: 'mscott',
    email: 'manager@peopleflow.com',
    full_name: 'Michael Scott',
    designation: 'Regional Manager',
    department: 'Sales',
    role: 'teamlead',
    avatar: 'https://i.pravatar.cc/150?u=mscott',
    password: 'password123',
};

export const mockHR: User = {
    id: 103,
    username: 'thoward',
    email: 'hr@peopleflow.com',
    full_name: 'Toby Flenderson',
    designation: 'HR Representative',
    department: 'Human Resources',
    role: 'hr',
    avatar: 'https://i.pravatar.cc/150?u=thoward',
    password: 'password123',
};
