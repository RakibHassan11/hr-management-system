import { useState, useCallback, useEffect } from 'react';
import { holidaysApi } from '../api';
import { Holiday } from '../types';

export const useHolidays = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHolidays = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await holidaysApi.getHolidays();
            setHolidays(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch holidays');
        } finally {
            setLoading(false);
        }
    }, []);

    const createHoliday = async (holiday: Omit<Holiday, 'id' | 'active' | 'total_days'>) => {
        setLoading(true);
        try {
            const response = await holidaysApi.createHoliday(holiday);
            if (response.success) {
                await fetchHolidays();
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const deleteHoliday = async (id: number) => {
        setLoading(true);
        try {
            const response = await holidaysApi.deleteHoliday(id);
            if (response.success) {
                await fetchHolidays();
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    }

    return {
        holidays,
        loading,
        error,
        fetchHolidays,
        createHoliday,
        deleteHoliday
    };
};
