import { useState, useCallback } from 'react';
import { attendanceApi } from '../api';
import { MonthlySummaryData } from '../types';

export const useMonthlySummary = () => {
    const [summaries, setSummaries] = useState<MonthlySummaryData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummaries = useCallback(async (month: string, year: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await attendanceApi.getMonthlySummaries(month, year);
            setSummaries(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch monthly summaries');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        summaries,
        loading,
        error,
        fetchSummaries
    };
};
