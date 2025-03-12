// src/main.tsx
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/store/store'; // Import from store.ts
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

console.log('Loading main.tsx at:', new Date().toISOString());
console.log('Imported store from @/store/store:', store);
console.log('Store dispatch:', store.dispatch);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
);
