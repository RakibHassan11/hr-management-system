import { Holiday } from '../types';
import { mockHolidays } from './mock';

const DELAY_MS = 600;

export const holidaysApi = {
    getHolidays: async (): Promise<Holiday[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...mockHolidays]);
            }, DELAY_MS);
        });
    },

    createHoliday: async (holiday: Omit<Holiday, 'id' | 'active' | 'total_days'>): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newHoliday: Holiday = {
                    id: Math.max(...mockHolidays.map(h => h.id), 0) + 1,
                    ...holiday,
                    active: true,
                    total_days: 1 // Calculate logic omitted for mock
                };
                mockHolidays.push(newHoliday);
                resolve({ success: true, message: 'Holiday created successfully' });
            }, DELAY_MS);
        });
    },

    deleteHoliday: async (id: number): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockHolidays.findIndex(h => h.id === id);
                if (index > -1) {
                    mockHolidays.splice(index, 1);
                    resolve({ success: true, message: 'Holiday deleted successfully' });
                } else {
                    resolve({ success: false, message: 'Holiday not found' });
                }
            }, DELAY_MS);
        });
    }
};
