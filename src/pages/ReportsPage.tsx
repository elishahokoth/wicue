import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChartIcon, PieChartIcon, CalendarIcon, UsersIcon, BookOpenIcon } from 'lucide-react';
const ReportsPage = () => {
  const {
    users,
    courses
  } = useAuth();
  const [reportType, setReportType] = useState('users');
  // User statistics for pie chart
  const userStats = [{
    name: 'Admins',
    value: users.filter(user => user.role === 'admin').length,
    color: '#8884d8'
  }, {
    name: 'Lecturers',
    value: users.filter(user => user.role === 'lecturer' && user.status === 'active').length,
    color: '#82ca9d'
  }, {
    name: 'Students',
    value: users.filter(user => user.role === 'student' && user.status === 'active').length,
    color: '#ffc658'
  }, {
    name: 'Pending',
    value: users.filter(user => user.status === 'pending').length,
    color: '#ff8042'
  }];
  // Course statistics for bar chart
  const courseStats = courses.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title,
    modules: course.modules.length,
    students: (course.enrolledStudents || []).length
  }));
  // Student enrollment data for line chart
  const enrollmentData = [{
    month: 'Jan',
    enrollments: 5
  }, {
    month: 'Feb',
    enrollments: 8
  }, {
    month: 'Mar',
    enrollments: 12
  }, {
    month: 'Apr',
    enrollments: 15
  }, {
    month: 'May',
    enrollments: 20
  }, {
    month: 'Jun',
    enrollments: 25
  }];
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Reports</h1>
        <p className="text-gray-600">
          View analytics and reports for the platform
        </p>
      </div>
      {/* Report type selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setReportType('users')} className={`inline-flex items-center px-4 py-2 border ${reportType === 'users' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md`}>
            <UsersIcon className="h-5 w-5 mr-2" />
            User Statistics
          </button>
          <button onClick={() => setReportType('courses')} className={`inline-flex items-center px-4 py-2 border ${reportType === 'courses' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md`}>
            <BookOpenIcon className="h-5 w-5 mr-2" />
            Course Statistics
          </button>
          <button onClick={() => setReportType('enrollments')} className={`inline-flex items-center px-4 py-2 border ${reportType === 'enrollments' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md`}>
            <CalendarIcon className="h-5 w-5 mr-2" />
            Enrollment Trends
          </button>
        </div>
      </div>
      {/* Report content */}
      <div className="bg-white rounded-lg shadow p-6">
        {reportType === 'users' && <div>
            <div className="flex items-center mb-4">
              <PieChartIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                User Distribution
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userStats} cx="50%" cy="50%" labelLine={true} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {userStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {userStats.map(stat => <div key={stat.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </div>)}
            </div>
          </div>}
        {reportType === 'courses' && <div>
            <div className="flex items-center mb-4">
              <BarChartIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Course Statistics
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseStats} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="modules" fill="#8884d8" name="Modules" />
                  <Bar dataKey="students" fill="#82ca9d" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Total Courses
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {courses.length}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  With a total of{' '}
                  {courses.reduce((total, course) => total + course.modules.length, 0)}{' '}
                  modules
                </div>
              </div>
            </div>
          </div>}
        {reportType === 'enrollments' && <div>
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">
                Enrollment Trends
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollments" fill="#8884d8" name="New Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-500">
                  Total Enrollments
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Across all courses
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default ReportsPage;