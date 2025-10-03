import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, CheckCircleIcon, LockIcon, TrophyIcon, MapIcon, ArrowRightIcon, BarChart2Icon, ClockIcon, StarIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCourses, mockStudentProgress } from '../data/mockData';
const LearningPath = () => {
  const {
    currentUser
  } = useAuth();
  const [recommendedPath, setRecommendedPath] = useState<any[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skillGaps, setSkillGaps] = useState<{ skill: string; priority: string; courses: string[] }[]>([]);
  const [selectedView, setSelectedView] = useState<'path' | 'timeline' | 'skills'>('path');
  useEffect(() => {
    // Simulate API call to get learning path data
    const fetchLearningPathData = () => {
      setLoading(true);
      // Get progress data for the current student
      const studentProgress = mockStudentProgress.filter(progress => progress.userId === currentUser?.id);
      // Get enrolled courses with progress information
      const enrolledCoursesWithProgress = studentProgress.map(progress => {
        const course = mockCourses.find(course => course.id === progress.courseId);
        if (!course) return null;
        // Calculate completion percentage
        const totalModules = course.modules.length;
        const completedModuleCount = Object.values(progress.progress).filter(moduleProgress => moduleProgress.completed).length;
        const completionPercentage = Math.round(completedModuleCount / totalModules * 100);
        return {
          ...course,
          progress: progress.progress,
          completionPercentage,
          completedModules: completedModuleCount,
          totalModules
        };
      }).filter(Boolean);
      // Separate completed and in-progress courses
  const completed = enrolledCoursesWithProgress.filter((course: any) => course && course.completionPercentage === 100);
  const inProgress = enrolledCoursesWithProgress.filter((course: any) => course && course.completionPercentage < 100);
  setCompletedCourses(completed);
  setInProgressCourses(inProgress);
      // Generate recommended path based on completed courses and student interests
      // In a real app, this would use an algorithm or ML model
      const allCompletedCourseIds = completed.map((course: any) => course.id);
      const recommended = mockCourses.filter(course => !allCompletedCourseIds.includes(course.id) && !inProgress.some((c: any) => c && c.id === course.id)).slice(0, 5).map((course, index) => ({
        ...course,
        recommendationScore: 95 - index * 5,
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'].slice(0, 3 + index % 3)
      }));
      setRecommendedPath(recommended);
      // Identify skill gaps based on completed courses and career goals
      setSkillGaps([
        {
          skill: 'Advanced React',
          priority: 'High',
          courses: ['Advanced React Patterns', 'React Performance']
        },
        {
          skill: 'State Management',
          priority: 'Medium',
          courses: ['Redux Fundamentals', 'Context API Mastery']
        },
        {
          skill: 'Testing',
          priority: 'Medium',
          courses: ['Jest and RTL', 'Cypress E2E Testing']
        },
        {
          skill: 'Backend Development',
          priority: 'Low',
          courses: ['Node.js Fundamentals', 'RESTful API Design']
        }
      ]);
      setLoading(false);
    };
    fetchLearningPathData();
  }, [currentUser?.id]);
  const renderPathView = () => <div className="space-y-8">
      {/* Learning path visualization */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          <MapIcon className="mr-2 h-5 w-5 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
          Your Learning Journey
        </h2>
        <div className="relative">
          {/* Path visualization */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-indigo-200 dark:bg-blue-800 jungle:bg-green-800 extra-dark:bg-gray-700 ml-5"></div>
          <div className="space-y-8">
            {/* Completed courses */}
            {completedCourses.length > 0 && <div className="ml-0 md:ml-11 relative">
                <div className="hidden md:flex absolute -left-11 top-3 items-center justify-center w-6 h-6 rounded-full bg-green-500 dark:bg-green-600 z-10">
                  <CheckCircleIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
                  Completed Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedCourses.map(course => <div key={course.id} className="flex p-3 rounded-lg bg-green-50 dark:bg-green-900/20 jungle:bg-green-800/20 extra-dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-3">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          {course.title}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span>Completed</span>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
            {/* In progress courses */}
            {inProgressCourses.length > 0 && <div className="ml-0 md:ml-11 relative">
                <div className="hidden md:flex absolute -left-11 top-3 items-center justify-center w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-600 z-10">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
                  In Progress
                </h3>
                <div className="space-y-4">
                  {inProgressCourses.map(course => <div key={course.id} className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 jungle:bg-yellow-800/20 extra-dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-14 w-14 rounded-md overflow-hidden mr-4">
                          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {course.title}
                          </h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>
                              {course.completedModules} of {course.totalModules}{' '}
                              modules completed
                            </span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{
                        width: `${course.completionPercentage}%`
                      }}></div>
                          </div>
                        </div>
                        <Link to={`/courses/${course.id}`} className="ml-2 flex-shrink-0 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-sky-300 bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-indigo-200 dark:hover:bg-blue-800">
                          Continue
                        </Link>
                      </div>
                      {/* Next up modules */}
                      <div className="mt-3 pl-4 border-l-2 border-yellow-200 dark:border-yellow-800">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-2">
                          Next up:
                        </h5>
                        <ul className="space-y-1">
                          {course.modules.filter((_module: any, idx: number) => idx >= course.completedModules && idx < course.completedModules + 2).map((module: any) => <li key={module.id} className="flex items-center text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                <ArrowRightIcon className="h-3 w-3 mr-1 text-yellow-500" />
                                {module.title}
                              </li>)}
                        </ul>
                      </div>
                    </div>)}
                </div>
              </div>}
            {/* Recommended next steps */}
            <div className="ml-0 md:ml-11 relative">
              <div className="hidden md:flex absolute -left-11 top-3 items-center justify-center w-6 h-6 rounded-full bg-indigo-500 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-sky-600 z-10">
                <MapIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
                Recommended Next Steps
              </h3>
              <div className="space-y-4">
                {recommendedPath.map((course: any) => <div key={course.id} className="p-4 rounded-lg bg-indigo-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-sky-900/20 border border-indigo-200 dark:border-blue-800 transition-all hover:shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-14 w-14 rounded-md overflow-hidden mr-4">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {course.title}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-blue-800 text-indigo-800 dark:text-blue-200">
                            {course.recommendationScore}% match
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 line-clamp-2">
                          {course.description}
                        </p>
                        {/* Required skills */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {course.requiredSkills.map((skill: string) => <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {skill}
                            </span>)}
                        </div>
                      </div>
                      <Link to={`/courses/${course.id}`} className="ml-2 flex-shrink-0 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700">
                        Enroll
                      </Link>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Learning goal */}
            <div className="ml-0 md:ml-11 relative">
              <div className="hidden md:flex absolute -left-11 top-3 items-center justify-center w-6 h-6 rounded-full bg-purple-500 dark:bg-purple-600 z-10">
                <TrophyIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
                Your Learning Goal
              </h3>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 jungle:bg-purple-900/20 extra-dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                      Full Stack Web Developer
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Estimated completion:{' '}
                      {new Date(Date.now() + 7776000000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {completedCourses.length > 0 ? Math.round(completedCourses.length / (completedCourses.length + inProgressCourses.length + recommendedPath.length) * 100) : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Overall progress
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  const renderTimelineView = () => <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
        <ClockIcon className="mr-2 h-5 w-5 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
        Learning Timeline
      </h2>
      <div className="relative">
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 ml-7"></div>
        <div className="space-y-6">
          {/* Future courses */}
          {recommendedPath.slice(0, 2).map((course, index) => <div key={course.id} className="flex">
              <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4 z-10">
                <LockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {course.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Estimated:{' '}
                    {new Date(Date.now() + 2592000000 * (index + 1)).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {course.description.substring(0, 120)}...
                </p>
              </div>
            </div>)}
          {/* Current courses */}
          {inProgressCourses.map(course => <div key={course.id} className="flex">
              <div className="flex-shrink-0 h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4 z-10">
                <BookOpenIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                    {course.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    In progress ({course.completionPercentage}%)
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  {course.description.substring(0, 120)}...
                </p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{
                width: `${course.completionPercentage}%`
              }}></div>
                </div>
              </div>
            </div>)}
          {/* Completed courses */}
          {completedCourses.map(course => <div key={course.id} className="flex">
              <div className="flex-shrink-0 h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4 z-10">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                    {course.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Completed on{' '}
                    {new Date(Date.now() - 2592000000 * (completedCourses.length - completedCourses.indexOf(course))).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  {course.description.substring(0, 120)}...
                </p>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill={star <= 4 ? 'currentColor' : 'none'} />)}
                  </div>
                  <span className="ml-2 text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Your rating
                  </span>
                </div>
              </div>
            </div>)}
          {/* Starting point */}
          <div className="flex">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-indigo-100 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-sky-900/30 flex items-center justify-center mr-4 z-10">
              <MapIcon className="h-6 w-6 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
            </div>
            <div className="flex-1 pt-1.5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Started Learning Journey
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                You began your learning journey with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
  const renderSkillsView = () => <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
        <BarChart2Icon className="mr-2 h-5 w-5 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
        Skills Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills acquired */}
        <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-4 rounded-lg border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
            Skills Acquired
          </h3>
          <div className="space-y-3">
            {[{
            name: 'HTML',
            level: 90
          }, {
            name: 'CSS',
            level: 85
          }, {
            name: 'JavaScript',
            level: 75
          }, {
            name: 'React Fundamentals',
            level: 70
          }, {
            name: 'Responsive Design',
            level: 80
          }].map(skill => <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {skill.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{
                width: `${skill.level}%`
              }}></div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Skill gaps */}
        <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-4 rounded-lg border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
            Recommended Skills to Develop
          </h3>
          <div className="space-y-4">
            {skillGaps.map(skill => <div key={skill.skill} className="border-l-4 border-yellow-500 pl-3 py-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {skill.skill}
                  </h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${skill.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                    {skill.priority} priority
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mt-1">
                  Recommended courses: {skill.courses.join(', ')}
                </p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Career path alignment */}
      <div className="mt-6 bg-indigo-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-sky-900/20 p-4 rounded-lg border border-indigo-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-sky-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-3">
          Career Path Alignment
        </h3>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h4 className="text-base font-medium text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
              Full Stack Web Developer
            </h4>
            <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mt-1">
              Your current skills are 65% aligned with this career path.
              Continue focusing on React, State Management, and Backend
              technologies to improve alignment.
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <path d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="65, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400">
                65%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          Learning Path
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Your personalized learning journey based on your progress and goals
        </p>
      </div>
      {loading ? <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div> : <>
          {/* View selector */}
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-2 mb-6">
            <div className="flex">
              <button onClick={() => setSelectedView('path')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${selectedView === 'path' ? 'bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300'}`}>
                <MapIcon className="inline-block h-4 w-4 mr-1" />
                Learning Path
              </button>
              <button onClick={() => setSelectedView('timeline')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${selectedView === 'timeline' ? 'bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300'}`}>
                <ClockIcon className="inline-block h-4 w-4 mr-1" />
                Timeline
              </button>
              <button onClick={() => setSelectedView('skills')} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${selectedView === 'skills' ? 'bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200' : 'text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300'}`}>
                <BarChart2Icon className="inline-block h-4 w-4 mr-1" />
                Skills
              </button>
            </div>
          </div>
          {/* Selected view content */}
          {selectedView === 'path' && renderPathView()}
          {selectedView === 'timeline' && renderTimelineView()}
          {selectedView === 'skills' && renderSkillsView()}
          {/* Learning tips */}
          <div className="mt-8 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <AlertCircleIcon className="h-5 w-5 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  Learning Tip
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  Studies show that regular practice in shorter sessions is more
                  effective than cramming. Try to dedicate at least 30 minutes
                  daily to your courses for optimal learning.
                </p>
              </div>
            </div>
          </div>
        </>}
    </div>;
};
export default LearningPath;