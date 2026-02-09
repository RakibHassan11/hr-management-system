/**
 * Application Configuration
 * Environment variables and app-wide constants
 */

export const config = {
    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

    // Feature Flags
    useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false', // Default to true

    // App Metadata
    appName: 'HRM System',
    appVersion: '1.0.0',

    // Environment
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
} as const;

export type AppConfig = typeof config;
