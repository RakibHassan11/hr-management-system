import { Employee, Division, Department, SubDepartment, Unit, LineManager } from '@/types';
import { mockDivisions, mockDepartments, mockSubDepartments, mockUnits, mockLineManagers, mockAdminEmployees } from './mock';

const DELAY_MS = 600;

export const adminApi = {
    getDivisions: async (): Promise<Division[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockDivisions), DELAY_MS);
        });
    },
    getDepartments: async (): Promise<Department[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockDepartments), DELAY_MS);
        });
    },
    getSubDepartments: async (): Promise<SubDepartment[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockSubDepartments), DELAY_MS);
        });
    },
    getUnits: async (): Promise<Unit[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockUnits), DELAY_MS);
        });
    },
    getLineManagers: async (): Promise<LineManager[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockLineManagers), DELAY_MS);
        });
    },
    getEmployees: async (query: string = ''): Promise<Employee[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!query) {
                    resolve(mockAdminEmployees);
                } else {
                    const filtered = mockAdminEmployees.filter(emp => 
                        emp.name.toLowerCase().includes(query.toLowerCase()) ||
                        emp.employee_id.toString().includes(query)
                    );
                    resolve(filtered);
                }
            }, DELAY_MS);
        });
    },
    getEmployeeDetails: async (id: number): Promise<Employee> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employee = mockAdminEmployees.find(emp => emp.id === id);
                if (employee) resolve(employee);
                else reject(new Error('Employee not found'));
            }, DELAY_MS);
        });
    },
    updateEmployee: async (id: number, data: Partial<Employee>): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Updating employee ${id} with:`, data);
                resolve({ success: true, message: 'Employee updated successfully' });
            }, DELAY_MS);
        });
    },
    updatePermissions: async (id: number, permission: string): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Updating permissions for employee ${id} to ${permission}`);
                resolve({ success: true, message: 'Permissions updated successfully' });
            }, DELAY_MS);
        });
    }
};
