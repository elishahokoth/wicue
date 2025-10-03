// import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, UsersIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon, UserPlusIcon, BellIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const LecturerDashboard = () => {
  const {
    currentUser,
    courses,
    users,
    approveEnrollment,
    rejectEnrollment
  } = useAuth();
  // Filter courses taught by the current lecturer
  const lecturerCourses = courses.filter(course => course.instructorId === currentUser?.id);
  // Get all pending enrollment requests for lecturer's courses
  const pendingEnrollmentRequests = lecturerCourses.flatMap(course => {
    const requests = (course.enrollmentRequests || []).map(studentId => {
      const student = users.find(user => user.id === studentId);
      return student ? {
        courseId: course.id,
        courseName: course.title,
        student
      } : null;
    }).filter(Boolean);
    return requests;
  });
  // Count students enrolled in lecturer's courses
  const getStudentCount = () => {
    const uniqueStudentIds = new Set();
    lecturerCourses.forEach(course => {
      ;
      (course.enrolledStudents || []).forEach(studentId => {
        uniqueStudentIds.add(studentId);
      });
    });
    return uniqueStudentIds.size;
  };
  // Handle enrollment approval
  const handleApproveEnrollment = (courseId: string, studentId: string) => {
    approveEnrollment(courseId, studentId);
  };
  // Handle enrollment rejection
  const handleRejectEnrollment = (courseId: string, studentId: string) => {
    rejectEnrollment(courseId, studentId);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}.</p>
      </div>
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lecturerCourses.length}
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
              <p className="text-sm font-medium text-gray-500">My Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {getStudentCount()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BellIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Pending Requests
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingEnrollmentRequests.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Enrollment Requests */}
      {pendingEnrollmentRequests.length > 0 && <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Enrollment Requests
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingEnrollmentRequests.filter(Boolean).map((request: any, index: number) => <div key={`${request.courseId}-${request.student.id}-${index}`} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserPlusIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {request.student.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {request.student.email}
                      </p>
                      <p className="text-xs text-indigo-600 mt-1">
                        Requested to join:{' '}
                        <span className="font-medium">
                          {request.courseName}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleApproveEnrollment(request.courseId, request.student.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button onClick={() => handleRejectEnrollment(request.courseId, request.student.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
      {/* My courses */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">My Courses</h2>
          <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {lecturerCourses.length > 0 ? lecturerCourses.map(course => <div key={course.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {course.title}
                    </h3>
                    <div className="flex text-sm text-gray-500 space-x-4">
                      <span>{course.modules.length} modules</span>
                      <span>
                        {course.enrolledStudents?.length || 0} students
                      </span>
                      {(course.enrollmentRequests?.length || 0) > 0 && <span className="text-yellow-600 font-medium">
                          {course.enrollmentRequests?.length} pending requests
                        </span>}
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`} className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Manage
                  </Link>
                </div>
              </div>) : <div className="px-6 py-4 text-center text-gray-500">
              <p>You haven't created any courses yet.</p>
            </div>}
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
            <Link to="/lecturer/students" className="flex items-center px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
              <UsersIcon className="h-5 w-5 text-indigo-600 mr-3" />
              View my students
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Student Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>Student activity will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default LecturerDashboard;