import { Employee, Division, Department, SubDepartment, Unit, LineManager } from '@/types';

export const mockDivisions: Division[] = [
    { id: 1, title: 'Engineering' },
    { id: 2, title: 'Human Resources' },
    { id: 3, title: 'Marketing' },
];

export const mockDepartments: Department[] = [
    { id: 1, title: 'Frontend' },
    { id: 2, title: 'Backend' },
    { id: 3, title: 'QA' },
    { id: 4, title: 'Talent Acquisition' },
];

export const mockSubDepartments: SubDepartment[] = [
    { id: 1, title: 'React Team' },
    { id: 2, title: 'Node Team' },
];

export const mockUnits: Unit[] = [
    { id: 1, title: 'Unit A' },
    { id: 2, title: 'Unit B' },
];

export const mockLineManagers: LineManager[] = [
    { id: 101, name: 'John Doe' },
    { id: 105, name: 'Michael Wilson' },
];

export const mockAdminEmployees: Employee[] = [
    {
        id: 1,
        employee_id: 101,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        designation: 'Senior Developer',
        status: 'ACTIVE',
        birthday: '1990-05-15',
        role: 'teamlead',
        division: 'Engineering',
        department: 'Frontend',
        sub_department: 'React Team',
        unit: 'Unit A',
        line_manager_id: null,
    },
    {
        id: 2,
        employee_id: 102,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '0987654321',
        designation: 'Recruiter',
        status: 'ACTIVE',
        birthday: '1988-11-20',
        role: 'user',
        division: 'Human Resources',
        department: 'Talent Acquisition',
        sub_department: null,
        unit: null,
        line_manager_id: 101,
    }
];
