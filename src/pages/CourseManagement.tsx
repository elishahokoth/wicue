import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, SearchIcon, UserPlusIcon, ClockIcon, CheckCircle as CheckCircleIcon } from 'lucide-react';
import CourseForm, { CourseFormData } from '../components/CourseForm';
// import AdvancedAnalytics from '../components/AdvancedAnalytics';
import AccessibilityTools from '../components/AccessibilityTools';
// Sample wildlife courses for the review section
const featuredCourses = [{
  id: 'wildlife-1',
  title: 'Introduction to Wildlife',
  description: 'Learn the fundamentals of wildlife biology, ecology, and conservation. This course provides an overview of wildlife species, their habitats, and the challenges they face.',
  thumbnail: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  instructorId: 'instructor-1',
  modules: [{
    id: 'module-1',
    title: 'Wildlife Classification and Taxonomy',
    description: 'Understanding how wildlife species are classified and organized.',
    content: 'This module covers the basics of wildlife taxonomy, including the classification system, scientific naming conventions, and major taxonomic groups of wildlife.',
    isVisible: true
  }, {
    id: 'module-2',
    title: 'Wildlife Habitats and Ecosystems',
    description: 'Exploring the diverse habitats where wildlife species live.',
    content: 'This module examines various wildlife habitats around the world, ecosystem dynamics, and the relationships between wildlife and their environments.',
    isVisible: true
  }],
  enrolledStudents: [],
  enrollmentRequests: []
}, {
  id: 'wildlife-2',
  title: 'Wildlife Ecology',
  description: 'Explore the relationships between wildlife species and their environments. This course covers population dynamics, community interactions, and ecosystem processes.',
  thumbnail: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  instructorId: 'instructor-1',
  modules: [{
    id: 'module-1',
    title: 'Population Dynamics',
    description: 'Understanding how wildlife populations change over time.',
    content: 'This module covers population growth models, limiting factors, carrying capacity, and the dynamics of wildlife populations in changing environments.',
    isVisible: true
  }, {
    id: 'module-2',
    title: 'Community Ecology',
    description: 'Exploring interactions between species within communities.',
    content: 'This module examines the various interactions between species in ecological communities, including competition, predation, parasitism, mutualism, and commensalism.',
    isVisible: true
  }],
  enrolledStudents: [],
  enrollmentRequests: []
}, {
  id: 'wildlife-3',
  title: 'Habitat Management',
  description: 'Learn techniques for managing and restoring wildlife habitats. This course covers habitat assessment, planning, implementation, and monitoring of habitat management projects.',
  thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=725&q=80',
  instructorId: 'instructor-2',
  modules: [{
    id: 'module-1',
    title: 'Habitat Assessment Techniques',
    description: 'Methods for evaluating wildlife habitat quality and suitability.',
    content: 'This module covers various techniques for assessing wildlife habitat, including vegetation sampling, remote sensing, GIS applications, and habitat suitability modeling.',
    isVisible: true
  }, {
    id: 'module-2',
    title: 'Habitat Management Planning',
    description: 'Developing effective plans for habitat management projects.',
    content: 'This module focuses on the process of developing habitat management plans, including setting objectives, stakeholder engagement, resource assessment, and developing management prescriptions.',
    isVisible: true
  }],
  enrolledStudents: [],
  enrollmentRequests: []
}, {
  id: 'wildlife-4',
  title: 'Human-Wildlife Conflict Management',
  description: 'Address the challenges of human-wildlife conflicts and develop strategies for coexistence. This course explores conflict mitigation, community engagement, and policy development.',
  thumbnail: 'https://images.unsplash.com/photo-1581178811376-1c34a5123377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
  instructorId: 'instructor-2',
  modules: [{
    id: 'module-1',
    title: 'Understanding Human-Wildlife Conflicts',
    description: 'Exploring the causes and impacts of conflicts between humans and wildlife.',
    content: 'This module examines the various types of human-wildlife conflicts, their ecological and socioeconomic impacts, and the factors that contribute to conflict situations.',
    isVisible: true
  }, {
    id: 'module-2',
    title: 'Conflict Mitigation Strategies',
    description: 'Techniques and approaches for reducing human-wildlife conflicts.',
    content: 'This module covers various strategies used to mitigate human-wildlife conflicts, including physical barriers, deterrents, land-use planning, compensation schemes, and insurance programs.',
    isVisible: true
  }],
  enrolledStudents: [],
  enrollmentRequests: []
}, {
  id: 'wildlife-5',
  title: 'Bushmanship',
  description: 'Develop essential skills for safely navigating and surviving in wilderness environments. This course covers navigation, tracking, field craft, and emergency survival techniques.',
  thumbnail: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
  instructorId: 'instructor-1',
  modules: [{
    id: 'module-1',
    title: 'Navigation and Orientation',
    description: 'Learn to navigate in wilderness areas using maps, compass, and natural indicators.',
    content: 'This module covers map reading, compass use, celestial navigation, natural navigation indicators, GPS technology, and route planning in wilderness environments.',
    isVisible: true
  }, {
    id: 'module-2',
    title: 'Wildlife Tracking',
    description: 'Techniques for identifying and following wildlife signs in the field.',
    content: 'This module explores the art and science of wildlife tracking, including track identification, gait patterns, sign interpretation, aging tracks, and using tracking for wildlife research and monitoring.',
    isVisible: true
  }],
  enrolledStudents: [],
  enrollmentRequests: []
}];
const CourseManagement = () => {
  const {
    currentUser,
    courses,
    addCourse,
    requestEnrollment
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  // Combine system courses with featured wildlife courses
  const allCourses = [...courses, ...featuredCourses];
  // Filter courses based on user role
  const getFilteredCourses = () => {
  let filteredCourses: any[] = [];
    if (currentUser?.role === 'admin') {
      // Admin can see all courses
      filteredCourses = allCourses;
    } else if (currentUser?.role === 'lecturer') {
      // Lecturers can see courses they created
      filteredCourses = allCourses.filter(course => course.instructorId === currentUser.id);
    } else if (currentUser?.role === 'student') {
      // Students can see all courses for enrollment
      filteredCourses = allCourses;
    }
    // Apply search filter
    if (searchTerm) {
  filteredCourses = filteredCourses.filter((course: any) => course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filteredCourses;
  };
  const handleCreateCourse = (formData: CourseFormData) => {
    if (!currentUser) return;
    // Ensure all modules have an id
    const modulesWithId = formData.modules.map((m, idx) => ({
      ...m,
      id: m.id ?? `module-${Date.now()}-${idx}`
    }));
    addCourse({
      ...formData,
      modules: modulesWithId,
      instructorId: currentUser.id
    });
    setShowForm(false);
  };
  const handleRequestEnrollment = (courseId: string) => {
    if (!currentUser) return;
    requestEnrollment(courseId);
    // Update local state to show pending enrollment immediately
    allCourses.map((course: any) => {
      if (course.id === courseId) {
        return {
          ...course,
          enrollmentRequests: [...(course.enrollmentRequests || []), currentUser.id]
        };
      }
      return course;
    });
  };
  const filteredCourses = getFilteredCourses();
  return <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentUser?.role === 'student' ? 'Available Courses' : 'Course Management'}
          </h1>
          <p className="text-gray-600">
            {currentUser?.role === 'student' ? 'Browse and request enrollment in courses' : 'Create and manage your courses'}
          </p>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'lecturer') && <div className="mt-4 md:mt-0">
            <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>}
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black" placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? filteredCourses.map(course => {
        // Check if student is enrolled or has pending request
        const isEnrolled = course.enrolledStudents?.includes(currentUser?.id);
        const hasPendingRequest = course.enrollmentRequests?.includes(currentUser?.id);
        return <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {course.description.substring(0, 100)}...
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{course.modules.length} modules</span>
                    {currentUser?.role === 'student' && <span className="flex items-center">
                        {isEnrolled ? <span className="flex items-center text-green-600">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Enrolled
                          </span> : hasPendingRequest ? <span className="flex items-center text-yellow-600">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Pending
                          </span> : null}
                      </span>}
                  </div>
                  <div className="mt-6">
                    {currentUser?.role === 'student' && !isEnrolled && !hasPendingRequest ? <div className="flex space-x-2">
                        <button onClick={() => handleRequestEnrollment(course.id)} className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <UserPlusIcon className="h-4 w-4 mr-2" />
                          Request Enrollment
                        </button>
                        <Link to={`/courses/${course.id}`} className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          Details
                        </Link>
                      </div> : <Link to={`/courses/${course.id}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {currentUser?.role === 'student' ? isEnrolled ? 'Access Course' : 'View Details' : 'Manage Course'}
                      </Link>}
                  </div>
                </div>
              </div>;
      }) : <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : currentUser?.role === 'lecturer' ? 'Create your first course to get started' : 'No courses available at this time'}
            </p>
          </div>}
      </div>

      {/* Course Creation Form Modal */}
      {showForm && <CourseForm onSubmit={handleCreateCourse} onCancel={() => setShowForm(false)} />}

      <AccessibilityTools />
    </div>;
};
export default CourseManagement;