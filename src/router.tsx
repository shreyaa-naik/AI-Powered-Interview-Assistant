import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './views/AppLayout'
import { IntervieweeView } from './views/IntervieweeView'
import { DashboardView } from './views/DashboardView'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/interview" replace /> },
      { path: '/interview', element: <IntervieweeView /> },
      { path: '/dashboard', element: <DashboardView /> },
    ],
  },
])


