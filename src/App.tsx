
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CourseManagement from './pages/CourseManagement';
import CourseView from './pages/CourseView';
import ModuleView from './pages/ModuleView';
import Assessment from './pages/Assessment';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import StudentProgressPage from './pages/StudentProgressPage';
import StudentProgressTracker from './pages/StudentProgressTracker';
import CalendarPage from './pages/CalendarPage';
import MessagePage from './pages/MessagePage';
import NotificationsPage from './pages/NotificationsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import LearningPath from './pages/LearningPath';
import StudentGrades from './pages/StudentGrades';
import ResourcesPage from './pages/ResourcesPage';
import ExaminationPage from './pages/ExaminationPage';
import ChambersPage from './pages/ChambersPage';
import DominionsPage from './pages/DominionsPage';
import ProfilePage from './pages/ProfilePage';
// Protected route component
type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};
const ProtectedRoute = ({
  children,
  allowedRoles
}: ProtectedRouteProps) => {
  const {
    currentUser
  } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export function App() {
  return <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                  <Layout />
                </ProtectedRoute>}>
              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>} />
              <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}>
                    <UsersPage userRole="admin" />
                  </ProtectedRoute>} />
              <Route path="admin/reports" element={<ProtectedRoute allowedRoles={['admin']}>
                    <ReportsPage />
                  </ProtectedRoute>} />
              <Route path="admin/settings" element={<ProtectedRoute allowedRoles={['admin']}>
                    <SettingsPage userRole="admin" />
                  </ProtectedRoute>} />
              <Route path="admin/student-progress" element={<ProtectedRoute allowedRoles={['admin']}>
                    <StudentProgressTracker userRole="admin" />
                  </ProtectedRoute>} />
              <Route path="admin/dominions" element={<ProtectedRoute allowedRoles={['admin']}>
                    <DominionsPage />
                  </ProtectedRoute>} />
              <Route path="dominions" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <DominionsPage />
                  </ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <ProfilePage />
                  </ProtectedRoute>} />
              {/* Lecturer Routes */}
              <Route path="lecturer" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}>
                    <LecturerDashboard />
                  </ProtectedRoute>} />
              <Route path="lecturer/students" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}>
                    <UsersPage userRole="lecturer" />
                  </ProtectedRoute>} />
              <Route path="lecturer/settings" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}>
                    <SettingsPage userRole="lecturer" />
                  </ProtectedRoute>} />
              <Route path="lecturer/student-progress" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}>
                    <StudentProgressTracker userRole="lecturer" />
                  </ProtectedRoute>} />
              {/* Student Routes */}
              <Route path="student" element={<ProtectedRoute allowedRoles={['admin', 'student']}>
                    <StudentDashboard />
                  </ProtectedRoute>} />
              <Route path="student/progress" element={<ProtectedRoute allowedRoles={['admin', 'student']}>
                    <StudentProgressPage />
                  </ProtectedRoute>} />
              <Route path="student/settings" element={<ProtectedRoute allowedRoles={['admin', 'student']}>
                    <SettingsPage userRole="student" />
                  </ProtectedRoute>} />
              <Route path="student/grades" element={<ProtectedRoute allowedRoles={['admin', 'student']}>
                    <StudentGrades />
                  </ProtectedRoute>} />
              <Route path="learning-path" element={<ProtectedRoute allowedRoles={['admin', 'student']}>
                    <LearningPath />
                  </ProtectedRoute>} />
              {/* Shared Routes */}
              <Route path="courses" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <CourseManagement />
                  </ProtectedRoute>} />
              <Route path="courses/:courseId" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <CourseView />
                  </ProtectedRoute>} />
              <Route path="courses/:courseId/modules/:moduleId" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <ModuleView />
                  </ProtectedRoute>} />
              <Route path="courses/:courseId/modules/:moduleId/assessment" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <Assessment />
                  </ProtectedRoute>} />
              <Route path="admin/examinations" element={<ProtectedRoute allowedRoles={['admin']}>
                    <ExaminationPage />
                  </ProtectedRoute>} />
              <Route path="lecturer/examinations" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}>
                    <ExaminationPage />
                  </ProtectedRoute>} />
              <Route path="calendar" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <CalendarPage />
                  </ProtectedRoute>} />
              <Route path="messages" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <MessagePage />
                  </ProtectedRoute>} />
              <Route path="notifications" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <NotificationsPage />
                  </ProtectedRoute>} />
              <Route path="help" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <HelpSupportPage />
                  </ProtectedRoute>} />
              <Route path="resources" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <ResourcesPage />
                  </ProtectedRoute>} />
              <Route path="chambers" element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']}>
                    <ChambersPage />
                  </ProtectedRoute>} />
              {/* Default redirect */}
              <Route path="" element={<Navigate to="/login" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>;
}