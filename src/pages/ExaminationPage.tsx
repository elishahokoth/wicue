import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, Edit as EditIcon, Trash as TrashIcon, Eye as EyeIcon, Clock as ClockIcon, CheckCircle as CheckCircleIcon, FileText as FileTextIcon, Save as SaveIcon } from 'lucide-react';
type Question = {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
};
type Examination = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
  status: string;
  createdAt: string;
};
const ExaminationPage = () => {
  const {
    currentUser,
    courses
  } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [showExamForm, setShowExamForm] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Examination, 'id' | 'courseId' | 'status' | 'createdAt'>>({
    title: '',
    description: '',
    timeLimit: 60,
    passingScore: 70,
    questions: [{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]
  });
  // Filter courses based on user role
  const filteredCourses = courses.filter(course => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'lecturer') return course.instructorId === currentUser.id;
    return false;
  });
  // Mock function to fetch examinations for a course
  useEffect(() => {
    if (selectedCourse) {
      // In a real app, this would be an API call
      const mockExams = [{
        id: 'exam1',
        courseId: selectedCourse,
        title: 'Midterm Examination',
        description: 'Comprehensive test covering modules 1-5',
        timeLimit: 90,
        passingScore: 65,
        questions: [{
          id: 'q1',
          text: 'Which learning approach is most effective for practical skills?',
          options: ['Lecture-based learning', 'Project-based learning', 'Reading textbooks', 'Watching videos'],
          correctAnswer: 1
        }, {
          id: 'q2',
          text: 'What is a key characteristic of effective e-learning content?',
          options: ['Long, detailed explanations', 'Minimal interactivity', 'Clear, concise information with interactive elements', 'Text-only content'],
          correctAnswer: 2
        }],
        status: 'published',
        createdAt: '2023-01-15'
      }, {
        id: 'exam2',
        courseId: selectedCourse,
        title: 'Final Examination',
        description: 'Comprehensive test covering all modules',
        timeLimit: 120,
        passingScore: 70,
        questions: [{
          id: 'q1',
          text: 'Which assessment method best evaluates critical thinking?',
          options: ['Multiple choice tests', 'True/false questions', 'Case studies and analysis', 'Fill-in-the-blank exercises'],
          correctAnswer: 2
        }, {
          id: 'q2',
          text: 'What is the most important factor in student engagement?',
          options: ['Course difficulty', 'Relevance and interactivity', 'Course length', 'Number of assessments'],
          correctAnswer: 1
        }, {
          id: 'q3',
          text: 'Which technology is most effective for collaborative learning?',
          options: ['Video lectures', 'PDF documents', 'Discussion forums and shared workspaces', 'Individual quizzes'],
          correctAnswer: 2
        }],
        status: 'draft',
        createdAt: '2023-02-20'
      }];
      setExaminations(mockExams);
    } else {
      setExaminations([]);
    }
  }, [selectedCourse]);
  const handleAddQuestion = (): void => {
    setFormData({
      ...formData,
      questions: [...formData.questions, {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    });
  };
  const handleRemoveQuestion = (index: number): void => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  const handleQuestionChange = (index: number, field: keyof Question, value: any): void => {
    const updatedQuestions = [...formData.questions];
  (updatedQuestions[index] as any)[field] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string): void => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  const handleCorrectAnswerChange = (questionIndex: number, value: string): void => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].correctAnswer = parseInt(value);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  const handleEditExam = (exam: Examination): void => {
    setEditingExam(exam.id);
    setFormData({
      title: exam.title,
      description: exam.description,
      timeLimit: exam.timeLimit,
      passingScore: exam.passingScore,
      questions: exam.questions.map((q) => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });
    setShowExamForm(true);
  };
  const handlePreviewExam = (examId: string): void => {
    // In a real app, this would navigate to a preview page
    alert('Previewing examination: ' + examId);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (editingExam) {
      // Update existing exam
      setExaminations(examinations.map(exam => exam.id === editingExam ? {
        ...exam,
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        passingScore: formData.passingScore,
        questions: formData.questions
      } : exam));
      setEditingExam(null);
    } else {
      // Create new exam
      const newExam = {
        id: `exam-${Date.now()}`,
        courseId: selectedCourse,
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setExaminations([...examinations, newExam]);
    }
    setShowExamForm(false);
    setFormData({
      title: '',
      description: '',
      timeLimit: 60,
      passingScore: 70,
      questions: [{
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    });
  };
  const handleDeleteExam = (examId: string): void => {
    if (window.confirm('Are you sure you want to delete this examination? This action cannot be undone.')) {
      setExaminations(examinations.filter(exam => exam.id !== examId));
    }
  };
  const handlePublishExam = (examId: string): void => {
    setExaminations(examinations.map(exam => exam.id === examId ? {
      ...exam,
      status: 'published'
    } : exam));
    alert('Examination published successfully!');
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          Examination Management
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Create and manage examinations for your courses.
        </p>
      </div>
      {/* Course selector */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
        <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-2">
          Select a course to manage examinations
        </label>
        <select id="course-select" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black">
          <option value="">Select a course</option>
          {filteredCourses.map(course => <option key={course.id} value={course.id}>
              {course.title}
            </option>)}
        </select>
      </div>
      {selectedCourse && <>
          {/* Examinations list */}
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Examinations
              </h2>
              <button onClick={() => {
            setEditingExam(null);
            setFormData({
              title: '',
              description: '',
              timeLimit: 60,
              passingScore: 70,
              questions: [{
                text: '',
                options: ['', '', '', ''],
                correctAnswer: 0
              }]
            });
            setShowExamForm(true);
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Examination
              </button>
            </div>
            {examinations.length > 0 ? <div className="divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
                {examinations.map(exam => <div key={exam.id} className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {exam.title}
                          </h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${exam.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                            {exam.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          {exam.description}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 gap-x-4">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {exam.timeLimit} minutes
                          </span>
                          <span className="flex items-center">
                            <FileTextIcon className="h-4 w-4 mr-1" />
                            {exam.questions.length} questions
                          </span>
                          <span className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Passing score: {exam.passingScore}%
                          </span>
                          <span>Created: {exam.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button onClick={() => handlePreviewExam(exam.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800 jungle:text-green-200 jungle:bg-green-800/30 jungle:hover:bg-green-700 extra-dark:text-gray-200 extra-dark:bg-gray-800/30 extra-dark:hover:bg-gray-700">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Preview
                        </button>
                        <button onClick={() => handleEditExam(exam)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800 jungle:text-green-200 jungle:bg-green-800/30 jungle:hover:bg-green-700 extra-dark:text-gray-200 extra-dark:bg-gray-800/30 extra-dark:hover:bg-gray-700">
                          <EditIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        {exam.status !== 'published' && <button onClick={() => handlePublishExam(exam.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-200 dark:bg-green-900/30 dark:hover:bg-green-800 jungle:text-green-200 jungle:bg-green-800/30 jungle:hover:bg-green-700 extra-dark:text-green-200 extra-dark:bg-green-900/30 extra-dark:hover:bg-green-800">
                            <SaveIcon className="h-4 w-4 mr-1" />
                            Publish
                          </button>}
                        <button onClick={() => handleDeleteExam(exam.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-200 dark:bg-red-900/30 dark:hover:bg-red-800 jungle:text-red-200 jungle:bg-red-800/30 jungle:hover:bg-red-700 extra-dark:text-red-200 extra-dark:bg-red-900/30 extra-dark:hover:bg-red-800">
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div> : <div className="px-6 py-8 text-center">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  No examinations
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  Get started by creating a new examination.
                </p>
              </div>}
          </div>
          {/* Examination form */}
          {showExamForm && <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6">
                      <div className="mb-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          {editingExam ? 'Edit Examination' : 'Create New Examination'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          Fill in the details to{' '}
                          {editingExam ? 'update the' : 'create a new'}{' '}
                          examination.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                            Examination Title
                          </label>
                          <input type="text" id="title" value={formData.title} onChange={e => setFormData({
                      ...formData,
                      title: e.target.value
                    })} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                            Description
                          </label>
                          <textarea id="description" rows={3} value={formData.description} onChange={e => setFormData({
                      ...formData,
                      description: e.target.value
                    })} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                              Time Limit (minutes)
                            </label>
                            <input type="number" id="timeLimit" min="1" value={formData.timeLimit} onChange={e => setFormData({
                        ...formData,
                        timeLimit: parseInt(e.target.value)
                      })} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                          </div>
                          <div>
                            <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                              Passing Score (%)
                            </label>
                            <input type="number" id="passingScore" min="1" max="100" value={formData.passingScore} onChange={e => setFormData({
                        ...formData,
                        passingScore: parseInt(e.target.value)
                      })} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                          </div>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-4">
                            Questions
                          </h3>
                          {formData.questions.map((question, qIndex) => <div key={qIndex} className="mb-8 p-4 border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-md font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                                  Question {qIndex + 1}
                                </h4>
                                {formData.questions.length > 1 && <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                    <TrashIcon className="h-5 w-5" />
                                  </button>}
                              </div>
                              <div className="mb-4">
                                <label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                                  Question Text
                                </label>
                                <input type="text" id={`question-${qIndex}`} value={question.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-2">
                                  Options
                                </label>
                                {question.options.map((option, oIndex) => <div key={oIndex} className="flex items-center mb-2">
                                    <input type="radio" id={`question-${qIndex}-option-${oIndex}`} name={`question-${qIndex}-correct`} checked={question.correctAnswer === oIndex} onChange={() => handleCorrectAnswerChange(qIndex, oIndex.toString())} className="h-4 w-4 text-indigo-600 dark:text-blue-600 jungle:text-green-600 extra-dark:text-sky-600 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500" />
                                    <input type="text" value={option} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} required placeholder={`Option ${oIndex + 1}`} className="ml-2 flex-1 px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-black" />
                                  </div>)}
                              </div>
                            </div>)}
                          <button type="button" onClick={handleAddQuestion} className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Question
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm">
                        {editingExam ? 'Update' : 'Create'} Examination
                      </button>
                      <button type="button" onClick={() => setShowExamForm(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:mt-0 sm:w-auto sm:text-sm">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>}
        </>}
    </div>;
};
export default ExaminationPage;