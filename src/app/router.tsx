import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage';
import { PostsPage } from '../pages/PostsPage';
import { UsersPage } from '../pages/UsersPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { DashboardPage } from '../pages/Dashboard';
import { PostDetailsPage } from '../pages/PostDetail';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
   {
    path: '/posts',
    element: (
      <ProtectedRoute>
        <PostsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/posts/:id',
    element: (
      <ProtectedRoute>
        <PostDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
]);
