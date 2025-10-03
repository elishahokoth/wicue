import React, { useEffect, useState, useRef } from 'react';
import { XIcon, PlusIcon, FileIcon, UploadIcon, FileTextIcon, BookIcon, ListIcon, TypeIcon, ClockIcon, FileQuestionIcon, AlignLeftIcon, CodeIcon, UploadCloudIcon } from 'lucide-react';
export type UnitData = {
  id?: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  media?: MediaData[]; // Add media array to units
  quizConfig?: {
    timeLimit?: number;
    passingScore?: number;
    shuffleQuestions?: boolean;
    showFeedback?: boolean;
    questions: QuizQuestionData[];
    [key: string]: any;
  };
};
export type QuizQuestionData = {
  id?: string;
  text: string;
  type: 'multiple-choice' | 'multiple-select' | 'short-answer' | 'true-false' | 'matching' | 'fill-blank' | 'code' | 'file-upload';
  points: number;
  options?: string[];
  correctAnswers?: Array<number | string>;
  explanation?: string;
};
export type MediaData = {
  id?: string;
  name: string;
  type: string;
  url: string;
  size: number;
};
export type CourseFormData = {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  modules: Array<{
    id?: string;
    title: string;
    description: string;
    content: string;
    units: UnitData[];
    media?: MediaData[];
  }>;
};
type CourseFormProps = {
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
};
const CourseForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}: CourseFormProps) => {
  const [formData, setFormData] = useState<CourseFormData>(initialData || {
    title: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    modules: [{
      title: '',
      description: '',
      content: '',
      units: [{
        title: '',
        content: '',
        type: 'text',
        media: []
      }],
      media: []
    }]
  });
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [activeExtractionInfo, setActiveExtractionInfo] = useState<{
    level: 'module' | 'unit';
    moduleIndex: number;
    unitIndex?: number;
  } | null>(null);
  const moduleFileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const unitFileInputRefs = useRef<Array<Array<HTMLInputElement | null>>>([]);
  // Initialize a new quiz question with default values
  const getDefaultQuizQuestion = (): QuizQuestionData => {
    return {
      id: `question-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      text: '',
      type: 'multiple-choice',
      points: 1,
      options: ['', ''],
      correctAnswers: [0],
      explanation: ''
    };
  };
  // Initialize quiz config when unit type changes to quiz
  const initializeQuizConfig = (moduleIndex: number, unitIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (unit.type === 'quiz' && !unit.quizConfig) {
      updatedModules[moduleIndex].units[unitIndex] = {
        ...unit,
        quizConfig: {
          timeLimit: 30,
          passingScore: 70,
          shuffleQuestions: false,
          showFeedback: true,
          questions: [getDefaultQuizQuestion()]
        }
      };
      setFormData({
        ...formData,
        modules: updatedModules
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    const updatedModules = [...formData.modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [name]: value
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const handleUnitChange = (moduleIndex: number, unitIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    const updatedModules = [...formData.modules];
    const updatedUnits = [...updatedModules[moduleIndex].units];
    // If changing unit type to quiz, initialize quiz configuration immediately
    if (name === 'type' && value === 'quiz') {
      updatedUnits[unitIndex] = {
        ...updatedUnits[unitIndex],
        [name]: value,
        quizConfig: {
          timeLimit: 30,
          passingScore: 70,
          shuffleQuestions: false,
          showFeedback: true,
          questions: [getDefaultQuizQuestion()]
        }
      };
    } else {
      updatedUnits[unitIndex] = {
        ...updatedUnits[unitIndex],
        [name]: value
      };
    }
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      units: updatedUnits
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Handle quiz configuration changes
  const handleQuizConfigChange = (moduleIndex: number, unitIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig) return;
    const updatedQuizConfig = {
      ...unit.quizConfig
    };
    if (type === 'checkbox') {
  (updatedQuizConfig as any)[name] = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
  (updatedQuizConfig as any)[name] = parseInt(value, 10);
    } else {
  (updatedQuizConfig as any)[name] = value;
    }
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: updatedQuizConfig
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Handle quiz question changes
  const handleQuizQuestionChange = (moduleIndex: number, unitIndex: number, questionIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    if (!updatedQuestions[questionIndex]) return;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [name]: name === 'points' ? parseInt(value, 10) : value
    };
    // If question type changes, reset options and correct answers
    if (name === 'type') {
      const questionType = value as QuizQuestionData['type'];
      if (questionType === 'multiple-choice' || questionType === 'multiple-select') {
        updatedQuestions[questionIndex].options = ['', ''];
        updatedQuestions[questionIndex].correctAnswers = questionType === 'multiple-choice' ? [0] : [];
      } else if (questionType === 'true-false') {
        updatedQuestions[questionIndex].options = ['True', 'False'];
        updatedQuestions[questionIndex].correctAnswers = [0];
      } else {
        // For text-based answers
        delete updatedQuestions[questionIndex].options;
        updatedQuestions[questionIndex].correctAnswers = questionType === 'short-answer' ? [''] : [];
      }
    }
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Handle option changes for multiple choice/select questions
  const handleOptionChange = (moduleIndex: number, unitIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    const question = updatedQuestions[questionIndex];
    if (!question || !question.options) return;
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...question,
      options: updatedOptions
    };
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Add a new option to a multiple choice/select question
  const addOption = (moduleIndex: number, unitIndex: number, questionIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    const question = updatedQuestions[questionIndex];
    if (!question) return;
    if (!question.options) question.options = [];
    updatedQuestions[questionIndex] = {
      ...question,
      options: [...question.options, '']
    };
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Remove an option from a multiple choice/select question
  const removeOption = (moduleIndex: number, unitIndex: number, questionIndex: number, optionIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    const question = updatedQuestions[questionIndex];
    if (!question || !question.options || question.options.length <= 2) return;
    const updatedOptions = [...question.options];
    updatedOptions.splice(optionIndex, 1);
    // Update correct answers if they reference the removed option
    let updatedCorrectAnswers = [...(question.correctAnswers as number[] || [])];
    updatedCorrectAnswers = updatedCorrectAnswers.filter(index => index !== optionIndex).map(index => index > optionIndex ? index - 1 : index);
    updatedQuestions[questionIndex] = {
      ...question,
      options: updatedOptions,
      correctAnswers: updatedCorrectAnswers
    };
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Toggle correct answer for multiple choice/select questions
  const toggleCorrectAnswer = (moduleIndex: number, unitIndex: number, questionIndex: number, optionIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    const question = updatedQuestions[questionIndex];
    if (!question) return;
    if (!question.correctAnswers) question.correctAnswers = [];
    let updatedCorrectAnswers = [...(question.correctAnswers as number[])];
    if (question.type === 'multiple-choice') {
      // For multiple choice, only one correct answer
      updatedCorrectAnswers = [optionIndex];
    } else if (question.type === 'multiple-select') {
      // For multiple select, toggle the selection
      if (updatedCorrectAnswers.includes(optionIndex)) {
        updatedCorrectAnswers = updatedCorrectAnswers.filter(i => i !== optionIndex);
      } else {
        updatedCorrectAnswers.push(optionIndex);
      }
    }
    updatedQuestions[questionIndex] = {
      ...question,
      correctAnswers: updatedCorrectAnswers
    };
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Add a new question to the quiz
  const addQuestion = (moduleIndex: number, unitIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig) return;
    const currentQuestions = unit.quizConfig.questions || [];
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: [...currentQuestions, getDefaultQuizQuestion()]
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  // Remove a question from the quiz
  const removeQuestion = (moduleIndex: number, unitIndex: number, questionIndex: number) => {
    const updatedModules = [...formData.modules];
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (!unit.quizConfig || !unit.quizConfig.questions || unit.quizConfig.questions.length <= 1) return;
    const updatedQuestions = [...unit.quizConfig.questions];
    updatedQuestions.splice(questionIndex, 1);
    updatedModules[moduleIndex].units[unitIndex] = {
      ...unit,
      quizConfig: {
        ...unit.quizConfig,
        questions: updatedQuestions
      }
    };
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, {
        title: '',
        description: '',
        content: '',
        units: [{
          title: '',
          content: '',
          type: 'text',
          media: []
        }],
        media: []
      }]
    });
  };
  const removeModule = (index: number) => {
    const updatedModules = [...formData.modules];
    // Revoke any object URLs to prevent memory leaks
    if (updatedModules[index].media) {
      updatedModules[index].media?.forEach(media => {
        if (media.url) URL.revokeObjectURL(media.url);
      });
    }
    // Also revoke URLs for any unit media
    updatedModules[index].units.forEach(unit => {
      if (unit.media) {
        unit.media.forEach(media => {
          if (media.url) URL.revokeObjectURL(media.url);
        });
      }
    });
    updatedModules.splice(index, 1);
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const addUnit = (moduleIndex: number) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].units.push({
      title: '',
      content: '',
      type: 'text',
      media: []
    });
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const removeUnit = (moduleIndex: number, unitIndex: number) => {
    const updatedModules = [...formData.modules];
    // Revoke any object URLs to prevent memory leaks
    const unit = updatedModules[moduleIndex].units[unitIndex];
    if (unit.media) {
      unit.media.forEach(media => {
        if (media.url) URL.revokeObjectURL(media.url);
      });
    }
    updatedModules[moduleIndex].units.splice(unitIndex, 1);
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const handleFileUpload = (moduleIndex: number, e: React.ChangeEvent<HTMLInputElement>, unitIndex?: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileType = file.type;
    const fileName = file.name;
    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    const updatedModules = [...formData.modules];
    // Determine if we're uploading to a module or a unit
    if (unitIndex !== undefined) {
      // Unit-level upload
      if (!updatedModules[moduleIndex].units[unitIndex].media) {
        updatedModules[moduleIndex].units[unitIndex].media = [];
      }
      updatedModules[moduleIndex].units[unitIndex].media?.push({
        name: fileName,
        type: fileType,
        url: fileUrl,
        size: file.size
      });
      // Simulate content extraction for unit
      simulateContentExtraction(moduleIndex, fileType, fileName, unitIndex);
    } else {
      // Module-level upload
      if (!updatedModules[moduleIndex].media) {
        updatedModules[moduleIndex].media = [];
      }
      updatedModules[moduleIndex].media?.push({
        name: fileName,
        type: fileType,
        url: fileUrl,
        size: file.size
      });
      // Simulate content extraction for module
      simulateContentExtraction(moduleIndex, fileType, fileName);
    }
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const simulateContentExtraction = (moduleIndex: number, fileType: string, fileName: string, unitIndex?: number) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    // Track which level (module or unit) is being extracted
    setActiveExtractionInfo({
      level: unitIndex !== undefined ? 'unit' : 'module',
      moduleIndex,
      unitIndex
    });
    // Simulate extraction process with progress updates
    const interval = setInterval(() => {
      setExtractionProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (unitIndex !== undefined) {
              generateContentForUnit(moduleIndex, unitIndex, fileType, fileName);
            } else {
              generateUnitsFromExtraction(moduleIndex, fileType, fileName);
            }
            setIsExtracting(false);
            setActiveExtractionInfo(null);
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };
  const generateContentForUnit = (moduleIndex: number, unitIndex: number, fileType: string, fileName: string) => {
    // Generate simulated content for this specific unit
    const fileBaseName = fileName.split('.')[0];
    const extractedContent = `Content extracted from ${fileName}. This would contain the actual text from your document.
The ${fileType.includes('pdf') ? 'PDF' : 'Word'} document "${fileBaseName}" contains information that has been automatically processed and formatted for this unit.
Key points from the document:
- Main concept: ${fileBaseName}
- Document type: ${fileType.includes('pdf') ? 'PDF' : 'Word'} document
- Length: ${Math.floor(Math.random() * 20) + 5} pages
- Contains ${Math.floor(Math.random() * 5) + 2} sections with detailed information
This text represents the extracted and processed content that would normally come from parsing the actual document.`;
    const updatedModules = [...formData.modules];
    // If the unit is empty (no title/content), update both
    if (!updatedModules[moduleIndex].units[unitIndex].title) {
      updatedModules[moduleIndex].units[unitIndex].title = `Content from ${fileBaseName}`;
    }
    // Ask if user wants to replace or append content
    if (updatedModules[moduleIndex].units[unitIndex].content && updatedModules[moduleIndex].units[unitIndex].content.trim() !== '') {
      if (confirm('Would you like to replace the existing content with the extracted content?')) {
        updatedModules[moduleIndex].units[unitIndex].content = extractedContent;
      } else if (confirm('Would you like to append the extracted content to the existing content?')) {
        updatedModules[moduleIndex].units[unitIndex].content += '\n\n' + extractedContent;
      }
    } else {
      updatedModules[moduleIndex].units[unitIndex].content = extractedContent;
    }
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const generateUnitsFromExtraction = (moduleIndex: number, fileType: string, fileName: string) => {
    // Simulate extracted content based on file type
    const fileBaseName = fileName.split('.')[0];
    // Generate simulated units based on the file
    const simulatedUnits: UnitData[] = [];
    // Create a title unit
    simulatedUnits.push({
      title: `Introduction to ${fileBaseName}`,
      content: `This is the introduction section extracted from ${fileName}.`,
      type: 'text',
      media: []
    });
    // Create content units - number depends on file type
    const numSections = fileType.includes('pdf') ? 4 : 3;
    for (let i = 1; i <= numSections; i++) {
      simulatedUnits.push({
        title: `${fileBaseName} - Section ${i}`,
        content: `Content extracted from ${fileName}, section ${i}. This would contain the actual extracted text from your document.`,
        type: 'text',
        media: []
      });
    }
    // Add a final unit
    simulatedUnits.push({
      title: `Summary of ${fileBaseName}`,
      content: `This is the summary section extracted from ${fileName}.`,
      type: 'text',
      media: []
    });
    // Add units to the module
    const updatedModules = [...formData.modules];
    // If there are already units, ask the user what to do
    if (updatedModules[moduleIndex].units.length > 0 && !(updatedModules[moduleIndex].units.length === 1 && !updatedModules[moduleIndex].units[0].title)) {
      if (confirm('Would you like to replace the existing units with the extracted content?')) {
        updatedModules[moduleIndex].units = simulatedUnits;
      } else if (confirm('Would you like to append the extracted content to the existing units?')) {
        updatedModules[moduleIndex].units = [...updatedModules[moduleIndex].units, ...simulatedUnits];
      }
    } else {
      // If no units or just the empty default unit, replace with extracted content
      updatedModules[moduleIndex].units = simulatedUnits;
    }
    // Update module title if it's empty
    if (!updatedModules[moduleIndex].title) {
      updatedModules[moduleIndex].title = fileBaseName;
    }
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const removeMedia = (moduleIndex: number, mediaIndex: number, unitIndex?: number) => {
    const updatedModules = [...formData.modules];
    if (unitIndex !== undefined) {
      // Unit-level media removal
      if (updatedModules[moduleIndex].units[unitIndex].media) {
        // Release the object URL to avoid memory leaks
        const mediaUrl = updatedModules[moduleIndex].units[unitIndex].media?.[mediaIndex]?.url;
        if (mediaUrl) {
          URL.revokeObjectURL(mediaUrl);
        }
        updatedModules[moduleIndex].units[unitIndex].media?.splice(mediaIndex, 1);
      }
    } else {
      // Module-level media removal
      if (updatedModules[moduleIndex].media) {
        // Release the object URL to avoid memory leaks
        const mediaUrl = updatedModules[moduleIndex].media?.[mediaIndex]?.url;
        if (mediaUrl) {
          URL.revokeObjectURL(mediaUrl);
        }
        updatedModules[moduleIndex].media?.splice(mediaIndex, 1);
      }
    }
    setFormData({
      ...formData,
      modules: updatedModules
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  // Initialize unit file input refs when modules or units change
  useEffect(() => {
    unitFileInputRefs.current = formData.modules.map(module => Array(module.units.length).fill(null));
  }, [formData.modules.length, formData.modules.map(m => m.units.length).join(',')]);
  // Initialize quiz config when unit type is changed to quiz
  useEffect(() => {
    formData.modules.forEach((module, moduleIndex) => {
      module.units.forEach((unit, unitIndex) => {
        if (unit.type === 'quiz' && !unit.quizConfig) {
          initializeQuizConfig(moduleIndex, unitIndex);
        }
      });
    });
  }, [formData.modules]);
  return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <textarea name="description" id="description" required rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                Thumbnail URL
              </label>
              <input type="url" name="thumbnail" id="thumbnail" required value={formData.thumbnail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              {formData.thumbnail && <div className="mt-2">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="h-32 w-full object-cover rounded-md" />
                </div>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-700">Modules</h3>
                <button type="button" onClick={addModule} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  Add Module
                </button>
              </div>
              {formData.modules.map((module, moduleIndex) => <div key={moduleIndex} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Module {moduleIndex + 1}
                    </h4>
                    {formData.modules.length > 1 && <button type="button" onClick={() => removeModule(moduleIndex)} className="text-red-600 hover:text-red-800 text-sm">
                        Remove
                      </button>}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`module-title-${moduleIndex}`} className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input type="text" name="title" id={`module-title-${moduleIndex}`} required value={module.title} onChange={e => handleModuleChange(moduleIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor={`module-description-${moduleIndex}`} className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <input type="text" name="description" id={`module-description-${moduleIndex}`} required value={module.description} onChange={e => handleModuleChange(moduleIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor={`module-content-${moduleIndex}`} className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <textarea name="content" id={`module-content-${moduleIndex}`} required rows={3} value={module.content} onChange={e => handleModuleChange(moduleIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    {/* Module-level Media Upload Section */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700">
                          Module Media Files
                        </h5>
                        <input type="file" id={`file-upload-${moduleIndex}`} onChange={e => handleFileUpload(moduleIndex, e)} className="hidden" accept="*/*" ref={el => moduleFileInputRefs.current[moduleIndex] = el} />
                        <button type="button" onClick={() => moduleFileInputRefs.current[moduleIndex]?.click()} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                          <UploadIcon className="h-3 w-3 mr-1" />
                          Upload PDF/Word
                        </button>
                      </div>
                      {/* Extraction Progress for Module */}
                      {isExtracting && activeExtractionInfo?.level === 'module' && activeExtractionInfo.moduleIndex === moduleIndex && <div className="mt-2 mb-4">
                            <div className="text-xs text-gray-600 mb-1">
                              Extracting module content... {extractionProgress}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{
                        width: `${extractionProgress}%`
                      }}></div>
                            </div>
                          </div>}
                      {/* Display uploaded module media files */}
                      {module.media && module.media.length > 0 && <div className="space-y-2 mt-2">
                          {module.media.map((media, mediaIndex) => <div key={mediaIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {media.type.includes('pdf') ? <FileTextIcon className="h-5 w-5 text-red-500" /> : <FileIcon className="h-5 w-5 text-blue-500" />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium">
                                    {media.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {(media.size / 1024).toFixed(1)} KB •{' '}
                                    {media.type.split('/')[1]}
                                  </div>
                                </div>
                              </div>
                              <button type="button" onClick={() => removeMedia(moduleIndex, mediaIndex)} className="text-red-500 hover:text-red-700">
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>)}
                        </div>}
                    </div>
                    {/* Units section */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700 flex items-center">
                          <BookIcon className="h-4 w-4 mr-1 text-indigo-600" />
                          Units
                        </h5>
                        <button type="button" onClick={() => addUnit(moduleIndex)} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Add Unit
                        </button>
                      </div>
                      <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                        {module.units.map((unit, unitIndex) => <div key={unitIndex} className="border border-gray-100 rounded-md p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="text-xs font-medium text-gray-700">
                                Unit {unitIndex + 1}
                              </h6>
                              {module.units.length > 1 && <button type="button" onClick={() => removeUnit(moduleIndex, unitIndex)} className="text-red-600 hover:text-red-800 text-xs">
                                  Remove
                                </button>}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <label htmlFor={`unit-title-${moduleIndex}-${unitIndex}`} className="block text-xs font-medium text-gray-700">
                                  Unit Title
                                </label>
                                <input type="text" name="title" id={`unit-title-${moduleIndex}-${unitIndex}`} required value={unit.title} onChange={e => handleUnitChange(moduleIndex, unitIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                              </div>
                              <div>
                                <label htmlFor={`unit-type-${moduleIndex}-${unitIndex}`} className="block text-xs font-medium text-gray-700">
                                  Unit Type
                                </label>
                                <select name="type" id={`unit-type-${moduleIndex}-${unitIndex}`} required value={unit.type} onChange={e => handleUnitChange(moduleIndex, unitIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black">
                                  <option value="text">Text</option>
                                  <option value="video">Video</option>
                                  <option value="audio">Audio</option>
                                  <option value="pdf">PDF</option>
                                  <option value="quiz">Quiz</option>
                                  <option value="assignment">Assignment</option>
                                  <option value="interactive">
                                    Interactive Content
                                  </option>
                                </select>
                              </div>
                              {/* Quiz Configuration Section */}
                              {unit.type === 'quiz' && <div className="mt-3 p-3 border border-indigo-100 rounded-md bg-indigo-50">
                                  <h6 className="text-xs font-medium text-indigo-700 mb-2 flex items-center">
                                    <FileQuestionIcon className="h-3.5 w-3.5 mr-1" />
                                    Quiz Configuration
                                  </h6>
                                  {/* Quiz Settings */}
                                  <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div>
                                      <label htmlFor={`quiz-time-${moduleIndex}-${unitIndex}`} className="block text-xs font-medium text-gray-700">
                                        Time Limit (minutes)
                                      </label>
                                      <div className="flex items-center">
                                        <ClockIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
                                        <input type="number" name="timeLimit" id={`quiz-time-${moduleIndex}-${unitIndex}`} min="1" value={unit.quizConfig?.timeLimit || 30} onChange={e => handleQuizConfigChange(moduleIndex, unitIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                      </div>
                                    </div>
                                    <div>
                                      <label htmlFor={`quiz-passing-${moduleIndex}-${unitIndex}`} className="block text-xs font-medium text-gray-700">
                                        Passing Score (%)
                                      </label>
                                      <input type="number" name="passingScore" id={`quiz-passing-${moduleIndex}-${unitIndex}`} min="1" max="100" value={unit.quizConfig?.passingScore || 70} onChange={e => handleQuizConfigChange(moduleIndex, unitIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                    </div>
                                  </div>
                                  <div className="flex space-x-4 mb-3">
                                    <div className="flex items-center">
                                      <input type="checkbox" name="shuffleQuestions" id={`quiz-shuffle-${moduleIndex}-${unitIndex}`} checked={unit.quizConfig?.shuffleQuestions || false} onChange={e => handleQuizConfigChange(moduleIndex, unitIndex, e)} className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                      <label htmlFor={`quiz-shuffle-${moduleIndex}-${unitIndex}`} className="ml-1.5 text-xs text-gray-700">
                                        Shuffle questions
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <input type="checkbox" name="showFeedback" id={`quiz-feedback-${moduleIndex}-${unitIndex}`} checked={unit.quizConfig?.showFeedback || true} onChange={e => handleQuizConfigChange(moduleIndex, unitIndex, e)} className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                      <label htmlFor={`quiz-feedback-${moduleIndex}-${unitIndex}`} className="ml-1.5 text-xs text-gray-700">
                                        Show feedback after submission
                                      </label>
                                    </div>
                                  </div>
                                  {/* Questions Section */}
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <h6 className="text-xs font-medium text-gray-700">
                                        Questions (
                                        {(unit.quizConfig?.questions || []).length}
                                        )
                                      </h6>
                                      <button type="button" onClick={() => addQuestion(moduleIndex, unitIndex)} className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                                        <PlusIcon className="h-2.5 w-2.5 mr-1" />
                                        Add Question
                                      </button>
                                    </div>
                                    {(unit.quizConfig?.questions || []).map((question, questionIndex) => <div key={questionIndex} className="mb-3 p-2 border border-gray-200 rounded-md bg-white">
                                          <div className="flex justify-between items-center mb-1.5">
                                            <h6 className="text-xs font-medium text-gray-700">
                                              Question {questionIndex + 1}
                                            </h6>
                                            {((unit.quizConfig?.questions || []).length || 0) > 1 && <button type="button" onClick={() => removeQuestion(moduleIndex, unitIndex, questionIndex)} className="text-red-600 hover:text-red-800 text-xs">
                                                Remove
                                              </button>}
                                          </div>
                                          <div className="space-y-2">
                                            <div>
                                              <label htmlFor={`question-text-${moduleIndex}-${unitIndex}-${questionIndex}`} className="block text-xs font-medium text-gray-700">
                                                Question Text
                                              </label>
                                              <textarea name="text" id={`question-text-${moduleIndex}-${unitIndex}-${questionIndex}`} required rows={2} value={question.text} onChange={e => handleQuizQuestionChange(moduleIndex, unitIndex, questionIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <label htmlFor={`question-type-${moduleIndex}-${unitIndex}-${questionIndex}`} className="block text-xs font-medium text-gray-700">
                                                  Question Type
                                                </label>
                                                <select name="type" id={`question-type-${moduleIndex}-${unitIndex}-${questionIndex}`} required value={question.type} onChange={e => handleQuizQuestionChange(moduleIndex, unitIndex, questionIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black">
                                                  <option value="multiple-choice">
                                                    Multiple Choice (Single
                                                    Answer)
                                                  </option>
                                                  <option value="multiple-select">
                                                    Multiple Select (Multiple
                                                    Answers)
                                                  </option>
                                                  <option value="short-answer">
                                                    Short Answer (Written)
                                                  </option>
                                                  <option value="true-false">
                                                    True/False
                                                  </option>
                                                  <option value="matching">
                                                    Matching
                                                  </option>
                                                  <option value="fill-blank">
                                                    Fill in the Blank
                                                  </option>
                                                  <option value="code">
                                                    Code Snippet
                                                  </option>
                                                  <option value="file-upload">
                                                    File Upload
                                                  </option>
                                                  <option value="audio-response">
                                                    Audio Response
                                                  </option>
                                                  <option value="video-response">
                                                    Video Response
                                                  </option>
                                                  <option value="drawing">
                                                    Drawing
                                                  </option>
                                                </select>
                                              </div>
                                              <div>
                                                <label htmlFor={`question-points-${moduleIndex}-${unitIndex}-${questionIndex}`} className="block text-xs font-medium text-gray-700">
                                                  Points
                                                </label>
                                                <input type="number" name="points" id={`question-points-${moduleIndex}-${unitIndex}-${questionIndex}`} min="1" value={question.points} onChange={e => handleQuizQuestionChange(moduleIndex, unitIndex, questionIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                              </div>
                                            </div>
                                            {/* Options for multiple choice / multiple select */}
                                            {(question.type === 'multiple-choice' || question.type === 'multiple-select') && <div className="mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                  <label className="text-xs font-medium text-gray-700">
                                                    {question.type === 'multiple-choice' ? 'Options (select one correct answer)' : 'Options (select all correct answers)'}
                                                  </label>
                                                  <button type="button" onClick={() => addOption(moduleIndex, unitIndex, questionIndex)} className="inline-flex items-center px-1 py-0.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                                                    <PlusIcon className="h-2.5 w-2.5 mr-0.5" />
                                                    Add Option
                                                  </button>
                                                </div>
                                                {(question.options || []).map((option, optionIndex) => <div key={optionIndex} className="flex items-center mt-1">
                                                      <div className="flex-shrink-0 mr-1.5">
                                                        <input type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'} checked={((question.correctAnswers as Array<number | string>) || []).includes(optionIndex)} onChange={() => toggleCorrectAnswer(moduleIndex, unitIndex, questionIndex, optionIndex)} className={`
                                                        ${question.type === 'multiple-choice' ? 'focus:ring-indigo-500 text-indigo-600 border-gray-300' : 'focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded'}
                                                      `} />
                                                      </div>
                                                      <div className="flex-grow">
                                                        <input type="text" placeholder={`Option ${optionIndex + 1}`} value={option} onChange={e => handleOptionChange(moduleIndex, unitIndex, questionIndex, optionIndex, e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                                      </div>
                                                      {(question.options || []).length > 2 && <button type="button" onClick={() => removeOption(moduleIndex, unitIndex, questionIndex, optionIndex)} className="ml-1.5 text-red-500 hover:text-red-700">
                                                          <XIcon className="h-3.5 w-3.5" />
                                                        </button>}
                                                    </div>)}
                                              </div>}
                                            {/* True/False options */}
                                            {question.type === 'true-false' && <div className="mt-2">
                                                <label className="text-xs font-medium text-gray-700 mb-1 block">
                                                  Correct Answer
                                                </label>
                                                <div className="flex space-x-4">
                                                  <div className="flex items-center">
                                                    <input type="radio" id={`true-option-${moduleIndex}-${unitIndex}-${questionIndex}`} checked={((question.correctAnswers as Array<number | string>) || []).includes(0)} onChange={() => toggleCorrectAnswer(moduleIndex, unitIndex, questionIndex, 0)} className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300" />
                                                    <label htmlFor={`true-option-${moduleIndex}-${unitIndex}-${questionIndex}`} className="ml-1.5 text-xs text-gray-700">
                                                      True
                                                    </label>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <input type="radio" id={`false-option-${moduleIndex}-${unitIndex}-${questionIndex}`} checked={((question.correctAnswers as Array<number | string>) || []).includes(1)} onChange={() => toggleCorrectAnswer(moduleIndex, unitIndex, questionIndex, 1)} className="focus:ring-indigo-500 h-3.5 w-3.5 text-indigo-600 border-gray-300" />
                                                    <label htmlFor={`false-option-${moduleIndex}-${unitIndex}-${questionIndex}`} className="ml-1.5 text-xs text-gray-700">
                                                      False
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>}
                                            {/* Short answer */}
                                            {question.type === 'short-answer' && <div className="mt-2">
                                                <label htmlFor={`correct-answer-${moduleIndex}-${unitIndex}-${questionIndex}`} className="block text-xs font-medium text-gray-700">
                                                  Sample Correct Answer (for
                                                  grading reference)
                                                </label>
                                                <textarea id={`correct-answer-${moduleIndex}-${unitIndex}-${questionIndex}`} rows={2} placeholder="Enter sample correct answer" value={question.correctAnswers && question.correctAnswers[0] || ''} onChange={e => {
                                    const updatedModules = [...formData.modules];
                                    const unit = updatedModules[moduleIndex].units[unitIndex];
                                    if (!unit.quizConfig) return;
                                    const updatedQuestions = [...unit.quizConfig.questions];
                                    updatedQuestions[questionIndex] = {
                                      ...updatedQuestions[questionIndex],
                                      correctAnswers: [e.target.value]
                                    };
                                    updatedModules[moduleIndex].units[unitIndex] = {
                                      ...unit,
                                      quizConfig: {
                                        ...unit.quizConfig,
                                        questions: updatedQuestions
                                      }
                                    };
                                    setFormData({
                                      ...formData,
                                      modules: updatedModules
                                    });
                                  }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                                <p className="mt-1 text-xs text-gray-500">
                                                  <AlignLeftIcon className="inline h-3 w-3 mr-0.5" />
                                                  Students will enter a written
                                                  response that will be manually
                                                  graded.
                                                </p>
                                              </div>}
                                            {/* Matching type */}
                                            {question.type === 'matching' && <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                  <ListIcon className="inline h-3 w-3 mr-0.5" />
                                                  Students will match items from
                                                  two columns.
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                  Configure matching pairs in
                                                  the detailed question editor.
                                                </p>
                                              </div>}
                                            {/* Fill in the blank */}
                                            {question.type === 'fill-blank' && <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                  <TypeIcon className="inline h-3 w-3 mr-0.5" />
                                                  Students will fill in missing
                                                  words in a sentence.
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                  Use [blank] in your question
                                                  text to indicate blanks.
                                                </p>
                                              </div>}
                                            {/* Code snippet */}
                                            {question.type === 'code' && <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                  <CodeIcon className="inline h-3 w-3 mr-0.5" />
                                                  Students will write or
                                                  complete code snippets.
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                  Configure code environment in
                                                  the detailed question editor.
                                                </p>
                                              </div>}
                                            {/* File upload */}
                                            {question.type === 'file-upload' && <div className="mt-2">
                                                <p className="text-xs text-gray-600 mb-1">
                                                  <UploadCloudIcon className="inline h-3 w-3 mr-0.5" />
                                                  Students will upload files for
                                                  this question.
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                  Configure allowed file types
                                                  in the detailed question
                                                  editor.
                                                </p>
                                              </div>}
                                            {/* Explanation for all question types */}
                                            <div>
                                              <label htmlFor={`explanation-${moduleIndex}-${unitIndex}-${questionIndex}`} className="block text-xs font-medium text-gray-700">
                                                Explanation (shown after
                                                submission)
                                              </label>
                                              <textarea name="explanation" id={`explanation-${moduleIndex}-${unitIndex}-${questionIndex}`} rows={2} value={question.explanation || ''} onChange={e => handleQuizQuestionChange(moduleIndex, unitIndex, questionIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" placeholder="Explain the correct answer" />
                                            </div>
                                          </div>
                                        </div>)}
                                  </div>
                                </div>}
                              {/* Unit-level Media Upload */}
                              <div className="mt-2 mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs font-medium text-gray-700">
                                    Unit Media
                                  </label>
                                  <input type="file" id={`unit-file-upload-${moduleIndex}-${unitIndex}`} onChange={e => handleFileUpload(moduleIndex, e, unitIndex)} className="hidden" accept="*/*" ref={el => {
                              if (!unitFileInputRefs.current[moduleIndex]) {
                                unitFileInputRefs.current[moduleIndex] = [];
                              }
                              unitFileInputRefs.current[moduleIndex][unitIndex] = el;
                            }} />
                                  <button type="button" onClick={() => unitFileInputRefs.current[moduleIndex]?.[unitIndex]?.click()} className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                                    <UploadIcon className="h-2.5 w-2.5 mr-1" />
                                    Upload
                                  </button>
                                </div>
                                {/* Extraction Progress for Unit */}
                                {isExtracting && activeExtractionInfo?.level === 'unit' && activeExtractionInfo.moduleIndex === moduleIndex && activeExtractionInfo.unitIndex === unitIndex && <div className="mt-1 mb-2">
                                      <div className="text-xs text-gray-600 mb-1">
                                        Extracting unit content...{' '}
                                        {extractionProgress}%
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{
                                width: `${extractionProgress}%`
                              }}></div>
                                      </div>
                                    </div>}
                                {/* Display unit media files */}
                                {unit.media && unit.media.length > 0 && <div className="space-y-1 mt-1">
                                    {unit.media.map((media, mediaIndex) => <div key={mediaIndex} className="flex items-center justify-between p-1.5 bg-gray-100 rounded border border-gray-200 text-xs">
                                        <div className="flex items-center">
                                          <div className="mr-1.5">
                                            {media.type.includes('pdf') ? <FileTextIcon className="h-4 w-4 text-red-500" /> : <FileIcon className="h-4 w-4 text-blue-500" />}
                                          </div>
                                          <div>
                                            <div className="text-xs font-medium truncate max-w-[150px]">
                                              {media.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {(media.size / 1024).toFixed(1)}{' '}
                                              KB
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={() => removeMedia(moduleIndex, mediaIndex, unitIndex)} className="text-red-500 hover:text-red-700">
                                          <XIcon className="h-3 w-3" />
                                        </button>
                                      </div>)}
                                  </div>}
                              </div>
                              {/* Show content field only for non-quiz units */}
                              {unit.type !== 'quiz' && <div>
                                  <label htmlFor={`unit-content-${moduleIndex}-${unitIndex}`} className="block text-xs font-medium text-gray-700">
                                    Unit Content
                                  </label>
                                  <textarea name="content" id={`unit-content-${moduleIndex}-${unitIndex}`} required rows={2} value={unit.content} onChange={e => handleUnitChange(moduleIndex, unitIndex, e)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs text-black" />
                                </div>}
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isEdit ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default CourseForm;