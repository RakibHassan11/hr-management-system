import { Employee, EmployeeProfile, CategoryOptions } from '../types';

export const mockEmployees: Employee[] = [
    {
        id: 1,
        employee_id: 101,
        name: 'John Doe',
        birthday: '1990-05-15',
        annual_leave_balance: 12,
        sick_leave_balance: 8,
        status: 'ACTIVE',
    },
    {
        id: 2,
        employee_id: 102,
        name: 'Jane Smith',
        birthday: '1988-11-20',
        annual_leave_balance: 10,
        sick_leave_balance: 5,
        status: 'ACTIVE',
    },
    {
        id: 3,
        employee_id: 103,
        name: 'Robert Brown',
        birthday: '1995-02-10',
        annual_leave_balance: 15,
        sick_leave_balance: 10,
        status: 'INACTIVE',
    },
    {
        id: 4,
        employee_id: 104,
        name: 'Emily Davis',
        birthday: '1992-07-25',
        annual_leave_balance: 8,
        sick_leave_balance: 3,
        status: 'ACTIVE',
    },
    {
        id: 5,
        employee_id: 105,
        name: 'Michael Wilson',
        birthday: '1985-12-05',
        annual_leave_balance: 20,
        sick_leave_balance: 12,
        status: 'ACTIVE',
    },
];

export const mockCategoryOptions: CategoryOptions = {
    divisions: [
        { id: '1', title: 'Engineering' },
        { id: '2', title: 'HR' },
        { id: '3', title: 'Sales' }
    ],
    departments: [
        { id: '1', title: 'Software' },
        { id: '2', title: 'Recruitment' },
        { id: '3', title: 'Marketing' }
    ],
    subDepartments: [
        { id: '1', title: 'Frontend' },
        { id: '2', title: 'Backend' }
    ],
    units: [
        { id: '1', title: 'Unit A' },
        { id: '2', title: 'Unit B' }
    ],
    lines: [
        { id: 101, name: 'John Doe' },
        { id: 105, name: 'Michael Wilson' }
    ]
};

export const mockEmployeeProfiles: EmployeeProfile[] = [
    {
        id: 1,
        employee_id: 101,
        name: 'John Doe',
        birthday: '1990-05-15',
        annual_leave_balance: 12,
        sick_leave_balance: 8,
        status: 'ACTIVE',
        division_id: '1',
        department_id: '1',
        sub_department_id: '1',
        unit_id: '1',
        line_manager_id: null,
        email: 'john.doe@example.com',
        phone: '1234567890',
        designation: 'Senior Developer',
        joining_date: '2020-01-01',
        confirmed: 1,
        confirmation_date: '2020-07-01',
        permission_value: '2', // TEAM LEAD
        gender: 'MALE',
        religion: 'christianity',
        blood_group: 'O+',
        fathers_name: 'Mr. Doe',
        mothers_name: 'Mrs. Doe',
        relationship_status: 'married',
        present_address: '123 Main St',
        permanent_address: '456 Old Town',
        skype: 'john.doe',
        official_gmail: 'john.doe@work.com',
        github: 'johndoe',
        nid: '123456789',
        tin: '987654321',
        breakfast: 1,
        lunch: 1,
        beef: 0,
        fish: 1,
        official_mac: 'A0:51:0B:41:A6:31',
        personal_mac: '48:01:C5:AA:10:A7'
    },
    {
        id: 2,
        employee_id: 102,
        name: 'Jane Smith',
        birthday: '1988-11-20',
        annual_leave_balance: 10,
        sick_leave_balance: 5,
        status: 'ACTIVE',
        division_id: '2',
        department_id: '2',
        sub_department_id: null,
        unit_id: null,
        line_manager_id: '101',
        email: 'jane.smith@example.com',
        phone: '0987654321',
        designation: 'Recruiter',
        joining_date: '2021-03-15',
        confirmed: 1,
        confirmation_date: '2021-09-15',
        permission_value: '3', // GENERAL
        gender: 'FEMALE',
        religion: 'islam',
        blood_group: 'A+',
        breakfast: 0,
        lunch: 1,
        beef: 1,
        fish: 0
    }
];
