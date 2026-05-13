import { createBrowserRouter, Navigate } from 'react-router';
import { Root } from './pages/Root';
import Home from './pages/Home';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import WorkerDashboard from './pages/WorkerDashboard';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import { AdminRoot } from './pages/admin/AdminRoot';
import Dashboard from './pages/admin/Dashboard';
import JobsManagement from './pages/admin/JobsManagement';
import UsersManagement from './pages/admin/UsersManagement';

function RedirectHome() {
  return <Navigate to="/" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'post', Component: PostJob },
      { path: 'job/:id', Component: JobDetail },
      { path: 'job', Component: RedirectHome },
      { path: 'worker', Component: WorkerDashboard },
      { path: 'activity', Component: Activity },
      { path: 'profile', Component: Profile },
      {
        path: 'admin',
        Component: AdminRoot,
        children: [
          { index: true, Component: Dashboard },
          { path: 'jobs', Component: JobsManagement },
          { path: 'users', Component: UsersManagement },
        ],
      },
    ],
  },
]);