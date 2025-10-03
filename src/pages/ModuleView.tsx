
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon, PlayIcon, BookOpenIcon, LockIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const ModuleView = () => {
  const {
    courseId,
    moduleId
  } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    courses
  } = useAuth();
  // Find the course and module
  const course = courses.find(course => course.id === courseId);
  const moduleIndex = course && course.modules ? course.modules.findIndex(module => module.id === moduleId) : -1;
  const module = course && course.modules && moduleIndex !== -1 ? course.modules[moduleIndex] : null;
  // Get previous and next modules
  const prevModule = course && course.modules && moduleIndex > 0 ? course.modules[moduleIndex - 1] : null;
  const nextModule = course && course.modules && moduleIndex !== -1 && moduleIndex < course.modules.length - 1 ? course.modules[moduleIndex + 1] : null;
  if (!course || !module) {
    return <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Module not found</h1>
        <p className="text-gray-600 mt-2">
          The module you're looking for doesn't exist.
        </p>
        <Link to={`/courses/${courseId}`} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Back to Course
        </Link>
      </div>;
  }
  // Check if user is the lecturer of this course
  const isLecturer = currentUser?.role === 'lecturer' && course.instructorId === currentUser.id;
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';
  const canEdit = isLecturer || isAdmin;
  // Check if student is enrolled
  const isEnrolled = course.enrolledStudents?.includes(currentUser?.id ?? '');
  // Check if module is visible to students
  const isVisible = module.isVisible !== false;
  // If student is not enrolled or module is not visible, redirect back to course
  if (isStudent && (!isEnrolled || !isVisible) && !isAdmin) {
    navigate(`/courses/${courseId}`);
    return null;
  }
  return <div className="container mx-auto px-4 py-8">
      {/* Module navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to={`/courses/${courseId}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Course
        </Link>
        <div className="flex space-x-4">
          {prevModule && <Link to={`/courses/${courseId}/modules/${prevModule.id}`} className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Link>}
          {nextModule && <Link to={`/courses/${courseId}/modules/${nextModule.id}`} className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>}
        </div>
      </div>

      {/* Module header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
        <p className="mt-2 text-gray-600">{module.description}</p>
        {module.assessment && <div className="mt-4">
            <Link to={`/courses/${courseId}/modules/${moduleId}/assessment`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FileTextIcon className="h-5 w-5 mr-2" />
              Take Assessment
            </Link>
          </div>}
        {!isVisible && canEdit && <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <LockIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This module is currently hidden from students. Only lecturers
                  and admins can view it.
                </p>
              </div>
            </div>
          </div>}
      </div>

      {/* Module content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Module Content
              </h2>
              {/* Video section */}
              <div className="mb-8">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <PlayIcon className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">
                      Video content would appear here
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Video Lecture
                </h3>
                <p className="text-sm text-gray-500">
                  Watch the lecture to learn about {module.title}
                </p>
              </div>
              {/* Text content */}
              <div className="prose max-w-none">
                <h3>Introduction</h3>
                <p>{module.content}</p>
                <h3>Key Concepts</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  auctor, nisl eget ultricies lacinia, nisl nisl aliquam nisl,
                  eget aliquam nisl nisl eget nisl.
                </p>
                <ul>
                  <li>First key concept explanation</li>
                  <li>Second key concept with examples</li>
                  <li>Third important point to remember</li>
                </ul>
                <h3>Practical Examples</h3>
                <p>
                  Let's look at some practical examples of how to apply these
                  concepts:
                </p>
                <pre>
                  <code>
                    {`
// Example code would appear here
// Example code would appear here
function example() {
  return "This is an example";
}`}
                  </code>
                </pre>
                <h3>Summary</h3>
                <p>
                  In this module, we've covered the fundamental concepts of{' '}
                  {module.title}. Remember to complete the assessment to test
                  your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Module Resources
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Reading Materials
                    </h3>
                    <p className="text-xs text-gray-500">
                      Supplementary reading to enhance your learning
                    </p>
                    <div className="mt-1">
                      {isAdmin ? <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">
                          Download PDF
                        </a> : <p className="text-xs text-gray-500">
                          Downloads available for administrators only
                        </p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileTextIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Practice Exercises
                    </h3>
                    <p className="text-xs text-gray-500">
                      Try these exercises to test your understanding
                    </p>
                    <div className="mt-1">
                      <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">
                        View Exercises
                      </a>
                      {isAdmin && <a href="#" className="ml-3 text-xs text-indigo-600 hover:text-indigo-500">
                          Download Exercises
                        </a>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">
                  Module Progress
                </h3>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Content viewed</span>
                    <span className="font-medium text-gray-900">
                      In progress
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{
                    width: '60%'
                  }}></div>
                  </div>
                </div>
                <button className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ModuleView;