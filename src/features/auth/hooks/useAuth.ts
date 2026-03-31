import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { loginUser, logoutUser } from '@/store/authSlice';
import { authApi } from '../api';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        isAuthenticatedUser: isAuthenticated,
        loadingUser: isLoading,
        errorUser: error
    } = useSelector((state: RootState) => state.auth);

    const login = (credentials: { email: string; password?: string }) => {
        return dispatch(loginUser(credentials));
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            dispatch(logoutUser());
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
    };
};
