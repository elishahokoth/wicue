// ...existing code...
import { Link } from 'react-router-dom';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, BarChartIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockCourses, mockStudentProgress } from '../data/mockData';
const StudentDashboard = () => {
  const {
    currentUser
  } = useAuth();
  // Get progress data for the current student
  const studentProgress = mockStudentProgress.filter(progress => progress.userId === currentUser?.id);
  // Get enrolled courses
  const enrolledCourses = studentProgress.map(progress => {
    const course = mockCourses.find(course => course.id === progress.courseId);
    return {
      ...course,
      progress: progress.progress
    };
  });
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (enrolledCourses.length === 0) return 0;
    let completedModules = 0;
    let totalModules = 0;
    enrolledCourses.forEach(course => {
      if (!course) return;
      const courseModules = course.modules;
      if (courseModules) {
        totalModules += courseModules.length;
        Object.values(course.progress).forEach(moduleProgress => {
          if (moduleProgress.completed) {
            completedModules += 1;
          }
        });
      }
    });
    return totalModules > 0 ? Math.round(completedModules / totalModules * 100) : 0;
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}.</p>
      </div>
      {/* Progress overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-medium text-gray-900">
              Your Learning Progress
            </h2>
            <p className="text-sm text-gray-500">
              Keep going! You're making great progress.
            </p>
          </div>
          <div className="flex items-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4F46E5" strokeWidth="3" strokeDasharray={`${calculateOverallProgress()}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-indigo-600">
                {calculateOverallProgress()}%
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {calculateOverallProgress()}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* My courses */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">My Courses</h2>
          <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Browse courses
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {enrolledCourses.length > 0 ? enrolledCourses.map(course => {
          if (!course) return null;
          // Calculate course progress
          const totalModules = course.modules ? course.modules.length : 0;
          const completedModules = Object.values(course.progress).filter(moduleProgress => moduleProgress.completed).length;
          const progressPercentage = Math.round(completedModules / totalModules * 100);
          return <div key={course.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                      <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {course.title}
                      </h3>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{
                    width: `${progressPercentage}%`
                  }}></div>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span>{progressPercentage}% complete</span>
                        <span className="mx-2">•</span>
                        <span>
                          {completedModules}/{totalModules} modules
                        </span>
                      </div>
                    </div>
                    <Link to={`/courses/${course.id}`} className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                      Continue
                    </Link>
                  </div>
                </div>;
        }) : <div className="px-6 py-8 text-center">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No courses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't enrolled in any courses yet.
              </p>
              <div className="mt-6">
                <Link to="/courses" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Browse Courses
                </Link>
              </div>
            </div>}
        </div>
      </div>
      {/* Recommended & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recommended For You
            </h2>
          </div>
          <div className="p-6">
            {mockCourses.slice(0, 2).map(course => <div key={course.id} className="flex items-center mb-4 last:mb-0">
                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {course.modules.length} modules
                  </p>
                </div>
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Completed "HTML Fundamentals" module
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <BarChartIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Scored 85% on "HTML Basics Quiz"
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Started "CSS Styling" module
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default StudentDashboard;