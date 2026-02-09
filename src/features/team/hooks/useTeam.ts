import { useState, useCallback } from 'react';
import { teamApi } from '../api';
import { TeamMember, AttendanceRequest, LeaveRequest } from '../types';
import toast from 'react-hot-toast';

export const useTeam = (managerId: number | null) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTeam = useCallback(async () => {
        if (!managerId) return;
        setLoading(true);
        try {
            const data = await teamApi.getTeamList(managerId);
            setTeamMembers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch team');
        } finally {
            setLoading(false);
        }
    }, [managerId]);

    return { teamMembers, loading, error, fetchTeam };
};

export const useTeamAttendance = (managerId: number | null) => {
    const [requests, setRequests] = useState<AttendanceRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async (status?: string) => {
        if (!managerId) return;
        setLoading(true);
        try {
            const data = await teamApi.getTeamAttendanceRequests(managerId, status);
            setRequests(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch attendance requests');
        } finally {
            setLoading(false);
        }
    }, [managerId]);

    const updateStatus = async (id: number, status: string, note?: string) => {
        const toastId = toast.loading('Updating status...');
        try {
            const res = await teamApi.updateAttendanceRequestStatus(id, status, note);
            if (res.success) {
                toast.success(res.message, { id: toastId });
                setRequests(prev => prev.map(r => r.id === id ? { ...r, ...res.data } : r));
                return true;
            } else {
                toast.error(res.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Update failed', { id: toastId });
            return false;
        }
    };

    return { requests, loading, error, fetchRequests, updateStatus };
};

export const useTeamLeave = (managerId: number | null) => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRequests = useCallback(async (status?: string) => {
        if (!managerId) return;
        setLoading(true);
        try {
            const data = await teamApi.getTeamLeaveRequests(managerId, status);
            setRequests(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    }, [managerId]);

    const updateStatus = async (id: number, status: string, note?: string) => {
        const toastId = toast.loading('Updating status...');
        try {
            const res = await teamApi.updateLeaveRequestStatus(id, status, note);
            if (res.success) {
                toast.success(res.message, { id: toastId });
                setRequests(prev => prev.map(r => r.id === id ? { ...r, ...res.data } : r));
                return true;
            } else {
                toast.error(res.message, { id: toastId });
                return false;
            }
        } catch (err: any) {
            toast.error(err.message || 'Update failed', { id: toastId });
            return false;
        }
    };

    return { requests, loading, error, fetchRequests, updateStatus };
};
