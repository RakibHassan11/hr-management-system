import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { store } from './store';

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

interface AppProvidersProps {
    children: ReactNode;
}

/**
 * App Providers
 * Composes all application-level providers
 */
export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <TooltipProvider>
                    <BrowserRouter>
                        {children}
                        <Toaster />
                        <Sonner />
                    </BrowserRouter>
                </TooltipProvider>
            </Provider>
        </QueryClientProvider>
    );
}
