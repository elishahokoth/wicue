import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserIcon, KeyIcon, BellIcon, GlobeIcon, ShieldIcon, SaveIcon, CheckIcon, SunIcon, MoonIcon, LeafIcon, MonitorIcon, LogOutIcon, CheckCircleIcon, XCircleIcon, User, Camera, AlertTriangleIcon } from 'lucide-react';
import { UserProfile } from '../types/UserProfile';
type SettingsPageProps = {
  userRole: 'admin' | 'lecturer' | 'student';
};
const SettingsPage = ({
  userRole
}: SettingsPageProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const {
    currentUser,
    logout,
    users,
    restrictUser,
    removeRestriction,
    isUserRestricted
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [saved, setSaved] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Form states
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
    confirmPassword: '',
    notifications: {
      email: true,
      browser: true
    },
    language: 'english',
    theme: theme
  });
  // Helper function to resize image and convert to base64
  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let {
          width,
          height
        } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = height * maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(new Error('Failed to compress image'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };
  // Helper function to safely save to localStorage with error handling
  const safeLocalStorageSet = (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Attempting to clear old data...');
        // Try to clear some space by removing old profile data
        const keys = Object.keys(localStorage);
        const profileKeys = keys.filter(k => k.startsWith('wicue_profile_') && k !== key);
        // Remove oldest profile data (if any)
        if (profileKeys.length > 0) {
          localStorage.removeItem(profileKeys[0]);
          // Try saving again
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (retryError) {
            console.error('Still unable to save after clearing space:', retryError);
            return false;
          }
        }
        return false;
      }
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };
  // Load user profile
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
            // email: currentUser.email || null, // Remove, not in UserProfile type
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
          // Try to save default profile
          const success = safeLocalStorageSet(`wicue_profile_${currentUser.id}`, JSON.stringify(defaultProfile));
          if (!success) {
            setUploadError('Unable to save profile data. Storage may be full.');
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUploadError('Error loading profile data.');
      }
    }
  }, [currentUser]);
  // Update theme in form when theme context changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      theme
    }));
  }, [theme]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Handle language change
    if (name === 'language') {
      setCurrentLanguage(value);
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      checked
    } = e.target;
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked
      }
    });
  };
  const handleThemeChange = (selectedTheme: string) => {
    setFormData({
      ...formData,
      theme: selectedTheme as any
    });
    setTheme(selectedTheme as any);
  };
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Saving settings:', formData);
    // Show success message
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && userProfile) {
      const file = event.target.files[0];
      // Check file size (limit to 5MB before processing)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }
      setIsUploading(true);
      setUploadError(null);
      try {
        // Resize and compress the image
        const compressedImage = await resizeImage(file, 400, 400, 0.7);
        const updatedProfile = {
          ...userProfile,
          profilePicture: compressedImage
        };
        const success = safeLocalStorageSet(`wicue_profile_${currentUser?.id}`, JSON.stringify(updatedProfile));
        if (success) {
          setUserProfile(updatedProfile);
          setUploadError(null);
        } else {
          setUploadError('Unable to save profile picture. Storage quota exceeded. Try using a smaller image.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setUploadError('Failed to process image. Please try a different image.');
      } finally {
        setIsUploading(false);
        // Clear the input value to allow re-uploading the same file
        event.target.value = '';
      }
    }
  };
  const handleCoverPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && userProfile) {
      const file = event.target.files[0];
      // Check file size (limit to 5MB before processing)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }
      setIsUploading(true);
      setUploadError(null);
      try {
        // Resize and compress the image for cover photo
        const compressedImage = await resizeImage(file, 1200, 400, 0.8);
        const updatedProfile = {
          ...userProfile,
          coverPhoto: compressedImage
        };
        const success = safeLocalStorageSet(`wicue_profile_${currentUser?.id}`, JSON.stringify(updatedProfile));
        if (success) {
          setUserProfile(updatedProfile);
          setUploadError(null);
        } else {
          setUploadError('Unable to save cover photo. Storage quota exceeded. Try using a smaller image.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setUploadError('Failed to process image. Please try a different image.');
      } finally {
        setIsUploading(false);
        // Clear the input value to allow re-uploading the same file
        event.target.value = '';
      }
    }
  };
  // const handleSaveProfile = (updatedProfile: UserProfile) => {
  //   const success = safeLocalStorageSet(`wicue_profile_${currentUser?.id}`, JSON.stringify(updatedProfile));
  //   if (success) {
  //     setUserProfile(updatedProfile);
  //     setUploadError(null);
  //   } else {
  //     setUploadError('Unable to save profile changes. Storage quota may be exceeded.');
  //   }
  // };
  const themeOptions = [{
    value: 'light',
    title: 'Light Mode',
    description: 'Clean, bright interface',
    icon: SunIcon,
    bgClass: 'bg-white',
    iconClass: 'text-yellow-500'
  }, {
    value: 'dark',
    title: 'Dark Blue Mode',
    description: 'Easy on the eyes',
    icon: MoonIcon,
    bgClass: 'bg-blue-950',
    iconClass: 'text-blue-400'
  }, {
    value: 'jungle',
    title: 'Jungle Green Mode',
    description: 'Nature-inspired theme',
    icon: LeafIcon,
    bgClass: 'bg-green-900',
    iconClass: 'text-green-400'
  }, {
    value: 'extra-dark',
    title: 'Extra Dark Mode',
    description: 'Pure dark experience',
    icon: MonitorIcon,
    bgClass: 'bg-gray-900',
    iconClass: 'text-gray-400'
  }, {
    value: 'darksacramento',
    title: 'Dark Sacramento Green',
    description: 'Rich dark green tones',
    icon: LeafIcon,
    bgClass: 'bg-green-950',
    iconClass: 'text-green-500'
  }];
  // Language translations
  const translations = {
    english: {
      profile: 'Profile',
      security: 'Security',
      notifications: 'Notifications',
      preferences: 'Preferences',
      system: 'System',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      role: 'Role',
      bio: 'Bio',
      saveSettings: 'Save Settings',
      logout: 'Logout',
      roleCannotBeChanged: 'Your role cannot be changed',
      userAccessManagement: 'User Access Management',
      manageAccess: 'Manage access for all users',
      manageStudentAccess: 'Manage student access to your courses',
      enableAccess: 'Enable Access',
      restrictAccess: 'Restrict Access',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      passwordRequirements: 'Password requirements',
      minimum8Chars: 'Minimum 8 characters',
      atLeastOneUppercase: 'At least one uppercase letter',
      atLeastOneNumber: 'At least one number',
      atLeastOneSpecialChar: 'At least one special character',
      emailNotifications: 'Email Notifications',
      browserNotifications: 'Browser Notifications',
      receiveEmailNotifications: 'Receive email notifications about course updates, enrollment approvals, etc.',
      receiveBrowserNotifications: "Receive browser notifications when you're using the platform.",
      language: 'Language',
      theme: 'Theme',
      systemSettings: 'System Settings',
      settingsAffectEntirePlatform: 'These settings affect the entire platform. Use with caution.',
      maintenanceMode: 'Maintenance Mode',
      enableMaintenanceMode: 'Enable Maintenance Mode',
      whenEnabledOnlyAdmins: 'When enabled, only administrators can access the platform.',
      registrationSettings: 'Registration Settings',
      allowNewRegistrations: 'Allow New Registrations',
      whenDisabledNoNewUsers: 'When disabled, new users cannot register for accounts.',
      dataBackup: 'Data Backup',
      exportPlatformData: 'Export Platform Data',
      downloadsJsonFile: 'Downloads a JSON file with all platform data.',
      profileImages: 'Profile & Cover Photo',
      changeProfilePicture: 'Change Profile Picture',
      changeCoverPhoto: 'Change Cover Photo',
      profilePicture: 'Profile Picture',
      coverPhoto: 'Cover Photo',
      personalInfo: 'Personal Information',
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills & Interests',
      socialLinks: 'Social Links',
      privacySettings: 'Privacy Settings'
    },
    swahili: {
      profile: 'Wasifu',
      security: 'Usalama',
      notifications: 'Arifa',
      preferences: 'Mapendeleo',
      system: 'Mfumo',
      fullName: 'Jina Kamili',
      emailAddress: 'Anwani ya Barua Pepe',
      role: 'Wajibu',
      bio: 'Wasifu',
      saveSettings: 'Hifadhi Mipangilio',
      logout: 'Toka',
      roleCannotBeChanged: 'Wajibu wako hauwezi kubadilishwa',
      userAccessManagement: 'Usimamizi wa Ufikiaji wa Watumiaji',
      manageAccess: 'Simamia ufikiaji kwa watumiaji wote',
      manageStudentAccess: 'Simamia ufikiaji wa wanafunzi kwenye kozi zako',
      enableAccess: 'Wezesha Ufikiaji',
      restrictAccess: 'Zuia Ufikiaji',
      newPassword: 'Nenosiri Jipya',
      confirmNewPassword: 'Thibitisha Nenosiri Jipya',
      passwordRequirements: 'Mahitaji ya nenosiri',
      minimum8Chars: 'Angalau herufi 8',
      atLeastOneUppercase: 'Angalau herufi kubwa moja',
      atLeastOneNumber: 'Angalau namba moja',
      atLeastOneSpecialChar: 'Angalau herufi maalum moja',
      emailNotifications: 'Arifa za Barua Pepe',
      browserNotifications: 'Arifa za Kivinjari',
      receiveEmailNotifications: 'Pokea arifa za barua pepe kuhusu masasisho ya kozi, vidhinisho vya usajili, n.k.',
      receiveBrowserNotifications: 'Pokea arifa za kivinjari unapotumia jukwaa.',
      language: 'Lugha',
      theme: 'Mandhari',
      systemSettings: 'Mipangilio ya Mfumo',
      settingsAffectEntirePlatform: 'Mipangilio hii inaathiri jukwaa zima. Tumia kwa uangalifu.',
      maintenanceMode: 'Hali ya Matengenezo',
      enableMaintenanceMode: 'Wezesha Hali ya Matengenezo',
      whenEnabledOnlyAdmins: 'Inapowezeshwa, wasimamizi pekee ndio wanaweza kufikia jukwaa.',
      registrationSettings: 'Mipangilio ya Usajili',
      allowNewRegistrations: 'Ruhusu Usajili Mpya',
      whenDisabledNoNewUsers: 'Inapozimwa, watumiaji wapya hawawezi kujisajili kwa akaunti.',
      dataBackup: 'Nakala ya Data',
      exportPlatformData: 'Hamisha Data ya Jukwaa',
      downloadsJsonFile: 'Inapakua faili ya JSON yenye data yote ya jukwaa.',
      profileImages: 'Picha ya Wasifu na Jalada',
      changeProfilePicture: 'Badilisha Picha ya Wasifu',
      changeCoverPhoto: 'Badilisha Picha ya Jalada',
      profilePicture: 'Picha ya Wasifu',
      coverPhoto: 'Picha ya Jalada',
      personalInfo: 'Taarifa Binafsi',
      education: 'Elimu',
      experience: 'Uzoefu',
      skills: 'Ujuzi na Mapendeleo',
      socialLinks: 'Viungo vya Mitandao ya Kijamii',
      privacySettings: 'Mipangilio ya Faragha'
    }
  };
  // Get translation based on current language
  const t = (translations as any)[currentLanguage] || translations.english;
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
          {userRole === 'admin' ? 'Manage your account and system settings' : 'Manage your account settings'}
        </p>
      </div>

      {/* Success message */}
      {saved && <div className="mb-6 bg-green-50 dark:bg-green-900/30 jungle:bg-green-900/30 extra-dark:bg-green-900/30 darksacramento:bg-green-900/30 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-300 jungle:text-green-300 extra-dark:text-green-300 darksacramento:text-green-300">
                Your settings have been saved successfully.
              </p>
            </div>
          </div>
        </div>}

      {/* Upload Error message */}
      {uploadError && <div className="mb-6 bg-red-50 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 darksacramento:bg-red-900/30 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 darksacramento:text-red-300">
                {uploadError}
              </p>
            </div>
          </div>
        </div>}

      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 shadow overflow-hidden sm:rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 darksacramento:border-green-800">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 dark:border-blue-500 jungle:border-green-500 extra-dark:border-gray-500 darksacramento:border-green-500' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700 darksacramento:hover:border-green-700'}`}>
              <UserIcon className="h-5 w-5 mx-auto mb-1" />
              {t.profile}
            </button>
            <button onClick={() => setActiveTab('security')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 dark:border-blue-500 jungle:border-green-500 extra-dark:border-gray-500 darksacramento:border-green-500' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700 darksacramento:hover:border-green-700'}`}>
              <KeyIcon className="h-5 w-5 mx-auto mb-1" />
              {t.security}
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-indigo-500 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 dark:border-blue-500 jungle:border-green-500 extra-dark:border-gray-500 darksacramento:border-green-500' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700 darksacramento:hover:border-green-700'}`}>
              <BellIcon className="h-5 w-5 mx-auto mb-1" />
              {t.notifications}
            </button>
            <button onClick={() => setActiveTab('preferences')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'preferences' ? 'border-indigo-500 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 dark:border-blue-500 jungle:border-green-500 extra-dark:border-gray-500 darksacramento:border-green-500' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700 darksacramento:hover:border-green-700'}`}>
              <GlobeIcon className="h-5 w-5 mx-auto mb-1" />
              {t.preferences}
            </button>
            {userRole === 'admin' && <button onClick={() => setActiveTab('system')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'system' ? 'border-indigo-500 text-indigo-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 dark:border-blue-500 jungle:border-green-500 extra-dark:border-gray-500 darksacramento:border-green-500' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700 darksacramento:hover:border-green-700'}`}>
                <ShieldIcon className="h-5 w-5 mx-auto mb-1" />
                {t.system}
              </button>}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          <form onSubmit={handleSaveSettings}>
            {/* Profile Settings */}
            {activeTab === 'profile' && <div className="space-y-6">
                {/* Integrated Profile Section */}
                <div className="relative bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-sm">
                  {/* Cover Photo */}
                  <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-blue-800 dark:to-indigo-900 jungle:from-green-800 jungle:to-teal-900 extra-dark:from-gray-800 extra-dark:to-gray-900 darksacramento:from-green-950 darksacramento:to-green-900 rounded-t-lg relative">
                    {userProfile?.coverPhoto && <img src={userProfile.coverPhoto} alt="Cover" className="w-full h-full object-cover rounded-t-lg" />}
                    <div className="absolute bottom-4 right-4 flex space-x-2">
                      <label htmlFor="cover-photo-upload" className="inline-flex items-center px-3 py-1.5 border border-white bg-white/80 dark:bg-blue-900/80 jungle:bg-green-800/80 extra-dark:bg-gray-800/80 darksacramento:bg-green-900/80 shadow-sm text-sm font-medium rounded-md text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 darksacramento:text-green-200 cursor-pointer hover:bg-white dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 darksacramento:hover:bg-green-900">
                        <Camera className="h-4 w-4 mr-2" />
                        {t.changeCoverPhoto}
                        <input id="cover-photo-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoUpload} />
                      </label>
                    </div>
                  </div>
                  {/* Profile Picture and Basic Info */}
                  <div className="px-6 pt-5 pb-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative -mt-16 mb-4 sm:mb-0 sm:mr-6">
                        <div className="h-24 w-24 rounded-full border-4 border-white dark:border-blue-950 jungle:border-green-900 extra-dark:border-gray-900 darksacramento:border-green-950 bg-gray-200 dark:bg-blue-800 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-800 flex items-center justify-center overflow-hidden">
                          {userProfile?.profilePicture ? <img src={userProfile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400" />}
                        </div>
                        <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 bg-white dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-gray-700 darksacramento:bg-green-700 p-1.5 rounded-full shadow cursor-pointer">
                          <Camera className="h-4 w-4 text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 darksacramento:text-green-200" />
                          <input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                        </label>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-1">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
                            {currentUser?.name}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                            {currentUser?.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 capitalize">
                            {currentUser?.role}
                          </p>
                          {userProfile?.location && <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                              {userProfile.location}
                            </p>}
                        </div>
                        {isUploading && <div className="mt-2 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 darksacramento:border-green-600 mr-2"></div>
                            <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                              Processing image...
                            </p>
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                    {t.fullName}
                  </label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                    {t.emailAddress}
                  </label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                    {t.role}
                  </label>
                  <input type="text" id="role" value={currentUser?.role || ''} disabled className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 bg-gray-50 dark:bg-blue-800 jungle:bg-green-700 extra-dark:bg-gray-700 darksacramento:bg-green-800 text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 sm:text-sm" />
                  <p className="mt-1 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400">
                    {t.roleCannotBeChanged}
                  </p>
                </div>
                {userProfile && <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100 mb-4">
                      {t.personalInfo}
                    </h3>
                    {/* Bio */}
                    <div className="mb-4">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                        {t.bio}
                      </label>
                      <textarea id="bio" name="bio" rows={4} value={userProfile.bio || ''} onChange={e => {
                  const updatedProfile = {
                    ...userProfile,
                    bio: e.target.value
                  };
                  setUserProfile(updatedProfile);
                }} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" placeholder="Tell us about yourself"></textarea>
                    </div>
                    {/* Phone & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                          Phone
                        </label>
                        <input type="tel" id="phone" name="phone" value={userProfile.phone || ''} onChange={e => {
                    const updatedProfile = {
                      ...userProfile,
                      phone: e.target.value
                    };
                    setUserProfile(updatedProfile);
                  }} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                          Location
                        </label>
                        <input type="text" id="location" name="location" value={userProfile.location || ''} onChange={e => {
                    const updatedProfile = {
                      ...userProfile,
                      location: e.target.value
                    };
                    setUserProfile(updatedProfile);
                  }} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" placeholder="Enter your location" />
                      </div>
                    </div>
                    {/* Education & Experience */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100 mb-4">
                        {t.education} & {t.experience}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                        View and edit your complete profile for education and
                        experience details.
                      </p>
                      <button type="button" className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 darksacramento:hover:bg-green-800" onClick={() => navigate('/profile')}>
                        View Complete Profile
                      </button>
                    </div>
                  </div>}
                <div className="mt-4">
                  <button type="button" onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    {t.logout}
                  </button>
                </div>
                {(userRole === 'admin' || userRole === 'lecturer') && <div className="mt-6 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        User Access Management
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        {userRole === 'admin' ? 'Manage access for all users' : 'Manage student access to your courses'}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 dark:border-blue-800 jungle:border-green-800 px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        {users.filter(user => userRole === 'admin' || userRole === 'lecturer' && user.role === 'student').map(user => <div key={user.id} className="flex items-center justify-between py-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  {user.email} • {user.role}
                                </p>
                              </div>
                              <div>
                                {isUserRestricted(user.id) ? <button onClick={() => removeRestriction(user.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Enable Access
                                  </button> : <button onClick={() => restrictUser(user.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Restrict Access
                                  </button>}
                              </div>
                            </div>)}
                      </div>
                    </div>
                  </div>}
              </div>}

            {/* Security Settings */}
            {activeTab === 'security' && <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.newPassword}
                  </label>
                  <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 text-black dark:text-blue-100 jungle:text-green-100" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.confirmNewPassword}
                  </label>
                  <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 text-black dark:text-blue-100 jungle:text-green-100" />
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 jungle:bg-yellow-900/20 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 jungle:text-yellow-300">
                        {t.passwordRequirements}
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 jungle:text-yellow-400">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>{t.minimum8Chars}</li>
                          <li>{t.atLeastOneUppercase}</li>
                          <li>{t.atLeastOneNumber}</li>
                          <li>{t.atLeastOneSpecialChar}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Notification Settings */}
            {activeTab === 'notifications' && <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.emailNotifications}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="email-notifications" name="email" type="checkbox" checked={formData.notifications.email} onChange={handleCheckboxChange} className="focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 h-4 w-4 text-indigo-600 dark:text-blue-500 jungle:text-green-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                          {t.emailNotifications}
                        </label>
                        <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400">
                          {t.receiveEmailNotifications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.browserNotifications}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="browser-notifications" name="browser" type="checkbox" checked={formData.notifications.browser} onChange={handleCheckboxChange} className="focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 h-4 w-4 text-indigo-600 dark:text-blue-500 jungle:text-green-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="browser-notifications" className="font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                          {t.browserNotifications}
                        </label>
                        <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400">
                          {t.receiveBrowserNotifications}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && <div className="space-y-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                    {t.language}
                  </label>
                  <select id="language" name="language" value={formData.language} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-black dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
                    <option value="english">English</option>
                    <option value="swahili">Swahili</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
                    {t.theme}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themeOptions.map(option => {
                  const ThemeIcon = option.icon;
                  const isActive = theme === option.value;
                  return <div key={option.value} className={`relative rounded-lg border-2 p-4 cursor-pointer flex flex-col items-center ${isActive ? option.value === 'light' ? 'border-indigo-500 bg-indigo-50' : option.value === 'dark' ? 'border-blue-500 bg-blue-900/20' : option.value === 'jungle' ? 'border-green-500 bg-green-900/20' : option.value === 'darksacramento' ? 'border-green-600 bg-green-950/20' : 'border-gray-500 bg-gray-900/20' : 'border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700'}`} onClick={() => handleThemeChange(option.value)}>
                          <div className={`w-full h-24 mb-4 ${option.bgClass} border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 darksacramento:border-green-800 rounded-md flex items-center justify-center`}>
                            <ThemeIcon className={`h-12 w-12 ${option.iconClass}`} />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                            {option.title}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 mt-1">
                            {option.description}
                          </p>
                          {formData.theme === option.value && <div className="absolute top-2 right-2">
                              <CheckIcon className={`h-5 w-5 ${option.value === 'light' ? 'text-indigo-600' : option.value === 'dark' ? 'text-blue-500' : option.value === 'jungle' ? 'text-green-500' : option.value === 'darksacramento' ? 'text-green-600' : 'text-gray-500'}`} />
                            </div>}
                        </div>;
                })}
                  </div>
                </div>
              </div>}

            {/* System Settings (Admin Only) */}
            {activeTab === 'system' && userRole === 'admin' && <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-blue-900/30 jungle:bg-green-900/30 p-4 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-blue-300 jungle:text-green-300">
                    {t.systemSettings}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400">
                    {t.settingsAffectEntirePlatform}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-blue-800 jungle:border-green-800 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.maintenanceMode}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="maintenance-mode" name="maintenance" type="checkbox" className="focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 h-4 w-4 text-indigo-600 dark:text-blue-500 jungle:text-green-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="maintenance-mode" className="font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                          {t.enableMaintenanceMode}
                        </label>
                        <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400">
                          {t.whenEnabledOnlyAdmins}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.registrationSettings}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="allow-registration" name="registration" type="checkbox" defaultChecked={true} className="focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 h-4 w-4 text-indigo-600 dark:text-blue-500 jungle:text-green-500 border-gray-300 dark:border-blue-700 jungle:border-green-700 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="allow-registration" className="font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                          {t.allowNewRegistrations}
                        </label>
                        <p className="text-gray-500 dark:text-blue-400 jungle:text-green-400">
                          {t.whenDisabledNoNewUsers}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300">
                    {t.dataBackup}
                  </h3>
                  <div className="mt-2">
                    <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 bg-white dark:bg-blue-900 jungle:bg-green-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
                      {t.exportPlatformData}
                    </button>
                    <p className="mt-1 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400">
                      {t.downloadsJsonFile}
                    </p>
                  </div>
                </div>
              </div>}

            <div className="mt-8 flex justify-end">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-gray-600 darksacramento:bg-green-700 hover:bg-indigo-700 dark:hover:bg-blue-700 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 darksacramento:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500">
                <SaveIcon className="h-4 w-4 mr-2" />
                {t.saveSettings}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default SettingsPage;