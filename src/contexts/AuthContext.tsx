import { useEffect, useState, createContext, useContext } from 'react';
import { mockUsers, mockCourses } from '../data/mockData';
// Define types for our context
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lecturer' | 'student';
  status?: 'active' | 'pending';
  password?: string; // Added to ensure password is available for login
};
type Module = {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  isVisible?: boolean; // Added visibility control
  assessment?: {
    id: string;
    title: string;
    timeLimit: number;
    questions: Array<{
      id: string;
      text: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
};
type Course = {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  modules: Module[];
  enrolledStudents?: string[]; // Added enrolled students
  enrollmentRequests?: string[]; // Added enrollment requests
};
type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  register: (userData: any) => any;
  logout: () => void;
  courses: Course[];
  pendingLecturers: User[]; // Added pending lecturers
  pendingStudents: User[]; // Added pending students
  approveUser: (userId: string) => void; // Added approve user function
  rejectUser: (userId: string) => void; // Added reject user function
  requestEnrollment: (courseId: string) => void; // Added enrollment request
  approveEnrollment: (courseId: string, studentId: string) => void; // Added approve enrollment
  rejectEnrollment: (courseId: string, studentId: string) => void; // Added reject enrollment
  toggleModuleVisibility: (courseId: string, moduleId: string) => void; // Added toggle module visibility
  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, courseData: Partial<Course>) => Course | null;
  deleteCourse: (id: string) => boolean;
  users: User[]; // Added users list
  restrictUser: (userId: string) => void;
  removeRestriction: (userId: string) => void;
  isUserRestricted: (userId: string) => boolean;
};
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('wicue_users');
      console.log('Loading users from localStorage:', storedUsers ? JSON.parse(storedUsers).length : 0, 'users found');
      return storedUsers ? JSON.parse(storedUsers) : mockUsers;
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      return mockUsers;
    }
  });
  const [restrictedUsers, setRestrictedUsers] = useState<string[]>(() => {
    const storedRestrictions = localStorage.getItem('wicue_restricted_users');
    return storedRestrictions ? JSON.parse(storedRestrictions) : [];
  });
  const [courses, setCourses] = useState<Course[]>(() => {
    const storedCourses = localStorage.getItem('wicue_courses');
    return storedCourses ? JSON.parse(storedCourses) : mockCourses.map(course => ({
      ...course,
      enrolledStudents: [],
      enrollmentRequests: [],
      modules: course.modules.map(module => ({
        ...module,
        isVisible: true
      }))
    }));
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      console.log('Saving users to localStorage:', users.length, 'users');
      localStorage.setItem('wicue_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }, [users]);
  useEffect(() => {
    localStorage.setItem('wicue_courses', JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem('wicue_restricted_users', JSON.stringify(restrictedUsers));
  }, [restrictedUsers]);
  useEffect(() => {
    const storedUser = localStorage.getItem('wicue_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  // Get pending lecturer requests
  const pendingLecturers = users.filter(user => user.role === 'lecturer' && user.status === 'pending');
  // Get pending student requests
  const pendingStudents = users.filter(user => user.role === 'student' && user.status === 'pending');
  // Restrict a user from accessing the system
  const restrictUser = (userId: string) => {
    setRestrictedUsers(prev => [...prev, userId]);
  };
  // Remove restriction from a user
  const removeRestriction = (userId: string) => {
    setRestrictedUsers(prev => prev.filter(id => id !== userId));
  };
  // Check if a user is restricted
  const isUserRestricted = (userId: string) => {
    return restrictedUsers.includes(userId);
  };
  const login = (email: string, password: string) => {
    // In a real app, this would be an API call
    console.log('Attempting login with:', email);
    console.log('Available users:', users.map(u => u.email));
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      // Don't allow pending users to log in
      if (user.status === 'pending') {
        console.log('Login failed: User status is pending');
        return null;
      }
      const {
        password,
        ...userWithoutPassword
      } = user;
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('wicue_user', JSON.stringify(userWithoutPassword));
      console.log('Login successful for:', userWithoutPassword.name);
      return userWithoutPassword as User;
    }
    console.log('Login failed: User not found or password incorrect');
    return null;
  };
  const register = (userData: any) => {
    // In a real app, this would be an API call
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      // Set status based on role - now both students and lecturers need approval
      status: userData.role === 'admin' ? 'active' : 'pending'
    };
    // Add the new user to our users array
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers, newUser];
      console.log('User registered:', newUser.email, 'Total users:', updatedUsers.length);
      return updatedUsers;
    });
    return newUser;
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wicue_user');
  };
  // Approve a pending user (lecturer or student)
  const approveUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => user.id === userId ? {
      ...user,
      status: 'active' as const
    } : user));
    console.log(`User ${userId} approved`);
  };
  // Reject a pending user
  const rejectUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    console.log(`User ${userId} rejected`);
  };
  // Request enrollment in a course
  const requestEnrollment = (courseId: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    setCourses(prevCourses => prevCourses.map(course => course.id === courseId ? {
      ...course,
      enrollmentRequests: [...(course.enrollmentRequests || []), currentUser.id]
    } : course));
  };
  // Approve student enrollment
  const approveEnrollment = (courseId: string, studentId: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          enrolledStudents: [...(course.enrolledStudents || []), studentId],
          enrollmentRequests: (course.enrollmentRequests || []).filter(id => id !== studentId)
        };
      }
      return course;
    }));
  };
  // Reject student enrollment
  const rejectEnrollment = (courseId: string, studentId: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          enrollmentRequests: (course.enrollmentRequests || []).filter(id => id !== studentId)
        };
      }
      return course;
    }));
  };
  // Toggle module visibility
  const toggleModuleVisibility = (courseId: string, moduleId: string) => {
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: course.modules.map(module => module.id === moduleId ? {
            ...module,
            isVisible: !module.isVisible
          } : module)
        };
      }
      return course;
    }));
  };
  // Course management functions
  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      enrolledStudents: [],
      enrollmentRequests: [],
      modules: courseData.modules.map((module, index) => ({
        ...module,
        id: `module-${Date.now()}-${index}`,
        isVisible: true,
        videoUrl: module.videoUrl || `https://example.com/videos/${module.title.toLowerCase().replace(/\s+/g, '-')}`
      }))
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
    return newCourse;
  };
  const updateCourse = (id: string, courseData: Partial<Course>) => {
    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;
    const updatedCourse = {
      ...courses[courseIndex],
      ...courseData,
      // If updating modules, ensure they all have IDs and visibility property
      modules: courseData.modules ? courseData.modules.map((module, index) => ({
        ...module,
        id: module.id || `module-${Date.now()}-${index}`,
        isVisible: module.isVisible !== undefined ? module.isVisible : true,
        videoUrl: module.videoUrl || `https://example.com/videos/${module.title.toLowerCase().replace(/\s+/g, '-')}`
      })) : courses[courseIndex].modules
    };
    setCourses(prevCourses => {
      const updatedCourses = [...prevCourses];
      updatedCourses[courseIndex] = updatedCourse;
      return updatedCourses;
    });
    return updatedCourse;
  };
  const deleteCourse = (id: string) => {
    const courseIndex = courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return false;
    setCourses(prevCourses => {
      const updatedCourses = [...prevCourses];
      updatedCourses.splice(courseIndex, 1);
      return updatedCourses;
    });
    return true;
  };
  const value = {
    currentUser,
    login,
    register,
    logout,
    courses,
    pendingLecturers,
    pendingStudents,
    approveUser,
    rejectUser,
    requestEnrollment,
    approveEnrollment,
    rejectEnrollment,
    toggleModuleVisibility,
    addCourse,
    updateCourse,
    deleteCourse,
    users,
    restrictUser,
    removeRestriction,
    isUserRestricted,
    restrictedUsers
  };
  return <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>;
};