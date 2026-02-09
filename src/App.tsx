import { AppProviders, AppRoutes } from './app/index';

/**
 * App Component
 * Thin composition layer - all bootstrap logic in app/
 */
function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;