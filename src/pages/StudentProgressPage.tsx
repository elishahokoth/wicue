// ...existing code...
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, BarChart2Icon, AwardIcon } from 'lucide-react';
import { mockStudentProgress } from '../data/mockData';
const StudentProgressPage = () => {
  const {
    currentUser,
    courses
  } = useAuth();
  // Get enrolled courses for the current student
  const enrolledCourses = courses.filter(course => course.enrolledStudents?.includes(currentUser?.id ?? ''));
  // Get progress data for the student
  const studentProgress = mockStudentProgress.filter(progress => progress.userId === currentUser?.id);
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (studentProgress.length === 0) return 0;
    let completedModules = 0;
    let totalModules = 0;
    studentProgress.forEach(progress => {
      const course = courses.find(c => c.id === progress.courseId);
      if (course) {
        totalModules += course.modules.length;
        Object.values(progress.progress).forEach(moduleProgress => {
          if (moduleProgress.completed) {
            completedModules++;
          }
        });
      }
    });
    return totalModules > 0 ? Math.round(completedModules / totalModules * 100) : 0;
  };
  const overallProgress = calculateOverallProgress();
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600">
          Track your learning progress across all courses
        </p>
      </div>
      {/* Overall progress */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <BarChart2Icon className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            Overall Progress
          </h2>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-5 mr-4">
            <div className="bg-indigo-600 h-5 rounded-full" style={{
            width: `${overallProgress}%`
          }}></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {overallProgress}%
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpenIcon className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Enrolled Courses
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-indigo-700">
              {enrolledCourses.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Completed Modules
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-green-700">
              {studentProgress.reduce((total, progress) => {
              return total + Object.values(progress.progress).filter(m => m.completed).length;
            }, 0)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AwardIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Average Score
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-yellow-700">
              {studentProgress.length > 0 ? Math.round(studentProgress.reduce((total, progress) => {
              const scores = Object.values(progress.progress).filter(m => m.assessmentScore !== null).map(m => m.assessmentScore);
              return total + (scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0);
            }, 0) / studentProgress.length) : 0}
              %
            </p>
          </div>
        </div>
      </div>
      {/* Course progress */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Course Progress</h2>
        </div>
        {enrolledCourses.length > 0 ? <div className="divide-y divide-gray-200">
            {enrolledCourses.map(course => {
          const courseProgress = studentProgress.find(p => p.courseId === course.id);
          const completedModules = courseProgress ? Object.values(courseProgress.progress).filter(m => m.completed).length : 0;
          const progressPercentage = Math.round(completedModules / course.modules.length * 100);
          return <div key={course.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {course.modules.length} modules
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {progressPercentage}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{
                width: `${progressPercentage}%`
              }}></div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {course.modules.map(module => {
                      // Add index signature to satisfy TS
                      const progressObj = courseProgress?.progress as Record<string, any> | undefined;
                      const moduleProgress = progressObj?.[module.id];
                      return <div key={module.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {moduleProgress?.completed ? <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" /> : <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />}
                          <span className="text-sm font-medium text-gray-900">
                            {module.title}
                          </span>
                        </div>
                        {moduleProgress?.assessmentScore !== null && <span className="text-sm text-gray-500">
                          Assessment: {moduleProgress?.assessmentScore}%
                        </span>}
                      </div>;
                    })}
                  </div>
                </div>;
        })}
          </div> : <div className="p-6 text-center">
            <p className="text-gray-500">
              You are not enrolled in any courses yet.
            </p>
          </div>}
      </div>
    </div>;
};
export default StudentProgressPage;