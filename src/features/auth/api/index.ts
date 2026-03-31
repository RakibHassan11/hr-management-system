import { AuthResponse, ChangePasswordRequest } from '../types';
import { mockAdmin, mockUser, mockManager, mockHR } from './mock';

const DELAY_MS = 800;

export const authApi = {
    loginUser: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let userProfile = null;

                if (credentials.email === 'admin@peopleflow.com' || credentials.email === 'superadmin@demo.com') {
                    userProfile = mockAdmin;
                } else if (credentials.email === 'manager@peopleflow.com' || credentials.email === 'teamlead@demo.com') {
                    userProfile = mockManager;
                } else if (credentials.email === 'hr@peopleflow.com' || credentials.email === 'hr@demo.com') {
                    userProfile = mockHR;
                } else if (credentials.email === 'user@peopleflow.com' || credentials.email === 'user@demo.com') {
                    userProfile = mockUser;
                } else {
                    // Fallback to user if no exact match for demo purposes
                    userProfile = mockUser;
                }

                // Simulate password check if password provided
                if (credentials.password && credentials.password !== 'password123' && credentials.password !== 'password') {
                     reject({ message: 'Invalid credentials' });
                     return;
                }

                resolve({
                    success: true,
                    message: 'Login successful',
                    data: {
                        access: { token: 'mock-token', expires: '2099-12-31' },
                        refresh: { token: 'mock-refresh-token', expires: '2099-12-31' },
                        profile: userProfile,
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
