import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, SearchIcon, MailIcon, BookOpenIcon, ShieldIcon, UserXIcon, UserCheckIcon } from 'lucide-react';
type UsersPageProps = {
  userRole: 'admin' | 'lecturer' | 'student';
};
const UsersPage = ({
  userRole
}: UsersPageProps) => {
  const {
    users,
    courses,
    currentUser,
    restrictUser,
    removeRestriction,
    isUserRestricted
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  // Get filtered users based on role and search term
  const getFilteredUsers = () => {
    let filteredUsers = [];
    if (userRole === 'admin') {
      // Admin can see all users
      filteredUsers = users;
    } else if (userRole === 'lecturer') {
      // Lecturer can see students enrolled in their courses
      const lecturerCourses = courses.filter(course => course.instructorId === currentUser?.id);
      const enrolledStudentIds = new Set();
      lecturerCourses.forEach(course => {
        ;
        (course.enrolledStudents || []).forEach(studentId => {
          enrolledStudentIds.add(studentId);
        });
      });
      filteredUsers = users.filter(user => user.role === 'student' && enrolledStudentIds.has(user.id));
    } else {
      // Students can see other students but limited info
      filteredUsers = users.filter(user => user.role === 'student');
    }
    // Apply search filter
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filteredUsers;
  };
  const filteredUsers = getFilteredUsers();
  // Get title based on user role
  const getTitle = () => {
    if (userRole === 'admin') return 'All Users';
    if (userRole === 'lecturer') return 'My Students';
    return 'Other Students';
  };
  // Count users by role for admin view
  const getUserCounts = () => {
    const admins = users.filter(user => user.role === 'admin').length;
    const lecturers = users.filter(user => user.role === 'lecturer' && user.status === 'active').length;
    const students = users.filter(user => user.role === 'student' && user.status === 'active').length;
    const pending = users.filter(user => user.status === 'pending').length;
    return {
      admins,
      lecturers,
      students,
      pending
    };
  };
  const userCounts = getUserCounts();
  // Restrict or unrestrict a single user
  const toggleUserRestriction = (userId: string) => {
    if (isUserRestricted(userId)) {
      removeRestriction(userId);
    } else {
      restrictUser(userId);
    }
  };
  // Restrict all users of a specific role
  const restrictAllByRole = (role: string) => {
    const usersToRestrict = users.filter(user => user.role === role);
    usersToRestrict.forEach(user => {
      if (!isUserRestricted(user.id)) {
        restrictUser(user.id);
      }
    });
  };
  // Remove restriction from all users of a specific role
  const removeRestrictionAllByRole = (role: string) => {
    const usersToUnrestrict = users.filter(user => user.role === role);
    usersToUnrestrict.forEach(user => {
      if (isUserRestricted(user.id)) {
        removeRestriction(user.id);
      }
    });
  };
  // For lecturers: restrict all their students
  const restrictAllMyStudents = () => {
    const lecturerCourses = courses.filter(course => course.instructorId === currentUser?.id);
    const enrolledStudentIds = new Set();
    lecturerCourses.forEach(course => {
      ;
      (course.enrolledStudents || []).forEach(studentId => {
        enrolledStudentIds.add(studentId);
      });
    });
    Array.from(enrolledStudentIds).forEach(studentId => {
      const id = String(studentId);
      if (!isUserRestricted(id)) {
        restrictUser(id);
      }
    });
  };
  // For lecturers: remove restriction from all their students
  const removeRestrictionAllMyStudents = () => {
    const lecturerCourses = courses.filter(course => course.instructorId === currentUser?.id);
    const enrolledStudentIds = new Set();
    lecturerCourses.forEach(course => {
      ;
      (course.enrolledStudents || []).forEach(studentId => {
        enrolledStudentIds.add(studentId);
      });
    });
    Array.from(enrolledStudentIds).forEach(studentId => {
      const id = String(studentId);
      if (isUserRestricted(id)) {
        removeRestriction(id);
      }
    });
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <p className="text-gray-600">
          {userRole === 'admin' ? 'Manage all users in the system' : userRole === 'lecturer' ? 'View and manage your students' : 'View other students in the system'}
        </p>
      </div>

      {/* Stats for admin */}
      {userRole === 'admin' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <UserIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userCounts.admins}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <UserIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lecturers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userCounts.lecturers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <UserIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userCounts.students}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <UserIcon className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userCounts.pending}
                </p>
              </div>
            </div>
          </div>
        </div>}

      {/* Search and bulk actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          {(userRole === 'admin' || userRole === 'lecturer') && <div className="flex items-center">
              <button onClick={() => setShowBulkActions(!showBulkActions)} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <ShieldIcon className="h-5 w-5 mr-2 text-gray-500" />
                {showBulkActions ? 'Hide Bulk Actions' : 'Bulk Access Control'}
              </button>
            </div>}
        </div>

        {/* Bulk actions section */}
        {showBulkActions && <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Bulk Access Control
            </h3>
            <div className="flex flex-wrap gap-2">
              {userRole === 'admin' && <>
                  <button onClick={() => restrictAllByRole('lecturer')} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                    <UserXIcon className="h-4 w-4 mr-1" />
                    Restrict All Lecturers
                  </button>
                  <button onClick={() => removeRestrictionAllByRole('lecturer')} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
                    <UserCheckIcon className="h-4 w-4 mr-1" />
                    Enable All Lecturers
                  </button>
                </>}
              {(userRole === 'admin' || userRole === 'lecturer') && <>
                  <button onClick={() => userRole === 'admin' ? restrictAllByRole('student') : restrictAllMyStudents()} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                    <UserXIcon className="h-4 w-4 mr-1" />
                    Restrict All {userRole === 'lecturer' ? 'My ' : ''}Students
                  </button>
                  <button onClick={() => userRole === 'admin' ? removeRestrictionAllByRole('student') : removeRestrictionAllMyStudents()} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
                    <UserCheckIcon className="h-4 w-4 mr-1" />
                    Enable All {userRole === 'lecturer' ? 'My ' : ''}Students
                  </button>
                </>}
            </div>
          </div>}
      </div>

      {/* Users list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.length > 0 ? filteredUsers.map(user => <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-indigo-600">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MailIcon className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {userRole === 'admin' ? <div className="flex flex-col items-end">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                            {user.role}
                          </span>
                          {user.status && <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} capitalize`}>
                              {user.status}
                            </span>}
                        </div> : userRole === 'lecturer' ? <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          View Progress
                        </button> : null}
                      {/* Access control buttons for admin and lecturer */}
                      {(userRole === 'admin' || userRole === 'lecturer' && user.role === 'student') && (isUserRestricted(user.id) ? <button onClick={() => toggleUserRestriction(user.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
                            <UserCheckIcon className="h-4 w-4 mr-1" />
                            Enable Access
                          </button> : <button onClick={() => toggleUserRestriction(user.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                            <UserXIcon className="h-4 w-4 mr-1" />
                            Restrict Access
                          </button>)}
                    </div>
                  </div>
                </div>
              </li>) : <li className="px-4 py-6 text-center text-gray-500">
              <p>No users found</p>
            </li>}
        </ul>
      </div>
    </div>;
};
export default UsersPage;