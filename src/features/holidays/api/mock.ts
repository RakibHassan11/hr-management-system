import { Holiday } from '../types';

export const mockHolidays: Holiday[] = [
    {
        id: 1,
        title: 'New Year',
        start_date: '2025-01-01',
        end_date: '2025-01-01',
        active: true,
        total_days: 1,
    },
    {
        id: 2,
        title: 'Labor Day',
        start_date: '2025-05-01',
        end_date: '2025-05-01',
        active: true,
        total_days: 1,
    },
    {
        id: 3,
        title: 'Eid al-Fitr',
        start_date: '2025-04-01',
        end_date: '2025-04-03',
        active: true,
        total_days: 3,
    },
];
