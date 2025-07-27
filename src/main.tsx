import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import HomePage from './pages/HomePage.tsx';
import AssetsPage from './pages/AssetsPage.tsx';
import InvestmentsPage from './pages/InvestmentsPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PublicRoute from './components/PublicRoute.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'expenses', element: <HomePage /> },
          { path: 'assets', element: <AssetsPage /> },
          { path: 'investments', element: <InvestmentsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { index: true, element: <Navigate to="/expenses" replace /> }
        ]
      },
      {
        element: <PublicRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </DataProvider>
  </React.StrictMode>
);