import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, UsersIcon, BarChartIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon, BellIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const AdminDashboard = () => {
  const {
    users,
    courses,
    pendingLecturers,
    pendingStudents,
    approveUser,
    rejectUser
  } = useAuth();
  const [showPendingLecturers, setShowPendingLecturers] = useState(false);
  const [showPendingStudents, setShowPendingStudents] = useState(false);
  // Log for debugging
  useEffect(() => {
    console.log('AdminDashboard - Users:', users?.length || 0);
    console.log('AdminDashboard - Pending Lecturers:', pendingLecturers?.length || 0);
    console.log('AdminDashboard - Pending Students:', pendingStudents?.length || 0);
  }, [users, pendingLecturers, pendingStudents]);
  // Auto-show pending requests if there are any
  useEffect(() => {
    if (pendingLecturers && pendingLecturers.length > 0) {
      setShowPendingLecturers(true);
    }
    if (pendingStudents && pendingStudents.length > 0) {
      setShowPendingStudents(true);
    }
  }, [pendingLecturers, pendingStudents]);
  // Filter users by role - add null check to prevent errors
  const lecturers = users ? users.filter(user => user.role === 'lecturer' && user.status === 'active') : [];
  const students = users ? users.filter(user => user.role === 'student' && user.status === 'active') : [];
  const handleApproveUser = (userId: string) => {
    console.log('Approving user:', userId);
    approveUser(userId);
  };
  const handleRejectUser = (userId: string) => {
    console.log('Rejecting user:', userId);
    rejectUser(userId);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Wicue admin dashboard.</p>
        <p className="text-xs text-gray-400 mt-1">
          System info: {users?.length || 0} users,{' '}
          {pendingLecturers?.length || 0} pending lecturers,{' '}
          {pendingStudents?.length || 0} pending students
        </p>
      </div>

      {/* Pending Approval Alerts */}
      {(pendingLecturers?.length > 0 || pendingStudents?.length > 0) && <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <BellIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              {pendingLecturers?.length > 0 && <p className="text-sm text-yellow-700 mb-2">
                  You have {pendingLecturers.length} pending lecturer{' '}
                  {pendingLecturers.length === 1 ? 'request' : 'requests'}.
                  <button onClick={() => setShowPendingLecturers(!showPendingLecturers)} className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600">
                    {showPendingLecturers ? 'Hide requests' : 'View requests'}
                  </button>
                </p>}
              {pendingStudents?.length > 0 && <p className="text-sm text-yellow-700">
                  You have {pendingStudents.length} pending student{' '}
                  {pendingStudents.length === 1 ? 'request' : 'requests'}.
                  <button onClick={() => setShowPendingStudents(!showPendingStudents)} className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600">
                    {showPendingStudents ? 'Hide requests' : 'View requests'}
                  </button>
                </p>}
            </div>
          </div>
        </div>}

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {courses.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <UsersIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lecturers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lecturers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UsersIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Lecturer Requests Section */}
      {showPendingLecturers && <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Lecturer Requests
            </h2>
            <button onClick={() => setShowPendingLecturers(false)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Close
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingLecturers.length > 0 ? pendingLecturers.map(lecturer => <div key={lecturer.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {lecturer.name}
                      </h3>
                      <p className="text-sm text-gray-500">{lecturer.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleApproveUser(lecturer.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button onClick={() => handleRejectUser(lecturer.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>) : <div className="px-6 py-4 text-center text-gray-500">
                <p>No pending lecturer requests.</p>
              </div>}
          </div>
        </div>}

      {/* Pending Student Requests Section */}
      {showPendingStudents && <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Student Requests
            </h2>
            <button onClick={() => setShowPendingStudents(false)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Close
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingStudents.length > 0 ? pendingStudents.map(student => <div key={student.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleApproveUser(student.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button onClick={() => handleRejectUser(student.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>) : <div className="px-6 py-4 text-center text-gray-500">
                <p>No pending student requests.</p>
              </div>}
          </div>
        </div>}

      {/* Recent courses */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Courses</h2>
          <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {courses.slice(0, 3).map(course => <div key={course.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {course.description.substring(0, 100)}...
                  </p>
                </div>
                <Link to={`/courses/${course.id}`} className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  View
                </Link>
              </div>
            </div>)}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/courses" className="flex items-center px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
              <PlusCircleIcon className="h-5 w-5 text-indigo-600 mr-3" />
              Create a new course
            </Link>
            {pendingLecturers.length > 0 && <button onClick={() => setShowPendingLecturers(!showPendingLecturers)} className="flex items-center px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 w-full text-left">
                <UsersIcon className="h-5 w-5 text-indigo-600 mr-3" />
                {showPendingLecturers ? 'Hide lecturer requests' : 'Manage lecturer requests'}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  {pendingLecturers.length}
                </span>
              </button>}
            {pendingStudents.length > 0 && <button onClick={() => setShowPendingStudents(!showPendingStudents)} className="flex items-center px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 w-full text-left">
                <UsersIcon className="h-5 w-5 text-indigo-600 mr-3" />
                {showPendingStudents ? 'Hide student requests' : 'Manage student requests'}
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  {pendingStudents.length}
                </span>
              </button>}
            <Link to="/admin/reports" className="flex items-center px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
              <BarChartIcon className="h-5 w-5 text-indigo-600 mr-3" />
              View analytics reports
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>Activity feed will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminDashboard;