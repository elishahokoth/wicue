// User profile related types
export type PrivacySettings = {
  email: 'public' | 'private' | 'connections';
  phone: 'public' | 'private' | 'connections';
  dateOfBirth: 'public' | 'private' | 'connections';
  bio: 'public' | 'private' | 'connections';
  education: 'public' | 'private' | 'connections';
  experience: 'public' | 'private' | 'connections';
  skills: 'public' | 'private' | 'connections';
  interests: 'public' | 'private' | 'connections';
  socialLinks: 'public' | 'private' | 'connections';
};
export type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  description: string;
};
export type Experience = {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
};
export type SocialLink = {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'github' | 'website' | 'other';
  url: string;
  label?: string;
};
export type UserProfile = {
  userId: string;
  profilePicture: string | null;
  coverPhoto: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  location: string | null;
  education: Education[];
  experience: Experience[];
  skills: string[];
  interests: string[];
  socialLinks: SocialLink[];
  privacySettings: PrivacySettings;
};
export type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lecturer' | 'student';
  status?: 'active' | 'pending';
  password?: string;
  profile: UserProfile;
};