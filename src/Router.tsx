import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import Bills from './pages/Bills';
import BillDetail from './pages/BillDetail';
import Profile from './pages/Profile';
import { LoginPage, RegisterPage } from './pages/auth';
import { authService } from './services/api';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public Route wrapper (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'investigation',
        element: <Investigation />,
      },
      {
        path: 'bills',
        element: <Bills />,
      },
      {
        path: 'bills/:id',
        element: <BillDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
