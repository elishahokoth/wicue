import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart2Icon, SearchIcon, BookOpenIcon, CheckCircleIcon, UserIcon, ArrowUpIcon, ArrowDownIcon, FilterIcon } from 'lucide-react';
import { mockStudentProgress } from '../data/mockData';
interface StudentProgressTrackerProps {
  userRole: 'admin' | 'lecturer';
}
const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({
  userRole
}) => {
  const {
    users,
    courses,
    currentUser
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [courseFilter, setCourseFilter] = useState('all');
  // Get students based on role
  const getStudents = () => {
    if (userRole === 'admin') {
      // Admin can see all students
      return users.filter(user => user.role === 'student' && user.status === 'active');
    } else {
      // Lecturer can see students enrolled in their courses
      const lecturerCourses = courses.filter(course => course.instructorId === currentUser?.id);
      const enrolledStudentIds = new Set();
      lecturerCourses.forEach(course => {
        ;
        (course.enrolledStudents || []).forEach(studentId => {
          enrolledStudentIds.add(studentId);
        });
      });
      return users.filter(user => user.role === 'student' && user.status === 'active' && enrolledStudentIds.has(user.id));
    }
  };
  const students = getStudents();
  // Get student progress data
  const getStudentProgressData = () => {
    return students.map(student => {
      // Get all progress records for this student
      const progressRecords = mockStudentProgress.filter(progress => progress.userId === student.id);
      // Calculate overall progress
      let totalModules = 0;
      let completedModules = 0;
      let totalScore = 0;
      let assessmentCount = 0;
      progressRecords.forEach(record => {
        const course = courses.find(c => c.id === record.courseId);
        if (course) {
          totalModules += course.modules.length;
          Object.values(record.progress).forEach(moduleProgress => {
            if (moduleProgress.completed) {
              completedModules++;
            }
            if (moduleProgress.assessmentScore !== null) {
              totalScore += moduleProgress.assessmentScore;
              assessmentCount++;
            }
          });
        }
      });
      const overallProgress = totalModules > 0 ? Math.round(completedModules / totalModules * 100) : 0;
      const averageScore = assessmentCount > 0 ? Math.round(totalScore / assessmentCount) : 0;
      // Get enrolled courses
      const enrolledCourses = progressRecords.map(record => {
        const course = courses.find(c => c.id === record.courseId);
        if (!course) return null;
        const courseModules = course.modules.length;
        const completedCourseModules = Object.values(record.progress).filter(m => m.completed).length;
        const courseProgress = courseModules > 0 ? Math.round(completedCourseModules / courseModules * 100) : 0;
        return {
          id: course.id,
          title: course.title,
          progress: courseProgress,
          modules: {
            total: courseModules,
            completed: completedCourseModules
          }
        };
      }).filter(Boolean);
      return {
        ...student,
        progress: {
          overall: overallProgress,
          averageScore,
          enrolledCourses
        }
      };
    });
  };
  const studentProgressData = getStudentProgressData();
  // Filter students
  const filterStudents = () => {
    return studentProgressData.filter(student => {
      // Apply search filter
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
      // Apply course filter
  const matchesCourse = courseFilter === 'all' || student.progress.enrolledCourses.some((course: any) => course && course.id === courseFilter);
      return matchesSearch && matchesCourse;
    });
  };
  // Sort students
  const sortStudents = (students: any[]) => {
    return [...students].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'progress':
          comparison = a.progress.overall - b.progress.overall;
          break;
        case 'score':
          comparison = a.progress.averageScore - b.progress.averageScore;
          break;
        case 'courses':
          comparison = a.progress.enrolledCourses.length - b.progress.enrolledCourses.length;
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  const filteredAndSortedStudents = sortStudents(filterStudents());
  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100">
          Student Progress Tracker
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300">
          {userRole === 'admin' ? 'Monitor the progress of all students across the platform' : 'Monitor the progress of students in your courses'}
        </p>
      </div>
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 text-indigo-600 dark:text-blue-300 jungle:text-green-300">
              <UserIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300">
                Total Students
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100">
                {students.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-blue-900 jungle:bg-green-800 text-green-600 dark:text-blue-300 jungle:text-green-300">
              <BarChart2Icon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300">
                Avg. Progress
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100">
                {studentProgressData.length > 0 ? Math.round(studentProgressData.reduce((sum, student) => sum + student.progress.overall, 0) / studentProgressData.length) : 0}
                %
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-blue-900 jungle:bg-green-800 text-yellow-600 dark:text-blue-300 jungle:text-green-300">
              <BookOpenIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300">
                Active Courses
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100">
                {userRole === 'admin' ? courses.length : courses.filter(course => course.instructorId === currentUser?.id).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 jungle:bg-green-800 text-blue-600 dark:text-blue-300 jungle:text-green-300">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300">
                Avg. Score
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100">
                {studentProgressData.length > 0 ? Math.round(studentProgressData.reduce((sum, student) => sum + student.progress.averageScore, 0) / studentProgressData.length) : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded-md leading-5 bg-white dark:bg-blue-900 jungle:bg-green-800 placeholder-gray-500 dark:placeholder-blue-400 jungle:placeholder-green-400 text-gray-900 dark:text-blue-100 jungle:text-green-100 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <label htmlFor="course-filter" className="sr-only">
                Filter by Course
              </label>
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 mr-2" />
                <select id="course-filter" value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 text-gray-900 dark:text-blue-100 jungle:text-green-100">
                  <option value="all">All Courses</option>
                  {courses.filter(course => userRole === 'admin' || course.instructorId === currentUser?.id).map(course => <option key={course.id} value={course.id}>
                        {course.title}
                      </option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Student progress table */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800">
            <thead className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('name')}>
                  <div className="flex items-center">
                    Student
                    {getSortIcon('name')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('progress')}>
                  <div className="flex items-center">
                    Overall Progress
                    {getSortIcon('progress')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('score')}>
                  <div className="flex items-center">
                    Average Score
                    {getSortIcon('score')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('courses')}>
                  <div className="flex items-center">
                    Enrolled Courses
                    {getSortIcon('courses')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-blue-950 jungle:bg-green-900 divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800">
              {filteredAndSortedStudents.length > 0 ? filteredAndSortedStudents.map(student => <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-indigo-600 dark:text-blue-300 jungle:text-green-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 dark:bg-blue-800 jungle:bg-green-800 rounded-full h-2.5 mr-2 w-24">
                          <div className="bg-indigo-600 dark:bg-blue-500 jungle:bg-green-500 h-2.5 rounded-full" style={{
                      width: `${student.progress.overall}%`
                    }}></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100">
                          {student.progress.overall}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100">
                        {student.progress.averageScore}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100">
                        {student.progress.enrolledCourses.length} courses
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.progress.enrolledCourses.slice(0, 2).map((course: any) => <span key={course.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 text-indigo-800 dark:text-blue-300 jungle:text-green-300">
                              {course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title}{' '}
                              ({course.progress}%)
                            </span>)}
                        {student.progress.enrolledCourses.length > 2 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 text-gray-800 dark:text-blue-300 jungle:text-green-300">
                            +{student.progress.enrolledCourses.length - 2} more
                          </span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 hover:text-indigo-900 dark:hover:text-blue-300 jungle:hover:text-green-300">
                        View Details
                      </button>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400">
                    No students found matching the current filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default StudentProgressTracker;