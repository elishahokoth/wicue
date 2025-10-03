import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, ClockIcon, CheckCircleIcon, PlusIcon, PlayIcon, FileTextIcon, TrashIcon, PencilIcon, EyeIcon, EyeOffIcon, UserPlusIcon, UserMinusIcon, UsersIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockStudentProgress } from '../data/mockData';
import CourseForm, { CourseFormData } from '../components/CourseForm';
import { XCircle as XCircleIcon } from 'lucide-react';
const CourseView = () => {
  const {
    courseId
  } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    courses,
    updateCourse,
    deleteCourse,
    requestEnrollment,
    approveEnrollment,
    rejectEnrollment,
    toggleModuleVisibility,
    users
  } = useAuth();
  // Add debug logging
  useEffect(() => {
    console.log('CourseView - Users:', users?.length || 0);
    console.log('CourseView - Course:', courseId);
  }, [users, courseId]);
  const [activeTab, setActiveTab] = useState('modules');
  const [showEditForm, setShowEditForm] = useState(false);
  // Find the course
  const course = courses.find(course => course.id === courseId);
  // Find student progress for this course with proper error handling
  const studentProgress = mockStudentProgress.find(progress => progress.userId === currentUser?.id && progress.courseId === courseId) || null;
  if (!course) {
    return <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <p className="text-gray-600 mt-2">
          The course you're looking for doesn't exist.
        </p>
        <Link to="/courses" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Back to Courses
        </Link>
      </div>;
  }
  // Check if user is the lecturer of this course
  const isLecturer = currentUser?.role === 'lecturer' && course.instructorId === currentUser.id;
  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isLecturer || isAdmin;
  const isStudent = currentUser?.role === 'student';
  // Check if student is enrolled or has a pending request
  const isEnrolled = currentUser?.id ? course.enrolledStudents?.includes(currentUser.id) : false;
  const hasPendingRequest = currentUser?.id ? course.enrollmentRequests?.includes(currentUser.id) : false;
  // Get enrollment requests with user details
  const enrollmentRequests = course && users ? (course.enrollmentRequests || [])
    .map(studentId => users.find(user => user.id === studentId))
    .filter((student): student is typeof users[number] => !!student) : [];
  // Get enrolled students with user details
  const enrolledStudents = course && users ? (course.enrolledStudents || [])
    .map(studentId => users.find(user => user.id === studentId))
    .filter((student): student is typeof users[number] => !!student) : [];
  const handleEditCourse = (formData: CourseFormData) => {
    updateCourse(course.id, {
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      modules: formData.modules.map(module => {
        const base = {
          id: module.id || `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: module.title,
          description: module.description,
          content: module.content
        };
        if ('units' in module && module.units) {
          (base as any).units = module.units;
        }
        if ('media' in module && module.media) {
          (base as any).media = module.media;
        }
        return base;
      })
    });
    setShowEditForm(false);
  };
  const handleDeleteCourse = () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourse(course.id);
      navigate('/courses');
    }
  };
  const handleEnrollmentRequest = () => {
    requestEnrollment(course.id);
  };
  const handleApproveEnrollment = (studentId: string) => {
    approveEnrollment(course.id, studentId);
  };
  const handleRejectEnrollment = (studentId: string) => {
    rejectEnrollment(course.id, studentId);
  };
  const handleToggleModuleVisibility = (moduleId: string) => {
    toggleModuleVisibility(course.id, moduleId);
  };
  return <div className="container mx-auto px-4 py-8">
      {/* Course header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="h-48 md:h-64 overflow-hidden relative">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              {canEdit && <div className="mt-4 flex justify-center space-x-2">
                  <button onClick={() => setShowEditForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Course
                  </button>
                  <button onClick={handleDeleteCourse} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>}
              {isStudent && !isEnrolled && <div className="mt-4 flex justify-center">
                  <button onClick={handleEnrollmentRequest} disabled={hasPendingRequest} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${hasPendingRequest ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    {hasPendingRequest ? 'Enrollment Requested' : 'Request Enrollment'}
                  </button>
                </div>}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <BookOpenIcon className="h-5 w-5 mr-1 text-indigo-600" />
              <span>{course.modules.length} modules</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 mr-1 text-indigo-600" />
              <span>Estimated time: 8 hours</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <UsersIcon className="h-5 w-5 mr-1 text-indigo-600" />
              <span>
                {course.enrolledStudents?.length || 0} students enrolled
              </span>
            </div>
          </div>
          <p className="text-gray-700">{course.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('modules')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'modules' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Modules
          </button>
          {canEdit && <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Students
            </button>}
          <button onClick={() => setActiveTab('about')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'about' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            About
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'modules' && <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
              Course Modules
            </h2>
            {canEdit && <button onClick={() => {
          setShowEditForm(true);
        }} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 bg-indigo-100 dark:bg-blue-900/30 jungle:bg-green-800/30 extra-dark:bg-gray-800/30 darksacramento:bg-green-900/30 hover:bg-indigo-200 dark:hover:bg-blue-800/50 jungle:hover:bg-green-700/50 extra-dark:hover:bg-gray-700/50 darksacramento:hover:bg-green-800/50">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Module
              </button>}
          </div>
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700 darksacramento:divide-green-800">
              {course.modules.map((module, index) => {
            // Get progress for this module with proper null checking
            const moduleProgress = (studentProgress?.progress as { [key: string]: any })?.[module.id] || null;
            const isCompleted = moduleProgress?.completed || false;
            // Check if module is visible to students
            const isVisible = module.isVisible !== false;
            // If student and module is not visible, don't show it
            if (isStudent && !isEnrolled) {
              return null;
            }
            if (isStudent && !isVisible && !isAdmin) {
              return null;
            }
            return <li key={module.id}>
                    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50 darksacramento:hover:bg-green-900/50 ${!isVisible ? 'bg-gray-100 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 darksacramento:bg-green-900/20' : ''}`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          {isCompleted ? <CheckCircleIcon className="h-6 w-6 text-green-500" /> : <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-blue-600 jungle:border-green-600 extra-dark:border-gray-600 darksacramento:border-green-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400">
                                {index + 1}
                              </span>
                            </div>}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
                              {module.title}
                              {!isVisible && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 jungle:bg-green-700 extra-dark:bg-gray-700 darksacramento:bg-green-700 text-gray-800 dark:text-gray-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                                  Hidden
                                </span>}
                            </h3>
                            {module.assessment && <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 jungle:bg-yellow-800/30 extra-dark:bg-yellow-900/30 darksacramento:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 jungle:text-yellow-300 extra-dark:text-yellow-300 darksacramento:text-yellow-300">
                                Has Assessment
                              </span>}
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                            {module.description}
                          </p>
                          <div className="mt-3 flex items-center space-x-2">
                            {(isVisible || canEdit || isAdmin) && <Link to={`/courses/${courseId}/modules/${module.id}`} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 bg-indigo-100 dark:bg-blue-900/30 jungle:bg-green-800/30 extra-dark:bg-gray-800/30 darksacramento:bg-green-900/30 hover:bg-indigo-200 dark:hover:bg-blue-800/50 jungle:hover:bg-green-700/50 extra-dark:hover:bg-gray-700/50 darksacramento:hover:bg-green-800/50">
                                <PlayIcon className="h-4 w-4 mr-1" />
                                {isCompleted ? 'Review' : 'Start'}
                              </Link>}
                            {module.assessment && (isVisible || canEdit || isAdmin) && <Link to={`/courses/${courseId}/modules/${module.id}/assessment`} className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${moduleProgress?.assessmentScore !== null && moduleProgress?.assessmentScore !== undefined ? 'text-green-700 dark:text-green-400 jungle:text-green-400 extra-dark:text-green-400 darksacramento:text-green-400 bg-green-100 dark:bg-green-900/30 jungle:bg-green-800/30 extra-dark:bg-green-900/30 darksacramento:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50 jungle:hover:bg-green-700/50 extra-dark:hover:bg-green-800/50 darksacramento:hover:bg-green-700/50' : 'text-yellow-700 dark:text-yellow-400 jungle:text-yellow-400 extra-dark:text-yellow-400 darksacramento:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 jungle:bg-yellow-800/30 extra-dark:bg-yellow-900/30 darksacramento:bg-yellow-800/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 jungle:hover:bg-yellow-700/50 extra-dark:hover:bg-yellow-800/50 darksacramento:hover:bg-yellow-700/50'}`}>
                                  <FileTextIcon className="h-4 w-4 mr-1" />
                                  {moduleProgress?.assessmentScore !== null && moduleProgress?.assessmentScore !== undefined ? `Assessment (${moduleProgress.assessmentScore}%)` : 'Take Assessment'}
                                </Link>}
                            {canEdit && <>
                                <button onClick={() => setShowEditForm(true)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-400 jungle:text-blue-400 extra-dark:text-blue-400 darksacramento:text-blue-400 bg-blue-100 dark:bg-blue-900/30 jungle:bg-blue-800/30 extra-dark:bg-blue-900/30 darksacramento:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 jungle:hover:bg-blue-700/50 extra-dark:hover:bg-blue-800/50 darksacramento:hover:bg-blue-800/50">
                                  <PencilIcon className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                                <button onClick={() => handleToggleModuleVisibility(module.id)} className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${isVisible ? 'text-gray-700 dark:text-gray-400 jungle:text-gray-400 extra-dark:text-gray-400 darksacramento:text-gray-400 bg-gray-100 dark:bg-gray-800/30 jungle:bg-gray-700/30 extra-dark:bg-gray-800/30 darksacramento:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 jungle:hover:bg-gray-600/50 extra-dark:hover:bg-gray-700/50 darksacramento:hover:bg-gray-700/50' : 'text-green-700 dark:text-green-400 jungle:text-green-400 extra-dark:text-green-400 darksacramento:text-green-400 bg-green-100 dark:bg-green-900/30 jungle:bg-green-800/30 extra-dark:bg-green-900/30 darksacramento:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50 jungle:hover:bg-green-700/50 extra-dark:hover:bg-green-800/50 darksacramento:hover:bg-green-700/50'}`}>
                                  {isVisible ? <>
                                      <EyeOffIcon className="h-4 w-4 mr-1" />
                                      Hide
                                    </> : <>
                                      <EyeIcon className="h-4 w-4 mr-1" />
                                      Show
                                    </>}
                                </button>
                              </>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>;
          })}
            </ul>
          </div>
        </div>}

      {activeTab === 'students' && canEdit && <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Student Management
          </h2>
          {/* Enrollment Requests */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Enrollment Requests{' '}
                {enrollmentRequests.length > 0 && <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {enrollmentRequests.length} pending
                  </span>}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {enrollmentRequests.length > 0 ? enrollmentRequests.map(student => student && <div key={student.id} className="px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {student?.name}
                        </h4>
                        <p className="text-sm text-gray-500">{student?.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleApproveEnrollment(student?.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button onClick={() => handleRejectEnrollment(student?.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>) : <div className="px-6 py-4 text-center text-gray-500">
                  <p>No pending enrollment requests.</p>
                </div>}
            </div>
          </div>
          {/* Enrolled Students */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Enrolled Students
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {enrolledStudents.length > 0 ? enrolledStudents.map(student => student && <div key={student.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {student?.name}
                        </h4>
                        <p className="text-sm text-gray-500">{student?.email}</p>
                      </div>
                      <button onClick={() => handleRejectEnrollment(student?.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                        <UserMinusIcon className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>) : <div className="px-6 py-4 text-center text-gray-500">
                  <p>No students enrolled yet.</p>
                </div>}
            </div>
          </div>
        </div>}

      {activeTab === 'about' && <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About This Course
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="prose max-w-none">
              <p>{course.description}</p>
              <h3>What You'll Learn</h3>
              <ul>
                <li>Understanding core concepts and principles</li>
                <li>Practical application of knowledge</li>
                <li>Advanced techniques and methodologies</li>
                <li>Real-world problem solving</li>
              </ul>
              <h3>Prerequisites</h3>
              <p>
                No prior knowledge required. This course is designed for
                beginners.
              </p>
              {isStudent && !isEnrolled && !hasPendingRequest && <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">
                    Interested in this course?
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Request enrollment to access all course materials and
                    assessments.
                  </p>
                  <button onClick={handleEnrollmentRequest} className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Request Enrollment
                  </button>
                </div>}
              {isStudent && hasPendingRequest && <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Enrollment Pending
                  </h3>
                  <p className="mt-1 text-yellow-700">
                    Your enrollment request is pending approval from the
                    lecturer.
                  </p>
                </div>}
            </div>
          </div>
        </div>}

      {/* Edit Course Form Modal */}
      {showEditForm && <CourseForm initialData={{
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      modules: course.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        content: module.content,
        units: 'units' in module && Array.isArray(module.units) ? module.units : []
      }))
    }} onSubmit={handleEditCourse} onCancel={() => setShowEditForm(false)} isEdit={true} />}
    </div>;
};
export default CourseView;