import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart2Icon, BookOpenIcon, CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, TrendingDownIcon, FilterIcon, DownloadIcon, ClipboardIcon, InfoIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon } from 'lucide-react';
import { mockCourses, mockStudentProgress } from '../data/mockData';
type Grade = {
  id: string;
  courseId: string;
  courseName: string;
  moduleId: string;
  moduleName: string;
  score: number;
  maxScore: number;
  submissionDate: Date;
  gradedDate: Date;
  gradedBy: string;
  feedback: string;
  status: 'passed' | 'failed';
  type: string;
  attempts: number;
  maxAttempts: number;
  courseColor: string;
};

const StudentGrades = () => {
  const {
    currentUser
  } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [showGradeDetails, setShowGradeDetails] = useState(false);
  useEffect(() => {
    // Simulate API call to get student grades
    const fetchStudentGrades = () => {
      setLoading(true);
      // Get progress data for the current student
      const studentProgress = mockStudentProgress.filter(progress => progress.userId === currentUser?.id);
      // Transform progress data into grades
  const studentGrades: Grade[] = [];
      studentProgress.forEach(progress => {
        const course = mockCourses.find(c => c.id === progress.courseId);
        if (!course) return;
        // For each module with an assessment score, create a grade entry
        Object.entries(progress.progress).forEach(([moduleId, moduleProgress]) => {
          if (moduleProgress.assessmentScore !== null) {
            const module = course.modules.find(m => m.id === moduleId);
            if (!module) return;
            const submissionDate = new Date(Date.now() - Math.random() * 7776000000); // Random date within last 90 days
            studentGrades.push({
              id: `${course.id}-${moduleId}`,
              courseId: course.id,
              courseName: course.title,
              moduleId,
              moduleName: module.title,
              score: moduleProgress.assessmentScore,
              maxScore: 100,
              submissionDate,
              gradedDate: new Date(submissionDate.getTime() + 86400000 * 2),
              gradedBy: (course as any).instructor || (course as any).instructorId || 'System',
              feedback: generateFeedback(moduleProgress.assessmentScore),
              status: moduleProgress.assessmentScore >= 70 ? 'passed' : 'failed',
              type: ['Quiz', 'Assignment', 'Exam'][Math.floor(Math.random() * 3)],
              attempts: 1 + Math.floor(Math.random() * 2),
              maxAttempts: 3,
              courseColor: ['bg-indigo-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-purple-100', 'bg-blue-100'][Math.floor(Math.random() * 6)]
            });
          }
        });
      });
      setGrades(studentGrades);
      setLoading(false);
    };
    fetchStudentGrades();
  }, [currentUser?.id]);
  // Generate feedback based on score
  const generateFeedback = (score: number) => {
    if (score >= 90) {
      return "Excellent work! You've demonstrated a thorough understanding of the material.";
    } else if (score >= 80) {
      return "Good job! You've shown a solid grasp of most concepts.";
    } else if (score >= 70) {
      return "Satisfactory work. You've understood the core concepts but there's room for improvement.";
    } else if (score >= 60) {
      return "You've passed, but should review the material to strengthen your understanding.";
    } else {
      return 'You need to revisit this material and try again. Focus on the key concepts.';
    }
  };
  // Get grade letter based on score
  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  // Filter grades based on current filter and search term
  const filteredGrades = grades.filter(grade => {
    // Apply status filter
    if (filter !== 'all' && grade.status !== filter) return false;
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return grade.courseName.toLowerCase().includes(searchLower) || grade.moduleName.toLowerCase().includes(searchLower) || grade.type.toLowerCase().includes(searchLower);
    }
    return true;
  });
  // Sort filtered grades
  const sortedGrades = [...filteredGrades].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'course':
        comparison = a.courseName.localeCompare(b.courseName);
        break;
      case 'module':
        comparison = a.moduleName.localeCompare(b.moduleName);
        break;
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'date':
      default:
  comparison = new Date(a.gradedDate).getTime() - new Date(b.gradedDate).getTime();
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  // Calculate overall statistics
  const calculateStats = () => {
    if (grades.length === 0) return {
      average: 0,
      passed: 0,
      failed: 0,
      highest: 0,
      lowest: 0
    };
    const scores = grades.map(grade => grade.score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const passed = grades.filter(grade => grade.status === 'passed').length;
    const failed = grades.filter(grade => grade.status === 'failed').length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    return {
      average,
      passed,
      failed,
      highest,
      lowest
    };
  };
  const stats = calculateStats();
  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };
  // View grade details
  const viewGradeDetails = (grade: Grade) => {
    setSelectedGrade(grade);
    setShowGradeDetails(true);
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          My Grades
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          View and track your academic performance across all courses
        </p>
      </div>
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-sky-300">
              <BarChart2Icon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                Average Score
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                {stats.average.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                Passed
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                {stats.passed}{' '}
                <span className="text-sm text-gray-500">
                  (
                  {grades.length > 0 ? Math.round(stats.passed / grades.length * 100) : 0}
                  %)
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300">
              <AlertCircleIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                Failed
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                {stats.failed}{' '}
                <span className="text-sm text-gray-500">
                  (
                  {grades.length > 0 ? Math.round(stats.failed / grades.length * 100) : 0}
                  %)
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
              <TrendingUpIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                Highest Score
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                {stats.highest}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300">
              <TrendingDownIcon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                Lowest Score
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                {stats.lowest}%
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and search */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 placeholder-gray-500 dark:placeholder-blue-400 jungle:placeholder-green-400 extra-dark:placeholder-gray-400 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Search by course, module, or type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <label htmlFor="status-filter" className="sr-only">
                Filter by Status
              </label>
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                <select id="status-filter" value={filter} onChange={e => setFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  <option value="all">All Assessments</option>
                  <option value="passed">Passed Only</option>
                  <option value="failed">Failed Only</option>
                </select>
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      {/* Grades table */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 shadow overflow-hidden rounded-lg">
        {loading ? <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div> : sortedGrades.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('course')}>
                    <div className="flex items-center">
                      Course
                      {getSortIcon('course')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('module')}>
                    <div className="flex items-center">
                      Assessment
                      {getSortIcon('module')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('score')}>
                    <div className="flex items-center">
                      Score
                      {getSortIcon('score')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('date')}>
                    <div className="flex items-center">
                      Date
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
                {sortedGrades.map(grade => <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-md ${grade.courseColor} dark:bg-opacity-30 flex items-center justify-center`}>
                          <BookOpenIcon className="h-5 w-5 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {grade.courseName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            {grade.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {grade.moduleName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                        Attempt {grade.attempts} of {grade.maxAttempts}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${grade.score >= 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {grade.score}%
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {getGradeLetter(grade.score)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                        <div className={`h-1.5 rounded-full ${grade.score >= 90 ? 'bg-green-500' : grade.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${grade.score}%`
                  }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                      {new Date(grade.gradedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => viewGradeDetails(grade)} className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:text-indigo-900 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300">
                        View Details
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              No grades found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters or search term' : 'You have not completed any assessments yet'}
            </p>
          </div>}
      </div>
      {/* Grade details modal */}
      {showGradeDetails && selectedGrade && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                      Assessment Details
                    </h3>
                    <div className="mt-4 border-t border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {selectedGrade.courseName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            {selectedGrade.moduleName} - {selectedGrade.type}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${selectedGrade.status === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                          {selectedGrade.status === 'passed' ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            Score
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {selectedGrade.score}%{' '}
                            <span className="text-sm font-normal">
                              ({getGradeLetter(selectedGrade.score)})
                            </span>
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            Graded By
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {selectedGrade.gradedBy}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            {new Date(selectedGrade.gradedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-1">
                          Feedback
                        </h5>
                        <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            {selectedGrade.feedback}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                        <InfoIcon className="h-4 w-4 mr-1" />
                        <span>
                          Submitted on{' '}
                          {new Date(selectedGrade.submissionDate).toLocaleDateString()}{' '}
                          • Attempt {selectedGrade.attempts} of{' '}
                          {selectedGrade.maxAttempts}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setShowGradeDetails(false)}>
                  Close
                </button>
                <button type="button" className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:w-auto sm:text-sm">
                  <ClipboardIcon className="h-4 w-4 mr-2" />
                  Copy to clipboard
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default StudentGrades;