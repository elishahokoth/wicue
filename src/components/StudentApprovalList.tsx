import React, { useState } from 'react';
import { CheckIcon, XIcon, UserIcon } from 'lucide-react';
interface Student {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  coursesEnrolled?: string[];
}
interface StudentApprovalListProps {
  students: Student[];
  onApprove: (studentId: string) => void;
  onReject: (studentId: string) => void;
}
const StudentApprovalList: React.FC<StudentApprovalListProps> = ({
  students,
  onApprove,
  onReject
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    return student.status === filter;
  });
  return <div className="bg-white dark:bg-emerald-800 shadow overflow-hidden sm:rounded-md transition-colors">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-emerald-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Student Approval Requests
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'all' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100' : 'bg-gray-100 text-gray-800 dark:bg-emerald-900 dark:text-gray-300'}`}>
            All
          </button>
          <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' : 'bg-gray-100 text-gray-800 dark:bg-emerald-900 dark:text-gray-300'}`}>
            Pending
          </button>
          <button onClick={() => setFilter('approved')} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-emerald-900 dark:text-gray-300'}`}>
            Approved
          </button>
          <button onClick={() => setFilter('rejected')} className={`px-3 py-1 rounded-full text-xs font-medium ${filter === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' : 'bg-gray-100 text-gray-800 dark:bg-emerald-900 dark:text-gray-300'}`}>
            Rejected
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-emerald-700">
        {filteredStudents.length > 0 ? filteredStudents.map(student => <li key={student.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-700 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-200" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {student.email}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-400">
                      Registered on{' '}
                      {new Date(student.registrationDate).toLocaleDateString()}
                    </div>
                    {student.coursesEnrolled && student.coursesEnrolled.length > 0 && <div className="mt-1 flex flex-wrap gap-1">
                          {student.coursesEnrolled.map((course, index) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                              {course}
                            </span>)}
                        </div>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {student.status === 'pending' ? <>
                      <button onClick={() => onApprove(student.id)} className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => onReject(student.id)} className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <XIcon className="h-4 w-4" />
                      </button>
                    </> : <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                      {student.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>}
                </div>
              </div>
            </li>) : <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
            No student requests found with the selected filter.
          </li>}
      </ul>
    </div>;
};
export default StudentApprovalList;