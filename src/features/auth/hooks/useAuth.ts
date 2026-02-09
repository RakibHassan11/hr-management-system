import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { loginUser, loginSuperAdmin, logoutUser, logoutAdmin } from '@/store/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        admin,
        isAuthenticatedUser,
        isAuthenticatedAdmin,
        loadingUser,
        loadingAdmin,
        errorUser,
        errorAdmin
    } = useSelector((state: RootState) => state.auth);

    const loginAsUser = (credentials: { email: string; password: string }) => {
        return dispatch(loginUser(credentials));
    };

    const loginAsAdmin = (credentials: { email: string; password: string }) => {
        return dispatch(loginSuperAdmin(credentials));
    };

    const logoutCurrentUser = () => {
        dispatch(logoutUser());
    };

    const logoutCurrentAdmin = () => {
        dispatch(logoutAdmin());
    };

    return {
        user,
        admin,
        isAuthenticated: isAuthenticatedUser || isAuthenticatedAdmin,
        isAuthenticatedUser,
        isAuthenticatedAdmin,
        isLoading: loadingUser || loadingAdmin,
        error: errorUser || errorAdmin,
        loginAsUser,
        loginAsAdmin,
        logoutUser: logoutCurrentUser,
        logoutAdmin: logoutCurrentAdmin,
    };
};
