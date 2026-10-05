import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from '@olegpolyakov/ui';
import { AuthProvider } from '@olegpolyakov/frontend/features/auth';

import App from './app';
import { AUTH_URL } from './env';

import './index.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <Router>
                <AuthProvider apiUrl={AUTH_URL}>
                    <App />
                </AuthProvider>
            </Router>
        </Provider>
    </StrictMode>
);