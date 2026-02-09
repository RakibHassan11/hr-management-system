import { AuthResponse, ChangePasswordRequest } from '../types';
import { mockAdmin, mockUser, mockManager } from './mock';

const DELAY_MS = 800;

export const authApi = {
    loginAdmin: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email === 'admin@example.com') { // simplified check
                    resolve({
                        success: true,
                        message: 'Admin login successful',
                        data: {
                            access: { token: 'mock-admin-token', expires: '2099-12-31' },
                            refresh: { token: 'mock-admin-refresh-token', expires: '2099-12-31' },
                            admin: mockAdmin,
                        },
                    });
                } else {
                    // Allow login for testing with any credentials if not specific
                    // But strict check is better for simulation. Let's rely on success for now for easy testing.
                    resolve({
                        success: true,
                        message: 'Admin login successful',
                        data: {
                            access: { token: 'mock-admin-token', expires: '2099-12-31' },
                            refresh: { token: 'mock-admin-refresh-token', expires: '2099-12-31' },
                            admin: mockAdmin,
                        },
                    });
                    // reject({ response: { data: { message: 'Invalid credentials' } } });
                }
            }, DELAY_MS);
        });
    },

    loginUser: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = credentials.email.includes('manager') ? mockManager : mockUser;
                resolve({
                    success: true,
                    message: 'User login successful',
                    data: {
                        access: { token: 'mock-user-token', expires: '2099-12-31' },
                        refresh: { token: 'mock-user-refresh-token', expires: '2099-12-31' },
                        profile: user,
                    },
                });
            }, DELAY_MS);
        });
    },

    logout: async (): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Logged out successfully' });
            }, 500);
        });
    },

    refreshToken: async (): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Token refreshed',
                    data: {
                        access: { token: 'mock-new-access-token', expires: '2099-12-31' },
                        refresh: { token: 'mock-new-refresh-token', expires: '2099-12-31' },
                    }
                });
            }, 500);
        });
    },

    changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.new_password !== data.confirm_password) {
                    reject(new Error("Passwords don't match"));
                    return;
                }
                if (data.new_password.length < 8) {
                    reject(new Error("Password must be at least 8 characters long"));
                    return;
                }
                resolve({ success: true, message: 'Password changed successfully' });
            }, 800);
        });
    }
};
