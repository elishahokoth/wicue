import React, { useState, useRef } from 'react';
import { UserProfile, PrivacySettings } from '../../types/UserProfile';
import { User, Phone, Mail, Calendar, MapPin, FileText, Book, Briefcase, Award, Heart, Link, Upload, Camera, Globe, Lock, Users, Eye, EyeOff } from 'lucide-react';
type ProfileFormProps = {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOwnProfile: boolean;
};
const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  isOwnProfile
}) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isEditing, setIsEditing] = useState(false);
  // Add file input refs
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  // Add handlers for file uploads
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && event.target.result) {
          setEditedProfile(prev => ({
            ...prev,
            profilePicture: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && event.target.result) {
          setEditedProfile(prev => ({
            ...prev,
            coverPhoto: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePrivacyChange = (field: keyof PrivacySettings, value: 'public' | 'private' | 'connections') => {
    setEditedProfile(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [field]: value
      }
    }));
  };
  const handleAddEducation = () => {
    const newEducation = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: null,
      description: ''
    };
    setEditedProfile(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };
  const handleEducationChange = (id: string, field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? {
        ...edu,
        [field]: value
      } : edu)
    }));
  };
  const handleRemoveEducation = (id: string) => {
    setEditedProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  const handleAddExperience = () => {
    const newExperience = {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: null,
      description: ''
    };
    setEditedProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };
  const handleExperienceChange = (id: string, field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? {
        ...exp,
        [field]: value
      } : exp)
    }));
  };
  const handleRemoveExperience = (id: string) => {
    setEditedProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !editedProfile.skills.includes(skill.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };
  const handleRemoveSkill = (skill: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  const handleAddInterest = (interest: string) => {
    if (interest.trim() && !editedProfile.interests.includes(interest.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };
  const handleRemoveInterest = (interest: string) => {
    setEditedProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };
  const handleAddSocialLink = () => {
    const newLink = {
      platform: 'linkedin' as const,
      url: '',
      label: ''
    };
    setEditedProfile(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => i === index ? {
        ...link,
        [field]: value
      } : link)
    }));
  };
  const handleRemoveSocialLink = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };
  const handleSave = () => {
    onSave(editedProfile);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };
  // Function to render privacy settings selector
  const renderPrivacySelector = (field: keyof PrivacySettings) => {
    const currentSetting = editedProfile.privacySettings[field];
    return <select value={currentSetting} onChange={e => handlePrivacyChange(field, e.target.value as any)} className="ml-2 text-xs border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md">
        <option value="public">Public</option>
        <option value="connections">Connections Only</option>
        <option value="private">Private</option>
      </select>;
  };
  // Only allow editing if it's the user's own profile
  const canEdit = isOwnProfile;
  return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 shadow rounded-lg">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-blue-800 dark:to-indigo-900 jungle:from-green-800 jungle:to-teal-900 extra-dark:from-gray-800 extra-dark:to-gray-900 rounded-t-lg">
          {editedProfile.coverPhoto && <img src={editedProfile.coverPhoto} alt="Cover" className="w-full h-full object-cover rounded-t-lg" />}
          {isEditing && <>
              <input ref={coverPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoChange} />
              <button className="absolute top-2 right-2 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-1.5 rounded-full shadow" onClick={() => coverPhotoInputRef.current?.click()}>
                <Camera className="h-4 w-4 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" />
              </button>
            </>}
        </div>
        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-4">
          <div className="h-24 w-24 rounded-full border-4 border-white dark:border-blue-950 jungle:border-green-900 extra-dark:border-gray-900 bg-gray-200 dark:bg-blue-800 jungle:bg-green-800 extra-dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {editedProfile.profilePicture ? <img src={editedProfile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />}
          </div>
          {isEditing && <>
              <input ref={profilePictureInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
              <button className="absolute bottom-0 right-0 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-1.5 rounded-full shadow" onClick={() => profilePictureInputRef.current?.click()}>
                <Camera className="h-4 w-4 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" />
              </button>
            </>}
        </div>
        {/* Edit Button */}
        {canEdit && !isEditing && <button onClick={() => setIsEditing(true)} className="absolute top-2 right-2 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-3 py-1.5 rounded-md shadow text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
            Edit Profile
          </button>}
      </div>
      {/* Profile Content */}
      <div className="pt-16 px-4 pb-4">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('basic')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'basic' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
              Basic Info
            </button>
            <button onClick={() => setActiveTab('education')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'education' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
              Education & Experience
            </button>
            <button onClick={() => setActiveTab('skills')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
              Skills & Interests
            </button>
            <button onClick={() => setActiveTab('social')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'social' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
              Social Links
            </button>
            {isOwnProfile && <button onClick={() => setActiveTab('privacy')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'privacy' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
                Privacy
              </button>}
          </nav>
        </div>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Phone
                  </span>
                  {!isEditing && editedProfile.privacySettings.phone !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                        {editedProfile.privacySettings.phone === 'private' ? <>
                            <Lock className="h-3 w-3 mr-1" /> Private
                          </> : <>
                            <Users className="h-3 w-3 mr-1" /> Connections Only
                          </>}
                      </div>}
                </div>
                {isEditing ? <div className="mt-1 flex items-center">
                    <input type="tel" name="phone" value={editedProfile.phone || ''} onChange={handleInputChange} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm text-black dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" placeholder="Enter your phone number" />
                    {renderPrivacySelector('phone')}
                  </div> : <p className="mt-1 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {editedProfile.phone || 'Not provided'}
                  </p>}
              </div>
              <div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Email
                  </span>
                  {!isEditing && editedProfile.privacySettings.email !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                        {editedProfile.privacySettings.email === 'private' ? <>
                            <Lock className="h-3 w-3 mr-1" /> Private
                          </> : <>
                            <Users className="h-3 w-3 mr-1" /> Connections Only
                          </>}
                      </div>}
                </div>
                {isEditing ? <div className="mt-1 flex items-center">
                    <input type="email" name="email" value={editedProfile.email || ''} onChange={handleInputChange} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm text-black dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" placeholder="Enter your email" />
                    {renderPrivacySelector('email')}
                  </div> : <p className="mt-1 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {editedProfile.email || 'Not provided'}
                  </p>}
              </div>
              <div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Date of Birth
                  </span>
                  {!isEditing && editedProfile.privacySettings.dateOfBirth !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                        {editedProfile.privacySettings.dateOfBirth === 'private' ? <>
                            <Lock className="h-3 w-3 mr-1" /> Private
                          </> : <>
                            <Users className="h-3 w-3 mr-1" /> Connections Only
                          </>}
                      </div>}
                </div>
                {isEditing ? <div className="mt-1 flex items-center">
                    <input type="date" name="dateOfBirth" value={editedProfile.dateOfBirth || ''} onChange={handleInputChange} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm text-black dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" />
                    {renderPrivacySelector('dateOfBirth')}
                  </div> : <p className="mt-1 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {editedProfile.dateOfBirth || 'Not provided'}
                  </p>}
              </div>
              <div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    Location
                  </span>
                </div>
                {isEditing ? <input type="text" name="location" value={editedProfile.location || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm text-black dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" placeholder="Enter your location" /> : <p className="mt-1 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                    {editedProfile.location || 'Not provided'}
                  </p>}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  Bio
                </span>
                {!isEditing && editedProfile.privacySettings.bio !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                      {editedProfile.privacySettings.bio === 'private' ? <>
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </> : <>
                          <Users className="h-3 w-3 mr-1" /> Connections Only
                        </>}
                    </div>}
              </div>
              {isEditing ? <div className="mt-1 flex flex-col">
                  <textarea name="bio" value={editedProfile.bio || ''} onChange={handleInputChange} rows={4} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm text-black dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200" placeholder="Tell us about yourself" />
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2">
                      Who can see this:
                    </span>
                    {renderPrivacySelector('bio')}
                  </div>
                </div> : <p className="mt-1 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 whitespace-pre-line">
                  {editedProfile.bio || 'No bio provided'}
                </p>}
            </div>
          </div>}
        {/* Education & Experience Tab */}
        {activeTab === 'education' && <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 flex items-center">
                  <Book className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
                  Education
                </h3>
                {isEditing && <button type="button" onClick={handleAddEducation} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                    Add Education
                  </button>}
              </div>
              {editedProfile.education.length > 0 ? <div className="space-y-4">
                  {editedProfile.education.map(edu => <div key={edu.id} className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-4">
                      {isEditing ? <div className="space-y-3">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                              Education Details
                            </h4>
                            <button type="button" onClick={() => handleRemoveEducation(edu.id)} className="text-red-600 hover:text-red-800 text-xs">
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Institution
                              </label>
                              <input type="text" value={edu.institution} onChange={e => handleEducationChange(edu.id, 'institution', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Degree
                              </label>
                              <input type="text" value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Field of Study
                              </label>
                              <input type="text" value={edu.fieldOfStudy} onChange={e => handleEducationChange(edu.id, 'fieldOfStudy', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  Start Date
                                </label>
                                <input type="date" value={edu.startDate} onChange={e => handleEducationChange(edu.id, 'startDate', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  End Date
                                </label>
                                <input type="date" value={edu.endDate || ''} onChange={e => handleEducationChange(edu.id, 'endDate', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                              Description
                            </label>
                            <textarea value={edu.description} onChange={e => handleEducationChange(edu.id, 'description', e.target.value)} rows={2} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                          </div>
                        </div> : <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {edu.degree} in {edu.fieldOfStudy}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            {edu.institution}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            {edu.startDate} - {edu.endDate || 'Present'}
                          </p>
                          {edu.description && <p className="mt-2 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                              {edu.description}
                            </p>}
                        </div>}
                    </div>)}
                </div> : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                  No education information added yet.
                </p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
                  Experience
                </h3>
                {isEditing && <button type="button" onClick={handleAddExperience} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                    Add Experience
                  </button>}
              </div>
              {editedProfile.experience.length > 0 ? <div className="space-y-4">
                  {editedProfile.experience.map(exp => <div key={exp.id} className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-4">
                      {isEditing ? <div className="space-y-3">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                              Experience Details
                            </h4>
                            <button type="button" onClick={() => handleRemoveExperience(exp.id)} className="text-red-600 hover:text-red-800 text-xs">
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Position
                              </label>
                              <input type="text" value={exp.position} onChange={e => handleExperienceChange(exp.id, 'position', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Company
                              </label>
                              <input type="text" value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                Location
                              </label>
                              <input type="text" value={exp.location} onChange={e => handleExperienceChange(exp.id, 'location', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  Start Date
                                </label>
                                <input type="date" value={exp.startDate} onChange={e => handleExperienceChange(exp.id, 'startDate', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  End Date
                                </label>
                                <input type="date" value={exp.endDate || ''} onChange={e => handleExperienceChange(exp.id, 'endDate', e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                              Description
                            </label>
                            <textarea value={exp.description} onChange={e => handleExperienceChange(exp.id, 'description', e.target.value)} rows={2} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                          </div>
                        </div> : <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {exp.position}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            {exp.company} • {exp.location}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </p>
                          {exp.description && <p className="mt-2 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                              {exp.description}
                            </p>}
                        </div>}
                    </div>)}
                </div> : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                  No experience information added yet.
                </p>}
            </div>
          </div>}
        {/* Skills & Interests Tab */}
        {activeTab === 'skills' && <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  Skills
                </h3>
                {!isEditing && editedProfile.privacySettings.skills !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                      {editedProfile.privacySettings.skills === 'private' ? <>
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </> : <>
                          <Users className="h-3 w-3 mr-1" /> Connections Only
                        </>}
                    </div>}
              </div>
              {isEditing ? <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input type="text" id="new-skill" placeholder="Add a skill..." className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleAddSkill(input.value);
                  input.value = '';
                }
              }} />
                    <button type="button" onClick={() => {
                const input = document.getElementById('new-skill') as HTMLInputElement;
                handleAddSkill(input.value);
                input.value = '';
              }} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2">
                      Who can see this:
                    </span>
                    {renderPrivacySelector('skills')}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editedProfile.skills.map(skill => <div key={skill} className="bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                        <span className="text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                          {skill}
                        </span>
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-blue-400 dark:hover:text-blue-300 jungle:text-green-400 jungle:hover:text-green-300 extra-dark:text-gray-400 extra-dark:hover:text-gray-300">
                          &times;
                        </button>
                      </div>)}
                  </div>
                </div> : <div className="flex flex-wrap gap-2">
                  {editedProfile.skills.length > 0 ? editedProfile.skills.map(skill => <span key={skill} className="bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                        {skill}
                      </span>) : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                      No skills added yet.
                    </p>}
                </div>}
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  Interests
                </h3>
                {!isEditing && editedProfile.privacySettings.interests !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                      {editedProfile.privacySettings.interests === 'private' ? <>
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </> : <>
                          <Users className="h-3 w-3 mr-1" /> Connections Only
                        </>}
                    </div>}
              </div>
              {isEditing ? <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input type="text" id="new-interest" placeholder="Add an interest..." className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleAddInterest(input.value);
                  input.value = '';
                }
              }} />
                    <button type="button" onClick={() => {
                const input = document.getElementById('new-interest') as HTMLInputElement;
                handleAddInterest(input.value);
                input.value = '';
              }} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2">
                      Who can see this:
                    </span>
                    {renderPrivacySelector('interests')}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editedProfile.interests.map(interest => <div key={interest} className="bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                        <span className="text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                          {interest}
                        </span>
                        <button type="button" onClick={() => handleRemoveInterest(interest)} className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-blue-400 dark:hover:text-blue-300 jungle:text-green-400 jungle:hover:text-green-300 extra-dark:text-gray-400 extra-dark:hover:text-gray-300">
                          &times;
                        </button>
                      </div>)}
                  </div>
                </div> : <div className="flex flex-wrap gap-2">
                  {editedProfile.interests.length > 0 ? editedProfile.interests.map(interest => <span key={interest} className="bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                        {interest}
                      </span>) : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                      No interests added yet.
                    </p>}
                </div>}
            </div>
          </div>}
        {/* Social Links Tab */}
        {activeTab === 'social' && <div>
            <div className="flex items-center mb-4">
              <Link className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Social Links
              </h3>
              {!isEditing && editedProfile.privacySettings.socialLinks !== 'public' && <div className="ml-2 text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 flex items-center">
                    {editedProfile.privacySettings.socialLinks === 'private' ? <>
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </> : <>
                        <Users className="h-3 w-3 mr-1" /> Connections Only
                      </>}
                  </div>}
            </div>
            {isEditing ? <div>
                <div className="space-y-3">
                  {editedProfile.socialLinks.map((link, index) => <div key={index} className="flex items-center space-x-2">
                      <select value={link.platform} onChange={e => handleSocialLinkChange(index, 'platform', e.target.value)} className="block w-1/4 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm">
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="github">GitHub</option>
                        <option value="website">Website</option>
                        <option value="other">Other</option>
                      </select>
                      {link.platform === 'other' && <input type="text" value={link.label || ''} onChange={e => handleSocialLinkChange(index, 'label', e.target.value)} placeholder="Label" className="block w-1/4 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />}
                      <input type="url" value={link.url} onChange={e => handleSocialLinkChange(index, 'url', e.target.value)} placeholder="URL" className="block flex-1 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-sm" />
                      <button type="button" onClick={() => handleRemoveSocialLink(index)} className="text-red-600 hover:text-red-800">
                        &times;
                      </button>
                    </div>)}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button type="button" onClick={handleAddSocialLink} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                    Add Social Link
                  </button>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2">
                      Who can see this:
                    </span>
                    {renderPrivacySelector('socialLinks')}
                  </div>
                </div>
              </div> : <div className="space-y-2">
                {editedProfile.socialLinks.length > 0 ? editedProfile.socialLinks.map((link, index) => <div key={index} className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:underline text-sm">
                        {link.platform === 'other' && link.label ? link.label : link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                      </a>
                    </div>) : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                    No social links added yet.
                  </p>}
              </div>}
          </div>}
        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && isOwnProfile && <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 flex items-center mb-4">
              <Lock className="h-5 w-5 mr-2 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
              Privacy Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-4">
              Control who can see your profile information.
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                  Information Visibility
                </h4>
                <div className="space-y-3">
                  {Object.entries(editedProfile.privacySettings).map(([field, value]) => <div key={field} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => handlePrivacyChange(field as keyof PrivacySettings, 'public')} className={`px-2 py-1 text-xs rounded-md ${value === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                            <Globe className="h-3 w-3 inline mr-1" />
                            Public
                          </button>
                          <button type="button" onClick={() => handlePrivacyChange(field as keyof PrivacySettings, 'connections')} className={`px-2 py-1 text-xs rounded-md ${value === 'connections' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                            <Users className="h-3 w-3 inline mr-1" />
                            Connections
                          </button>
                          <button type="button" onClick={() => handlePrivacyChange(field as keyof PrivacySettings, 'private')} className={`px-2 py-1 text-xs rounded-md ${value === 'private' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                            <Lock className="h-3 w-3 inline mr-1" />
                            Private
                          </button>
                        </div>
                      </div>)}
                </div>
              </div>
              <div className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2 flex items-center">
                  <Eye className="h-4 w-4 mr-1.5 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500" />
                  Profile Preview
                </h4>
                <p className="text-xs text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-3">
                  This is how your profile appears to others based on your
                  privacy settings.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Public: Your name and profile picture
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Connections:
                      {Object.entries(editedProfile.privacySettings).filter(([_, value]) => value === 'connections').map(([field]) => ` ${field.replace(/([A-Z])/g, ' $1').trim()}`).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <EyeOff className="h-3.5 w-3.5 mr-1.5 text-red-600 dark:text-red-400" />
                    <span className="text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Private:
                      {Object.entries(editedProfile.privacySettings).filter(([_, value]) => value === 'private').map(([field]) => ` ${field.replace(/([A-Z])/g, ' $1').trim()}`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {/* Edit/Save Buttons */}
        {isEditing && <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
              Save Changes
            </button>
          </div>}
      </div>
    </div>;
};
export default ProfileForm;