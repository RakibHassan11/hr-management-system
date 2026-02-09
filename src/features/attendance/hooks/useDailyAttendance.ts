import { useState, useCallback, useEffect } from 'react';
import { attendanceApi } from '../api';
import { DailyAttendanceRecord } from '../types';

export const useDailyAttendance = () => {
    const [records, setRecords] = useState<DailyAttendanceRecord[]>([]);
    const [summary, setSummary] = useState<{ present: number; absent: number }>({ present: 0, absent: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDailyAttendance = useCallback(async (date: string, commentFilter: string = 'All') => {
        setLoading(true);
        setError(null);
        try {
            const response = await attendanceApi.getDailyAttendance(date, commentFilter);
            setRecords(response.data);
            setSummary(response.summary);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch daily attendance');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        records,
        summary,
        loading,
        error,
        fetchDailyAttendance
    };
};
