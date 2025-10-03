import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockIcon, EyeIcon, CheckCircleIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, AlertTriangleIcon, LockIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { mockCourses } from '../data/mockData';
// import { QuizQuestionData } from '../components/CourseForm';
const Assessment = () => {
  const {
    courseId,
    moduleId
  } = useParams();
  const {
    courses,
    updateModuleProgress
  } = useAuth() as any;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [securityStatus, setSecurityStatus] = useState('secure'); // 'secure', 'warning', 'violation'
  // const [faceDetected, setFaceDetected] = useState(true); // unused
  const [tabFocused, setTabFocused] = useState(true);
  const [proctorMessage, setProctorMessage] = useState('');
  const [showProctorMessage, setShowProctorMessage] = useState(false);
  // const [securityViolations, setSecurityViolations] = useState<any[]>([]); // unused
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const faceCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Get the current course and module
  const course = courses.find((c: any) => c.id === courseId);
  const module = course?.modules.find((m: any) => m.id === moduleId);
  // Load assessment data
  useEffect(() => {
  const loadAssessment = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      // For demo, we'll create a mock assessment
      const mockAssessment = {
        id: `${moduleId}-assessment`,
        title: `${module?.title || 'Module'} Assessment`,
        description: 'Complete this assessment to demonstrate your understanding of the module content.',
        timeLimit: 30 * 60,
        passingScore: 70,
        questions: generateMockQuestions(10),
        securityLevel: 'high' // 'low', 'medium', 'high'
      };
      setAssessment(mockAssessment);
      setTimeLeft(mockAssessment.timeLimit);
      setLoading(false);
      // Initialize empty answers
      const initialAnswers: { [key: string]: any } = {};
      mockAssessment.questions.forEach((q: any) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    };
    loadAssessment();
  }, [courseId, moduleId, module]);
  // Generate mock questions for the assessment
  const generateMockQuestions = (count: number) => {
    const questionTypes = ['multiple-choice', 'true-false', 'multiple-select'];
    const questions = [];
    for (let i = 0; i < count; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const question: any = {
        id: `q-${i + 1}`,
        type,
        text: `Sample question ${i + 1} for this assessment?`,
        points: 10
      };
      if (type === 'multiple-choice') {
        question.options = [{
          id: `q-${i + 1}-a`,
          text: 'Option A'
        }, {
          id: `q-${i + 1}-b`,
          text: 'Option B'
        }, {
          id: `q-${i + 1}-c`,
          text: 'Option C'
        }, {
          id: `q-${i + 1}-d`,
          text: 'Option D'
        }];
        question.correctAnswer = question.options[0].id;
      } else if (type === 'true-false') {
        question.options = [{
          id: `q-${i + 1}-true`,
          text: 'True'
        }, {
          id: `q-${i + 1}-false`,
          text: 'False'
        }];
        question.correctAnswer = Math.random() > 0.5 ? question.options[0].id : question.options[1].id;
      } else if (type === 'multiple-select') {
        question.options = [{
          id: `q-${i + 1}-a`,
          text: 'Option A'
        }, {
          id: `q-${i + 1}-b`,
          text: 'Option B'
        }, {
          id: `q-${i + 1}-c`,
          text: 'Option C'
        }, {
          id: `q-${i + 1}-d`,
          text: 'Option D'
        }];
        question.correctAnswer = [question.options[0].id, question.options[2].id];
      }
      questions.push(question);
    }
    return questions;
  };
  // Timer countdown
  useEffect(() => {
    if (!loading && assessment && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current) clearInterval(timerRef.current as unknown as number);
            submitAssessment();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current as unknown as number);
    };
  }, [loading, assessment, isFinished]);
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Handle answer change
  const handleAnswerChange = (questionId: string, answerId: string) => {
    const question = assessment.questions.find((q: any) => q.id === questionId);
    if (question.type === 'multiple-select') {
      setAnswers((prev: { [key: string]: any }) => {
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id: any) => id !== answerId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId]
          };
        }
      });
    } else {
      setAnswers((prev: { [key: string]: any }) => ({
        ...prev,
        [questionId]: answerId
      }));
    }
  };
  // Check if a multiple-select option is selected
  const isMultiSelectOptionSelected = (questionId: string, optionId: string) => {
    const answer = answers[questionId];
    return Array.isArray(answer) && answer.includes(optionId);
  };
  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  // Navigate to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  // Calculate if all questions are answered
  const allQuestionsAnswered = () => {
    return assessment?.questions.every((q: any) => {
      if (q.type === 'multiple-select') {
        return Array.isArray(answers[q.id]) && answers[q.id].length > 0;
      }
      return answers[q.id] !== null;
    });
  };
  // Calculate score and submit assessment
  const submitAssessment = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
  assessment.questions.forEach((question: any) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      if (!userAnswer) return;
      if (question.type === 'multiple-select') {
        // For multiple select, check if all correct options are selected and no incorrect ones
        const correctOptions = question.correctAnswer;
  const allCorrectSelected = correctOptions.every((opt: any) => userAnswer.includes(opt));
  const noIncorrectSelected = userAnswer.every((opt: any) => correctOptions.includes(opt));
        if (allCorrectSelected && noIncorrectSelected) {
          earnedPoints += question.points;
        } else if (allCorrectSelected || noIncorrectSelected) {
          // Partial credit
          earnedPoints += question.points / 2;
        }
      } else {
        // For single answer questions
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      }
    });
    const calculatedScore = Math.round(earnedPoints / totalPoints * 100);
    setScore(calculatedScore);
    // In a real app, this would be an API call to save the results
    setTimeout(() => {
      // Update module progress
      updateModuleProgress(courseId, moduleId, {
        completed: true,
        assessmentScore: calculatedScore,
        assessmentPassed: calculatedScore >= assessment.passingScore,
        completedDate: new Date().toISOString()
      });
      setIsFinished(true);
      setIsSubmitting(false);
      // Stop the timer
      if (timerRef.current) clearInterval(timerRef.current);
      // Stop face recognition
      if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
      stopCamera();
    }, 1500);
  };
  // Security monitoring - face recognition
  useEffect(() => {
    const setupFaceDetection = async () => {
      if (!assessment || assessment.securityLevel === 'low') return;
      // @ts-ignore
      // eslint-disable-next-line
      const faceapi: any = (window as any).faceapi || {};
      try {
        // Load face-api models
        await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('/models'), faceapi.nets.faceLandmark68Net.loadFromUri('/models'), faceapi.nets.faceRecognitionNet.loadFromUri('/models')]);
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Setup face detection interval
        faceCheckIntervalRef.current = setInterval(async () => {
          if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
            // Check if a face is detected
            if (detections.length === 0) {
              handleSecurityViolation('no_face', 'No face detected');
            } else if (detections.length > 1) {
              handleSecurityViolation('multiple_faces', 'Multiple faces detected');
            } else {
              // setFaceDetected(true); // removed, unused
            }
            // Draw detections on canvas
            const canvas = canvasRef.current;
            const displaySize = {
              width: videoRef.current.width,
              height: videoRef.current.height
            };
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        }, 1000);
      } catch (error) {
        console.error('Error setting up face detection:', error);
        setProctorMessage('Camera access denied. Please enable your camera to continue the assessment.');
        setShowProctorMessage(true);
      }
    };
    setupFaceDetection();
    return () => {
      if (faceCheckIntervalRef.current) {
        clearInterval(faceCheckIntervalRef.current);
      }
      stopCamera();
    };
  }, [assessment]);
  // Tab focus monitoring
  useEffect(() => {
    if (!assessment || assessment.securityLevel === 'low') return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabFocused(false);
        handleSecurityViolation('tab_switch', 'Switched to another tab or window');
      } else {
        setTabFocused(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [assessment]);
  // Handle security violations
  const handleSecurityViolation = (type: string, message: string) => {
    // Add violation to log
  // setSecurityViolations(prev => [...prev, {
  //   type,
  //   message,
  //   timestamp: new Date().toISOString()
  // }]); // removed, unused
    // Update security status
    if (type === 'no_face') {
  // setFaceDetected(false); // removed, unused
    }
    // Increment warning count for serious violations
    if (['no_face', 'multiple_faces', 'tab_switch'].includes(type)) {
      setWarningCount(prev => {
        const newCount = prev + 1;
        // Show warning message
        setProctorMessage(`Warning ${newCount}/2: ${message}. Continued violations will terminate the assessment.`);
        setShowProctorMessage(true);
        // Auto-hide message after 5 seconds
        setTimeout(() => {
          setShowProctorMessage(false);
        }, 5000);
        // Terminate assessment after 2 warnings
        if (newCount >= 2) {
          setSecurityStatus('violation');
          setProctorMessage('Assessment terminated due to security violations.');
          setShowProctorMessage(true);
          submitAssessment(); // Force submission
        } else {
          setSecurityStatus('warning');
        }
        return newCount;
      });
    }
  };
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
  const tracks = (videoRef.current.srcObject as any).getTracks?.() || [];
  tracks.forEach((track: any) => track.stop());
  videoRef.current.srcObject = null;
    }
  };
  // Render current question
  const renderCurrentQuestion = () => {
    if (!assessment) return null;
    const question = assessment.questions[currentQuestionIndex];
    if (!question) return null;
    return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
            {question.points} points
          </span>
        </div>
        <div className="mb-6">
          <p className="text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 font-medium">
            {question.text}
          </p>
          {question.type === 'multiple-select' && <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mt-1">
              (Select all that apply)
            </p>}
        </div>
        <div className="space-y-3">
          {question.options.map((option: any) => <div key={option.id} className="flex items-center">
              {question.type === 'multiple-select' ? <input type="checkbox" id={option.id} checked={isMultiSelectOptionSelected(question.id, option.id)} onChange={() => handleAnswerChange(question.id, option.id)} className="h-4 w-4 text-indigo-600 dark:text-blue-600 jungle:text-green-600 extra-dark:text-sky-600 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded" /> : <input type="radio" id={option.id} name={question.id} checked={answers[question.id] === option.id} onChange={() => handleAnswerChange(question.id, option.id)} className="h-4 w-4 text-indigo-600 dark:text-blue-600 jungle:text-green-600 extra-dark:text-sky-600 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700" />}
              <label htmlFor={option.id} className="ml-3 block text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                {option.text}
              </label>
            </div>)}
        </div>
        <div className="flex justify-between mt-8">
          <button type="button" onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0} className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ChevronLeftIcon className="mr-1 h-4 w-4" />
            Previous
          </button>
          {currentQuestionIndex < assessment.questions.length - 1 ? <button type="button" onClick={goToNextQuestion} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
              Next
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </button> : <button type="button" onClick={submitAssessment} disabled={isSubmitting || !allQuestionsAnswered()} className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting || !allQuestionsAnswered() ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              <CheckCircleIcon className="ml-1 h-4 w-4" />
            </button>}
        </div>
      </div>;
  };
  // Render question navigation
  const renderQuestionNavigation = () => {
    if (!assessment) return null;
    return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-3">
          Question Navigator
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {assessment.questions.map((question: any, index: number) => {
          const isAnswered = question.type === 'multiple-select' ? Array.isArray(answers[question.id]) && answers[question.id].length > 0 : answers[question.id] !== null;
          const isCurrent = index === currentQuestionIndex;
          return <button key={question.id} onClick={() => setCurrentQuestionIndex(index)} className={`w-full py-2 text-sm font-medium rounded ${isCurrent ? 'bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-white' : isAnswered ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                {index + 1}
              </button>;
        })}
        </div>
      </div>;
  };
  // Render assessment results
  const renderResults = () => {
    const passed = score >= assessment.passingScore;
    return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${passed ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300'} mb-4`}>
          {passed ? <CheckCircleIcon className="h-10 w-10" /> : <XIcon className="h-10 w-10" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
          {passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
        </h2>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-6">
          {passed ? 'Congratulations! You have successfully completed this assessment.' : 'You did not meet the minimum passing score. Review the module content and try again.'}
        </p>
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <path d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={passed ? '#10B981' : '#EF4444'} strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              {score}%
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-6">
          <p>Passing score: {assessment.passingScore}%</p>
          <p>Time taken: {formatTime(assessment.timeLimit - timeLeft)}</p>
          <p>Questions answered: {assessment.questions.length}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button type="button" onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
            Return to Module
          </button>
          <button type="button" onClick={() => navigate(`/courses/${courseId}`)} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
            Back to Course
          </button>
        </div>
      </div>;
  };
  return <div className="container mx-auto px-4 py-8">
      {loading ? <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div> : <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              {assessment.title}
            </h1>
            <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
              {assessment.description}
            </p>
          </div>
          {!isFinished ? <div className="flex flex-col md:flex-row gap-6">
              {/* Main content - questions */}
              <div className="flex-1">
                {/* Assessment header */}
                <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <div className={`p-2 rounded-full ${timeLeft < 300 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300' : 'bg-indigo-100 dark:bg-blue-900/30 text-indigo-600 dark:text-blue-300'}`}>
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          Time Remaining
                        </p>
                        <p className={`text-lg font-semibold ${timeLeft < 300 ? 'text-red-600 dark:text-red-300' : 'text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100'}`}>
                          {formatTime(timeLeft)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${securityStatus === 'secure' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' : securityStatus === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300'}`}>
                        {securityStatus === 'secure' ? <EyeIcon className="h-5 w-5" /> : securityStatus === 'warning' ? <AlertTriangleIcon className="h-5 w-5" /> : <LockIcon className="h-5 w-5" />}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          Security Status
                        </p>
                        <p className={`text-sm font-semibold ${securityStatus === 'secure' ? 'text-green-600 dark:text-green-300' : securityStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-300' : 'text-red-600 dark:text-red-300'}`}>
                          {securityStatus === 'secure' ? 'Secure' : securityStatus === 'warning' ? `Warning (${warningCount}/2)` : 'Terminated'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Proctor message */}
                {showProctorMessage && <div className={`mb-6 p-4 rounded-lg ${securityStatus === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
                    <div className="flex">
                      <div className={`flex-shrink-0 ${securityStatus === 'warning' ? 'text-yellow-400 dark:text-yellow-300' : 'text-red-400 dark:text-red-300'}`}>
                        <AlertTriangleIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${securityStatus === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
                          Security Alert
                        </h3>
                        <div className={`mt-2 text-sm ${securityStatus === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                          <p>{proctorMessage}</p>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                          <button type="button" onClick={() => setShowProctorMessage(false)} className={`inline-flex rounded-md p-1.5 ${securityStatus === 'warning' ? 'text-yellow-500 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50' : 'text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50'} focus:outline-none`}>
                            <span className="sr-only">Dismiss</span>
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>}
                {/* Current question */}
                {renderCurrentQuestion()}
                {/* Question navigation */}
                {renderQuestionNavigation()}
              </div>
              {/* Sidebar - security monitoring */}
              {assessment.securityLevel !== 'low' && <div className="w-full md:w-64 flex-shrink-0">
                  <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-3">
                      Security Information
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      <p className="mb-1">Security requirements:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li className={tabFocused ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          Keep this tab active
                        </li>
                        <li>No unauthorized materials</li>
                        <li>Complete in one session</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4 mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 mb-3">
                      Assessment Progress
                    </h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-1">
                        <span>Completion</span>
                        <span>
                          {Object.values(answers).filter(a => a !== null).length}{' '}
                          / {assessment.questions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-indigo-600 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-sky-600 h-2 rounded-full" style={{
                  width: `${Object.values(answers).filter(a => a !== null).length / assessment.questions.length * 100}%`
                }}></div>
                      </div>
                    </div>
                    <button type="button" onClick={submitAssessment} disabled={isSubmitting || !allQuestionsAnswered()} className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting || !allQuestionsAnswered() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                      <CheckCircleIcon className="ml-1 h-4 w-4" />
                    </button>
                    {!allQuestionsAnswered() && <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        Please answer all questions before submitting
                      </p>}
                  </div>
                </div>}
            </div> : renderResults()}
        </>}
    </div>;
};
export default Assessment;