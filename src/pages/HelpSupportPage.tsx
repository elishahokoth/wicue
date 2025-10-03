import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { HelpCircleIcon, BookOpenIcon, MessageSquareIcon, PhoneIcon, FileTextIcon, AlertCircleIcon, CheckCircleIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
const HelpSupportPage = () => {
  const {
    currentUser
  } = useAuth();
  useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqs, setOpenFaqs] = useState([0]); // Default open the first FAQ
  // Toggle FAQ open/closed
  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };
  // FAQ data based on user role
  const getFaqsByRole = () => {
    const commonFaqs = [{
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security and enter your current password followed by your new password. Click "Save Settings" to update your password.'
    }, {
      question: 'How do I send messages to other users?',
      answer: 'Navigate to the Messages section from the main menu. Select a user from the contacts list on the left and type your message in the text field at the bottom of the chat window.'
    }, {
      question: 'How do I change the theme of the platform?',
      answer: 'Click on the theme icon in the top navigation bar to toggle between light and dark modes. You can also go to Settings > Preferences to select from additional theme options including Light, Dark Blue, Jungle Green, and Extra Dark.'
    }, {
      question: 'How do I access my profile information?',
      answer: 'Click on "View profile" in the sidebar or click your profile picture in the top-right corner and select "View Profile" from the dropdown menu.'
    }];
    // Role-specific FAQs
    if (currentUser?.role === 'student') {
      return [...commonFaqs, {
        question: 'How do I enroll in a course?',
        answer: 'Browse the course catalog by clicking on "My Courses" in the navigation menu. Find the course you want to enroll in and click the "Enroll" button on the course details page.'
      }, {
        question: 'How do I track my progress?',
        answer: 'Go to "My Progress" in the navigation menu to see detailed statistics about your course completion, assessment scores, and learning path progress.'
      }, {
        question: 'How do I submit assignments?',
        answer: 'Navigate to the specific module within your course, find the assignment section, and click the "Submit Assignment" button. You can upload files or enter text responses as required.'
      }];
    } else if (currentUser?.role === 'lecturer') {
      return [...commonFaqs, {
        question: 'How do I create a new course?',
        answer: 'Go to "My Courses" and click the "Create New Course" button. Fill in the course details, add modules, and publish when ready.'
      }, {
        question: 'How do I grade student assignments?',
        answer: "Navigate to the course, select the assignment, and you'll see a list of student submissions. Click on each submission to review and assign a grade."
      }, {
        question: 'How do I track student progress?',
        answer: 'Go to "Student Progress" in the navigation menu to see detailed analytics about student engagement, performance, and completion rates.'
      }];
    } else if (currentUser?.role === 'admin') {
      return [...commonFaqs, {
        question: 'How do I add new users to the platform?',
        answer: 'Go to "Users" in the navigation menu and click the "Add User" button. Fill in the user details, assign a role, and save.'
      }, {
        question: 'How do I generate system reports?',
        answer: 'Navigate to "Reports" in the admin dashboard. Select the type of report you want to generate, set the parameters, and click "Generate Report".'
      }, {
        question: 'How do I manage system settings?',
        answer: 'Go to "Settings" in the admin dashboard. Here you can configure global settings, maintenance mode, registration settings, and more.'
      }];
    } else {
      return commonFaqs;
    }
  };
  const faqs = getFaqsByRole();
  // Filter FAQs based on search term
  const filteredFaqs = searchTerm.trim() === '' ? faqs : faqs.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 flex items-center">
          <HelpCircleIcon className="h-7 w-7 mr-2" />
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Find answers to common questions and get support when you need it
        </p>
      </div>
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input type="text" placeholder="Search for help topics..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-400 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
          <div className="absolute left-3 top-2.5">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Help categories */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-4">
              Help Categories
            </h2>
            <nav className="space-y-2">
              <a href="#faqs" className="flex items-center p-2 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                <HelpCircleIcon className="h-5 w-5 mr-3" />
                Frequently Asked Questions
              </a>
              <a href="#tutorials" className="flex items-center p-2 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                <BookOpenIcon className="h-5 w-5 mr-3" />
                Tutorials & Guides
              </a>
              <a href="#contact" className="flex items-center p-2 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                <MessageSquareIcon className="h-5 w-5 mr-3" />
                Contact Support
              </a>
              <a href="#documentation" className="flex items-center p-2 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800">
                <FileTextIcon className="h-5 w-5 mr-3" />
                Documentation
              </a>
            </nav>
          </div>
          {/* Contact support card */}
          <div className="bg-indigo-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-900/30 rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-medium text-indigo-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
              Need more help?
            </h3>
            <p className="text-indigo-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-4">
              Our support team is available to assist you with any questions or
              issues.
            </p>
            <div className="space-y-3">
              <a href="#email" className="flex items-center text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                <MessageSquareIcon className="h-5 w-5 mr-2" />
                support@wicue.edu
              </a>
              <a href="#phone" className="flex items-center text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                <PhoneIcon className="h-5 w-5 mr-2" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="md:col-span-2">
          {/* FAQs section */}
          <div id="faqs" className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            {filteredFaqs.length === 0 ? <div className="flex flex-col items-center justify-center py-8">
                <AlertCircleIcon className="h-12 w-12 text-gray-300 dark:text-blue-700 jungle:text-green-700 extra-dark:text-gray-700 mb-2" />
                <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                  No results found for "{searchTerm}". Try a different search
                  term.
                </p>
              </div> : <div className="space-y-4">
                {filteredFaqs.map((faq, index) => <div key={index} className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md overflow-hidden">
                    <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-4 text-left bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none">
                      <span className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {faq.question}
                      </span>
                      {openFaqs.includes(index) ? <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" /> : <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />}
                    </button>
                    {openFaqs.includes(index) && <div className="p-4 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900">
                        <p className="text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>}
                  </div>)}
              </div>}
          </div>
          {/* Tutorials section */}
          <div id="tutorials" className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-6">
              Tutorials & Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Getting Started Guide
                </h3>
                <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-3">
                  Learn the basics of navigating the platform and setting up
                  your account.
                </p>
                <a href="#" className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:underline">
                  View Guide →
                </a>
              </div>
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Messaging Tutorial
                </h3>
                <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-3">
                  Learn how to communicate with other users through the
                  messaging system.
                </p>
                <a href="#" className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:underline">
                  View Tutorial →
                </a>
              </div>
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Course Navigation
                </h3>
                <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-3">
                  Learn how to navigate courses, modules, and access learning
                  materials.
                </p>
                <a href="#" className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:underline">
                  View Guide →
                </a>
              </div>
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md p-4">
                <h3 className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Assessment Guide
                </h3>
                <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-3">
                  Learn how to take assessments, submit assignments, and view
                  your results.
                </p>
                <a href="#" className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:underline">
                  View Guide →
                </a>
              </div>
            </div>
          </div>
          {/* Contact support section */}
          <div id="contact" className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-6">
              Contact Support
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  Subject
                </label>
                <select id="subject" className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  <option>Technical Issue</option>
                  <option>Account Problem</option>
                  <option>Course Access</option>
                  <option>Billing Question</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  Message
                </label>
                <textarea id="message" rows={4} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" placeholder="Describe your issue or question in detail..."></textarea>
              </div>
              <div>
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-gray-600 hover:bg-indigo-700 dark:hover:bg-blue-700 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500">
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Submit Support Request
                </button>
              </div>
            </form>
            <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              Our support team typically responds within 24 hours on business
              days.
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HelpSupportPage;