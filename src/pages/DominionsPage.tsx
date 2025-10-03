import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, ChevronDown, ChevronRight, UserPlus, Edit2, Trash2, Search, X, Info, Lock } from 'lucide-react';
// Staff member type
type StaffPosition = 'Director' | 'Deputy Director' | 'Head of Department' | 'Senior Manager' | 'Manager' | 'Team Lead' | 'Senior Staff' | 'Staff' | 'Junior Staff' | 'Intern';
type Department = 'Executive' | 'Operations' | 'Research' | 'Conservation' | 'Education' | 'Administration' | 'Finance' | 'Human Resources' | 'IT' | 'Marketing' | 'Wildlife';
type StaffMember = {
  id: string;
  name: string;
  position: StaffPosition;
  department: Department;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  reportsTo: string | null;
  level: number; // Hierarchy level (1 being the highest)
};
// Mock data for staff hierarchy
const mockStaffData: StaffMember[] = [{
  id: 'staff-1',
  name: 'Dr. HOD',
  position: 'Director',
  department: 'Wildlife',
  email: 'hod.wicue@wildlife.org',
  phone: '+254711234567',
  avatar: 'none',
  bio: 'Dr. Hod has over 20 years of experience in wildlife conservation and research. She has led numerous international conservation projects and published extensively in the field.',
  reportsTo: null,
  level: 1
}, {
  id: 'staff-2',
  name: 'Dr. lagat',
  position: 'Deputy Director',
  department: 'Operations',
  email: 'lagat.wicue@wildlife.org',
  phone: '+25452345678',
  avatar: 'none',
  bio: 'Dr. Lagat oversees all operational aspects of the organization. He specializes in habitat restoration and wildlife management systems.',
  reportsTo: 'staff-1',
  level: 2
}, {
  id: 'staff-3',
  name: 'Dr. Waweru',
  position: 'Deputy Director',
  department: 'Research',
  email: 'waweru.wicue@wildlife.org',
  phone: '+254783456789',
  avatar: 'none',
  bio: 'Dr. Waweru leads our research initiatives. She has a PhD in Wildlife Biology and has conducted groundbreaking research on endangered species.',
  reportsTo: 'staff-1',
  level: 2
}, {
  id: 'staff-4',
  name: 'Andrew',
  position: 'Head of Department',
  department: 'Conservation',
  email: 'andrew.wicue@wildlife.org',
  phone: '+254764567890',
  avatar: 'none',
  bio: 'andrew leads our conservation efforts worldwide. He has implemented successful conservation programs in over 15 countries.',
  reportsTo: 'staff-2',
  level: 3
}, {
  id: 'staff-5',
  name: 'Dr. Emily',
  position: 'Head of Department',
  department: 'Education',
  email: 'emily.wicue@wildlife.org',
  phone: '+25473567-8901',
  avatar: 'none',
  bio: 'Dr. emily oversees all educational programs and outreach initiatives. She has developed innovative wildlife education programs for schools and communities.',
  reportsTo: 'staff-2',
  level: 3
}, {
  id: 'staff-6',
  name: 'Dr. David',
  position: 'Senior Manager',
  department: 'Research',
  email: 'david.wicue@wildlife.org',
  phone: '+254716789012',
  avatar: 'none',
  bio: 'Dr.  David specializes in wildlife genetics and population studies. He leads our genomics laboratory and research team.',
  reportsTo: 'staff-3',
  level: 3
}, {
  id: 'staff-7',
  name: 'Jennifer ',
  position: 'Senior Manager',
  department: 'Administration',
  email: 'jennifer.wicue@wildlife.org',
  phone: '+254777890123',
  avatar: 'none',
  bio: 'Jennifer oversees administrative operations and ensures smooth functioning of all departments. She has over 15 years of experience in organizational management.',
  reportsTo: 'staff-2',
  level: 3
}, {
  id: 'staff-8',
  name: 'Carlos ',
  position: 'Manager',
  department: 'Conservation',
  email: 'carlos.wicue@wildlife.org',
  phone: '+254739643634',
  avatar: 'done',
  bio: 'Carlos manages field conservation projects in South America. He specializes in rainforest ecosystems and endangered species protection.',
  reportsTo: 'staff-4',
  level: 4
}, {
  id: 'staff-9',
  name: 'Aisha ',
  position: 'Manager',
  department: 'Education',
  email: 'aisha.wiuce@wildlife.org',
  phone: '+254739012345',
  avatar: 'none',
  bio: 'Aisha develops and implements wildlife education curricula for schools. She has a background in environmental education and curriculum development.',
  reportsTo: 'staff-5',
  level: 4
}, {
  id: 'staff-10',
  name: 'Dr. James Wilson',
  position: 'Team Lead',
  department: 'Research',
  email: 'james.wilson@wildlife.org',
  phone: '+1 (555) 012-3456',
  avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  bio: 'Dr. Wilson leads our field research team. He specializes in wildlife behavior and has conducted extensive research in African savannas.',
  reportsTo: 'staff-6',
  level: 4
}, {
  id: 'staff-11',
  name: 'Maria Rodriguez',
  position: 'Team Lead',
  department: 'Conservation',
  email: 'maria.rodriguez@wildlife.org',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
  bio: 'Maria leads our habitat restoration team. She has successfully implemented restoration projects in degraded ecosystems worldwide.',
  reportsTo: 'staff-8',
  level: 5
}, {
  id: 'staff-12',
  name: 'John Kimani',
  position: 'Senior Staff',
  department: 'Research',
  email: 'john.kimani@wildlife.org',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  bio: 'John is a senior wildlife researcher specializing in large mammal ecology. He has conducted extensive research on elephant populations in East Africa.',
  reportsTo: 'staff-10',
  level: 5
}];
const DominionsPage = () => {
  const {
    currentUser
  } = useAuth();
  const [staffData, setStaffData] = useState<StaffMember[]>(mockStaffData);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepartments, setExpandedDepartments] = useState<Department[]>(['Executive']);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState<Partial<StaffMember>>({
    name: '',
    position: 'Staff',
    department: 'Executive',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    reportsTo: null
  });
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('tree');
  // Only admin can add/edit staff
  const canManageStaff = currentUser?.role === 'admin';
  // Only admin and lecturer can see contact information
  const canViewContactInfo = currentUser?.role === 'admin' || currentUser?.role === 'lecturer';
  // Get all departments from staff data
  const departments = Array.from(new Set(staffData.map(staff => staff.department)));
  // Filter staff by department and search term
  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = searchTerm === '' || staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.position.toLowerCase().includes(searchTerm.toLowerCase()) || staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  // Group staff by department
  const staffByDepartment = departments.reduce((acc, department) => {
    acc[department] = filteredStaff.filter(staff => staff.department === department);
    return acc;
  }, {} as Record<Department, StaffMember[]>);
  // Build hierarchical structure
  const buildHierarchy = (staffList: StaffMember[], parentId: string | null = null): StaffMember[] => {
    return staffList.filter(staff => staff.reportsTo === parentId).sort((a, b) => a.level - b.level);
  };
  // Get top-level staff (directors)
  const topLevelStaff = buildHierarchy(filteredStaff);
  // Toggle department expansion
  const toggleDepartment = (department: Department) => {
    setExpandedDepartments(prev => prev.includes(department) ? prev.filter(d => d !== department) : [...prev, department]);
  };
  // Handle staff selection
  const handleStaffSelect = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };
  // Handle close staff details
  const handleCloseDetails = () => {
    setSelectedStaff(null);
  };
  // Handle add new staff
  const handleAddStaff = () => {
    setIsAddingStaff(true);
    setSelectedStaff(null);
  };
  // Handle save new staff
  const handleSaveNewStaff = () => {
    // Determine level based on position and reports to
    let level = 5; // Default level
    if (newStaffData.position === 'Director') level = 1;else if (newStaffData.position === 'Deputy Director') level = 2;else if (newStaffData.position === 'Head of Department') level = 3;else if (newStaffData.position === 'Senior Manager') level = 3;else if (newStaffData.position === 'Manager') level = 4;else if (newStaffData.position === 'Team Lead') level = 4;else if (newStaffData.position === 'Senior Staff') level = 5;else if (newStaffData.position === 'Staff') level = 6;else if (newStaffData.position === 'Junior Staff') level = 7;else if (newStaffData.position === 'Intern') level = 8;
    // Create new staff member
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffData.name || 'New Staff Member',
      position: newStaffData.position as StaffPosition || 'Staff',
      department: newStaffData.department as Department || 'Administration',
      email: newStaffData.email || '',
      phone: newStaffData.phone || '',
      avatar: newStaffData.avatar || 'https://via.placeholder.com/150',
      bio: newStaffData.bio || '',
  reportsTo: (newStaffData.reportsTo as string | null) ?? null,
      level
    };
    // Add to staff data
    setStaffData([...staffData, newStaff]);
    setIsAddingStaff(false);
    setNewStaffData({
      name: '',
      position: 'Staff',
      department: 'Executive',
      email: '',
      phone: '',
      avatar: '',
      bio: '',
      reportsTo: null
    });
    // Expand the department
    if (!expandedDepartments.includes(newStaff.department as Department)) {
      setExpandedDepartments([...expandedDepartments, newStaff.department as Department]);
    }
  };
  // Handle cancel add staff
  const handleCancelAddStaff = () => {
    setIsAddingStaff(false);
    setNewStaffData({
      name: '',
      position: 'Staff',
      department: 'Executive',
      email: '',
      phone: '',
      avatar: '',
      bio: '',
      reportsTo: null
    });
  };
  // Handle input change for new staff
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewStaffData({
      ...newStaffData,
      [name]: value
    });
  };
  // Render staff hierarchy tree
  const renderStaffTree = (staffList: StaffMember[], parentId: string | null = null, depth = 0) => {
    const children = buildHierarchy(staffList, parentId);
    if (children.length === 0) return null;
    return <ul className={`pl-${depth > 0 ? '6' : '0'} space-y-2`}>
        {children.map(staff => <li key={staff.id} className="relative">
            <div className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 ${selectedStaff?.id === staff.id ? 'bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : ''}`} onClick={() => handleStaffSelect(staff)}>
              <div className="flex-shrink-0 mr-3">
                <div className="relative">
                  <img src={staff.avatar} alt={staff.name} className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-blue-800 jungle:border-green-700 extra-dark:border-gray-700" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-blue-800 jungle:border-green-700 extra-dark:border-gray-700"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 truncate">
                  {staff.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 truncate">
                  {staff.position}
                </p>
              </div>
            </div>
            {renderStaffTree(staffList, staff.id, depth + 1)}
          </li>)}
      </ul>;
  };
  // Render hierarchical tree visualization
  const renderHierarchicalTree = () => {
    return <div className="w-full overflow-x-auto">
        <div className="min-w-max p-8">
          <div className="flex justify-center">
            {topLevelStaff.map(staff => <div key={staff.id} className="flex flex-col items-center">
                <div className={`flex flex-col items-center p-4 mb-8 rounded-lg cursor-pointer ${selectedStaff?.id === staff.id ? 'bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : 'bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900'} shadow-md hover:shadow-lg transition-shadow duration-200`} onClick={() => handleStaffSelect(staff)}>
                  <img src={staff.avatar} alt={staff.name} className="h-16 w-16 rounded-full object-cover border-4 border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500" />
                  <div className="mt-2 text-center">
                    <p className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                      {staff.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      {staff.position}
                    </p>
                  </div>
                </div>
                {/* Draw connecting lines */}
                {buildHierarchy(staffData, staff.id).length > 0 && <div className="w-px h-8 bg-gray-300 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-gray-700"></div>}
                {/* Second level */}
                <div className="flex space-x-12">
                  {buildHierarchy(staffData, staff.id).map(secondLevelStaff => <div key={secondLevelStaff.id} className="flex flex-col items-center">
                        <div className={`flex flex-col items-center p-3 mb-6 rounded-lg cursor-pointer ${selectedStaff?.id === secondLevelStaff.id ? 'bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : 'bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900'} shadow-md hover:shadow-lg transition-shadow duration-200`} onClick={() => handleStaffSelect(secondLevelStaff)}>
                          <img src={secondLevelStaff.avatar} alt={secondLevelStaff.name} className="h-14 w-14 rounded-full object-cover border-4 border-indigo-400 dark:border-blue-400 jungle:border-green-400 extra-dark:border-sky-400" />
                          <div className="mt-2 text-center">
                            <p className="font-medium text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                              {secondLevelStaff.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                              {secondLevelStaff.position}
                            </p>
                          </div>
                        </div>
                        {/* Draw connecting lines */}
                        {buildHierarchy(staffData, secondLevelStaff.id).length > 0 && <div className="w-px h-6 bg-gray-300 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-gray-700"></div>}
                        {/* Third level */}
                        <div className="flex space-x-8">
                          {buildHierarchy(staffData, secondLevelStaff.id).map(thirdLevelStaff => <div key={thirdLevelStaff.id} className="flex flex-col items-center">
                                <div className={`flex flex-col items-center p-2 mb-4 rounded-lg cursor-pointer ${selectedStaff?.id === thirdLevelStaff.id ? 'bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : 'bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900'} shadow-md hover:shadow-lg transition-shadow duration-200`} onClick={() => handleStaffSelect(thirdLevelStaff)}>
                                  <img src={thirdLevelStaff.avatar} alt={thirdLevelStaff.name} className="h-12 w-12 rounded-full object-cover border-3 border-indigo-300 dark:border-blue-300 jungle:border-green-300 extra-dark:border-sky-300" />
                                  <div className="mt-1 text-center">
                                    <p className="font-medium text-xs text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                                      {thirdLevelStaff.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                      {thirdLevelStaff.position}
                                    </p>
                                  </div>
                                </div>
                                {/* We could continue with more levels, but for simplicity we'll stop here */}
                                {buildHierarchy(staffData, thirdLevelStaff.id).length > 0 && <div className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                                    +
                                    {buildHierarchy(staffData, thirdLevelStaff.id).length}{' '}
                                    more
                                  </div>}
                              </div>)}
                        </div>
                      </div>)}
                </div>
              </div>)}
          </div>
        </div>
      </div>;
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
          Staff Dominions
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Explore our organizational structure and staff hierarchy
        </p>
      </div>
      {/* View mode toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" onClick={() => setViewMode('tree')} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'tree' ? 'bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-white' : 'bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700'}`}>
            Hierarchy Tree
          </button>
          <button type="button" onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'list' ? 'bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-white' : 'bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700'}`}>
            Department List
          </button>
        </div>
      </div>
      {/* Tree visualization */}
      {viewMode === 'tree' && <div className="mb-8 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4 overflow-x-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              Organizational Hierarchy
            </h2>
            {canManageStaff && <button onClick={handleAddStaff} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                <UserPlus className="h-4 w-4 mr-1" />
                Add Staff
              </button>}
          </div>
          {renderHierarchicalTree()}
        </div>}
      {/* List and details view */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Staff Tree/List */}
        {viewMode === 'list' && <div className="w-full lg:w-1/3 bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-4">
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 placeholder-gray-500 dark:placeholder-blue-400 jungle:placeholder-green-400 extra-dark:placeholder-gray-400 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Search staff..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                {searchTerm && <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setSearchTerm('')}>
                    <X className="h-4 w-4 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
                  </button>}
              </div>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Organizational Chart
              </h2>
              {canManageStaff && <button onClick={handleAddStaff} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Staff
                </button>}
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              {searchTerm ?
          // Flat list when searching
          <ul className="space-y-2">
                  {filteredStaff.map(staff => <li key={staff.id}>
                      <div className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 ${selectedStaff?.id === staff.id ? 'bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800' : ''}`} onClick={() => handleStaffSelect(staff)}>
                        <div className="flex-shrink-0 mr-3">
                          <img src={staff.avatar} alt={staff.name} className="h-10 w-10 rounded-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            {staff.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            {staff.position} • {staff.department}
                          </p>
                        </div>
                      </div>
                    </li>)}
                </ul> :
          // Hierarchical view by department
          <div className="space-y-4">
                  {departments.map(department => <div key={department} className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-md overflow-hidden">
                      <button className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-left" onClick={() => toggleDepartment(department as Department)}>
                        <span className="font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          {department} Department
                        </span>
                        {expandedDepartments.includes(department as Department) ? <ChevronDown className="h-5 w-5 text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" /> : <ChevronRight className="h-5 w-5 text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300" />}
                      </button>
                      {expandedDepartments.includes(department as Department) && <div className="p-3">
                          {renderStaffTree(staffByDepartment[department as Department] || [])}
                        </div>}
                    </div>)}
                </div>}
            </div>
          </div>}
        {/* Right Panel - Staff Details or Add Staff Form */}
        <div className={`w-full ${viewMode === 'list' ? 'lg:w-2/3' : ''} bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-6`}>
          {isAddingStaff ?
        // Add Staff Form
        <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  Add New Staff Member
                </h2>
                <button onClick={handleCancelAddStaff} className="text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:text-gray-700 dark:hover:text-blue-100 jungle:hover:text-green-100 extra-dark:hover:text-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Full Name
                    </label>
                    <input type="text" id="name" name="name" value={newStaffData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Enter staff name" />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Position
                    </label>
                    <select id="position" name="position" value={newStaffData.position} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm">
                      <option value="Director">Director</option>
                      <option value="Deputy Director">Deputy Director</option>
                      <option value="Head of Department">
                        Head of Department
                      </option>
                      <option value="Senior Manager">Senior Manager</option>
                      <option value="Manager">Manager</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Senior Staff">Senior Staff</option>
                      <option value="Staff">Staff</option>
                      <option value="Junior Staff">Junior Staff</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Department
                    </label>
                    <select id="department" name="department" value={newStaffData.department} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm">
                      {departments.map(dept => <option key={dept} value={dept}>
                          {dept}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reportsTo" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Reports To
                    </label>
                    <select id="reportsTo" name="reportsTo" value={newStaffData.reportsTo || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm">
                      <option value="">None (Top Level)</option>
                      {staffData.map(staff => <option key={staff.id} value={staff.id}>
                          {staff.name} ({staff.position})
                        </option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Email
                    </label>
                    <input type="email" id="email" name="email" value={newStaffData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Enter email address" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Phone
                    </label>
                    <input type="tel" id="phone" name="phone" value={newStaffData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Avatar URL
                    </label>
                    <input type="url" id="avatar" name="avatar" value={newStaffData.avatar} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Enter avatar URL" />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Bio
                    </label>
                    <textarea id="bio" name="bio" value={newStaffData.bio} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Enter staff bio" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={handleCancelAddStaff} className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="button" onClick={handleSaveNewStaff} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                  Add Staff Member
                </button>
              </div>
            </div> : selectedStaff ?
        // Staff Details
        <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  Staff Details
                </h2>
                <button onClick={handleCloseDetails} className="text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 hover:text-gray-700 dark:hover:text-blue-100 jungle:hover:text-green-100 extra-dark:hover:text-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                  <div className="relative">
                    <img src={selectedStaff.avatar} alt={selectedStaff.name} className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-blue-800 jungle:border-green-700 extra-dark:border-gray-700 shadow-md" />
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white dark:border-blue-800 jungle:border-green-700 extra-dark:border-gray-700"></div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                    {selectedStaff.position}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    {canManageStaff && <>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600">
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </button>
                      </>}
                  </div>
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                      Bio
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                      {selectedStaff.bio || 'No bio available.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-2">
                        Department
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedStaff.department}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-2">
                        Reports To
                      </h4>
                      <p className="text-sm text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedStaff.reportsTo ? staffData.find(s => s.id === selectedStaff.reportsTo)?.name || 'Unknown' : 'None (Top Level)'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-2 flex items-center">
                        Email
                        {!canViewContactInfo && <Lock className="h-3.5 w-3.5 ml-1 text-amber-500" />}
                      </h4>
                      {canViewContactInfo ? <a href={`mailto:${selectedStaff.email}`} className="text-sm text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:underline">
                          {selectedStaff.email}
                        </a> : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                          Contact information restricted
                        </p>}
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-2 flex items-center">
                        Phone
                        {!canViewContactInfo && <Lock className="h-3.5 w-3.5 ml-1 text-amber-500" />}
                      </h4>
                      {canViewContactInfo ? <a href={`tel:${selectedStaff.phone}`} className="text-sm text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 hover:underline">
                          {selectedStaff.phone}
                        </a> : <p className="text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 italic">
                          Contact information restricted
                        </p>}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                      Direct Reports
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {staffData.filter(staff => staff.reportsTo === selectedStaff.id).length > 0 ? staffData.filter(staff => staff.reportsTo === selectedStaff.id).map(staff => <div key={staff.id} className="flex items-center p-2 bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700" onClick={() => handleStaffSelect(staff)}>
                              <img src={staff.avatar} alt={staff.name} className="h-8 w-8 rounded-full object-cover mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                                  {staff.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                  {staff.position}
                                </p>
                              </div>
                            </div>) : <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 col-span-2">
                          No direct reports.
                        </p>}
                    </div>
                  </div>
                </div>
              </div>
            </div> :
        // No staff selected
        <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 rounded-full p-6 mb-4">
                <Users className="h-12 w-12 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-2">
                Staff Hierarchy
              </h3>
              <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 text-center max-w-md mb-6">
                {viewMode === 'tree' ? 'The tree above shows the organizational structure. Click on any staff member to view their details.' : 'Select a staff member from the organizational chart to view their details and position in the hierarchy.'}
              </p>
              <div className="flex items-center text-sm text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 p-3 rounded-md">
                <Info className="h-4 w-4 mr-2" />
                <span>
                  {currentUser?.role === 'student' ? 'Note: Contact information is restricted for student accounts.' : 'The staff hierarchy shows the organizational structure by department and reporting relationships.'}
                </span>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default DominionsPage;