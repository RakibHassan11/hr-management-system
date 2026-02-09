import { Employee, EmployeeFilter, EmployeeResponse, CreateEmployeeRequest, CreateEmployeeResponse, EmployeeProfile, CategoryOptions } from '../types';
import { mockEmployees, mockEmployeeProfiles, mockCategoryOptions } from './mock';

const DELAY_MS = 600;

export const employeeApi = {
    getEmployees: async (filter: EmployeeFilter = {}): Promise<EmployeeResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredEmployees = [...mockEmployees];

                // Filter by name
                if (filter.query) {
                    const query = filter.query.toLowerCase();
                    filteredEmployees = filteredEmployees.filter((emp) =>
                        emp.name.toLowerCase().includes(query)
                    );
                }

                // Filter by status
                if (filter.status && filter.status !== 'ALL') {
                    filteredEmployees = filteredEmployees.filter(
                        (emp) => emp.status === filter.status
                    );
                }

                // Filter by birth month
                if (filter.birthMonth && filter.birthMonth !== 'all') {
                    filteredEmployees = filteredEmployees.filter((emp) => {
                        if (!emp.birthday) return false;
                        const month = new Date(emp.birthday).getMonth() + 1;
                        return month.toString() === filter.birthMonth;
                    });
                }

                // Sorting
                if (filter.sortOn) {
                    filteredEmployees.sort((a, b) => {
                        const valA = a[filter.sortOn as keyof Employee] ?? '';
                        const valB = b[filter.sortOn as keyof Employee] ?? '';

                        if (valA < valB) return filter.sortDirection === 'asc' ? -1 : 1;
                        if (valA > valB) return filter.sortDirection === 'asc' ? 1 : -1;
                        return 0;
                    });
                }

                // Pagination
                const page = filter.page || 1;
                const perPage = filter.perPage || 10;
                const total = filteredEmployees.length;
                const totalPages = Math.ceil(total / perPage);
                const start = (page - 1) * perPage;
                const end = start + perPage;
                const data = filteredEmployees.slice(start, end);

                resolve({
                    data,
                    extraData: {
                        total,
                        totalPages,
                        currentPage: page,
                        perPage,
                    },
                });
            }, DELAY_MS);
        });
    },

    resignEmployee: async (id: number, resignationDate: string): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const empIndex = mockEmployees.findIndex(e => e.id === id);
                if (empIndex > -1) {
                    mockEmployees[empIndex].status = 'INACTIVE';
                    resolve({ success: true, message: 'Employee resigned successfully' });
                } else {
                    reject({ success: false, message: 'Failed to resign employee' });
                }
            }, DELAY_MS);
        });
    },
    createEmployee: async (data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newEmployee: Employee = {
                    id: mockEmployees.length + 1,
                    employee_id: parseInt(data.employee_id),
                    name: data.name,
                    birthday: null, // Default
                    annual_leave_balance: 0,
                    sick_leave_balance: 0,
                    status: 'ACTIVE'
                };
                mockEmployees.push(newEmployee);
                resolve({ success: true, message: 'Employee created successfully', data: newEmployee });
            }, DELAY_MS);
        });
    },

    getEmployeeProfile: async (id: number): Promise<EmployeeProfile | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const profile = mockEmployeeProfiles.find(p => p.id === id) || null;
                resolve(profile);
            }, DELAY_MS);
        });
    },

    updateEmployeeProfile: async (data: EmployeeProfile): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockEmployeeProfiles.findIndex(p => p.id === data.id);
                if (index !== -1) {
                    mockEmployeeProfiles[index] = { ...mockEmployeeProfiles[index], ...data };
                    resolve({ success: true, message: 'Profile updated successfully' });
                } else {
                    resolve({ success: false, message: 'Profile not found' });
                }
            }, DELAY_MS);
        });
    },

    getCategoryOptions: async (): Promise<CategoryOptions> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockCategoryOptions);
            }, DELAY_MS);
        });
    },

    updateLeaveBalance: async (id: number, annual: number | null, sick: number | null): Promise<{ success: boolean; message: string; data?: { annual_leave_balance: number, sick_leave_balance: number } }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockEmployeeProfiles.findIndex(p => p.id === id);
                if (index !== -1) {
                    if (annual !== null) mockEmployeeProfiles[index].annual_leave_balance = annual;
                    if (sick !== null) mockEmployeeProfiles[index].sick_leave_balance = sick;

                    // Also update the list view mock data for consistency
                    const listIndex = mockEmployees.findIndex(e => e.id === id);
                    if (listIndex !== -1) {
                        if (annual !== null) mockEmployees[listIndex].annual_leave_balance = annual;
                        if (sick !== null) mockEmployees[listIndex].sick_leave_balance = sick;
                    }

                    resolve({
                        success: true,
                        message: 'Leave balance updated',
                        data: {
                            annual_leave_balance: mockEmployeeProfiles[index].annual_leave_balance || 0,
                            sick_leave_balance: mockEmployeeProfiles[index].sick_leave_balance || 0
                        }
                    });
                } else {
                    resolve({ success: false, message: 'Employee not found' });
                }
            }, DELAY_MS);
        });
    }
};
