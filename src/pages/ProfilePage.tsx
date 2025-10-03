import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Settings, Calendar, BookOpen, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileForm from '../components/profile/ProfileForm';
import { UserProfile } from '../types/UserProfile';

const ProfilePage = () => {
  const {
    currentUser
  } = useAuth();
  useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const storedProfile = localStorage.getItem(`wicue_profile_${currentUser.id}`);
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          // Create a default profile if none exists
          const defaultProfile: UserProfile = {
            userId: currentUser.id,
            profilePicture: null,
            coverPhoto: null,
            phone: null,
            dateOfBirth: null,
            bio: null,
            location: null,
            education: [],
            experience: [],
            skills: [],
            interests: [],
            socialLinks: [],
            privacySettings: {
              email: 'public',
              phone: 'private',
              dateOfBirth: 'private',
              bio: 'public',
              education: 'public',
              experience: 'public',
              skills: 'public',
              interests: 'public',
              socialLinks: 'public'
            }
          };
          setUserProfile(defaultProfile);
          try {
            localStorage.setItem(`wicue_profile_${currentUser.id}`, JSON.stringify(defaultProfile));
          } catch (storageError) {
            console.error('Error saving default profile:', storageError);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    try {
      localStorage.setItem(`wicue_profile_${currentUser?.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes. Storage quota may be exceeded.');
    }
  };
  if (loading) {
    return <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 darksacramento:border-green-600"></div>
      </div>;
  }
  if (error) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 darksacramento:bg-red-900/30 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 darksacramento:text-red-300">
            {error}
          </p>
        </div>
      </div>;
  }
  if (!userProfile) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 jungle:bg-yellow-900/30 extra-dark:bg-yellow-900/30 darksacramento:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 jungle:text-yellow-300 extra-dark:text-yellow-300 darksacramento:text-yellow-300">
            Profile not found. Please set up your profile in settings.
          </p>
          <button onClick={() => navigate(`/${currentUser?.role}/settings?tab=profile`)} className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 darksacramento:bg-green-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 darksacramento:hover:bg-green-600">
            Go to Settings
          </button>
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
          Profile
        </h1>
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/messages`)} className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 darksacramento:hover:bg-green-800">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </button>
          <button onClick={() => navigate(`/${currentUser?.role}/settings?tab=profile`)} className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 darksacramento:hover:bg-green-800">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Form Component */}
      <ProfileForm profile={userProfile} onSave={handleSaveProfile} isOwnProfile={true} />

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 shadow rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500 darksacramento:text-green-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
              Calendar
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-3">
            View your upcoming events and schedule
          </p>
          <button onClick={() => navigate('/calendar')} className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 hover:text-indigo-800 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300 darksacramento:hover:text-green-300 text-sm font-medium">
            View Calendar
          </button>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 shadow rounded-lg p-4">
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500 darksacramento:text-green-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
              Courses
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-3">
            Access your enrolled courses and materials
          </p>
          <button onClick={() => navigate('/courses')} className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 hover:text-indigo-800 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300 darksacramento:hover:text-green-300 text-sm font-medium">
            View Courses
          </button>
        </div>
        <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 shadow rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500 darksacramento:text-green-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
              Achievements
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-3">
            View your grades, certificates, and badges
          </p>
          <button onClick={() => navigate('/student/grades')} className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 hover:text-indigo-800 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300 darksacramento:hover:text-green-300 text-sm font-medium">
            View Achievements
          </button>
        </div>
      </div>
    </div>;
};
export default ProfilePage;