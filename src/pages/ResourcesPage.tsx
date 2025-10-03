import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon, FileTextIcon, DownloadIcon, SearchIcon, FilterIcon, StarIcon, ClockIcon, ShareIcon, BookmarkIcon, XIcon, LeafIcon, UploadIcon, FileIcon, Loader2Icon, CheckIcon, AlertCircleIcon } from 'lucide-react';
// Add resource upload types
type ResourceType = 'guidebook' | 'textbook' | 'journal' | 'article' | 'report';
type ResourceCategory = 'mammals' | 'birds' | 'herps' | 'fish' | 'insects' | 'flora' | 'marine' | 'conservation' | 'other';
// ...existing code...
// Resource interface
interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: ResourceCategory;
  author: string;
  description: string;
  thumbnail: string;
  url: string;
  fileSize?: string;
  fileFormat?: string;
  pages?: number;
  readTime?: string;
  publishedDate: string;
  rating: number;
  reviewCount: number;
  popular?: boolean;
  new?: boolean;
  uploadedBy?: string;
}
const ResourcesPage = () => {
  const {
    currentUser
  } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('newest'); // Default sorting: newest to oldest
  // Resource upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState({
    title: '',
    author: '',
    type: 'article' as ResourceType,
    category: 'other' as ResourceCategory,
    description: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Simulate API call to get resources
    const fetchResources = () => {
      setLoading(true);
      // In a real app, this would be an API call
      // Mock wildlife resources data
      const mockWildlifeResources = [
      // Field Guides - Mammals
      {
        id: 'r1',
        title: 'A Field Guide to African Mammals',
        type: 'guidebook',
        category: 'mammals',
        author: 'Jonathan Kingdon',
        description: 'Comprehensive guide covering over 1,100 species of African mammals with detailed illustrations and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '24.8 MB',
        fileFormat: 'PDF',
        pages: 488,
        publishedDate: '2023-01-15',
        rating: 4.8,
        reviewCount: 324,
        popular: true,
        new: true
      }, {
        id: 'r2',
        title: 'Mammals of North America: Field Guide',
        type: 'guidebook',
        category: 'mammals',
        author: 'Roland W. Kays & Don E. Wilson',
        description: 'Detailed field guide to all mammals found in North America, featuring range maps, physical descriptions, and behavioral information.',
        thumbnail: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '18.5 MB',
        fileFormat: 'PDF',
        pages: 362,
        publishedDate: '2022-09-20',
        rating: 4.7,
        reviewCount: 218,
        popular: true,
        new: false
      },
      // Field Guides - Birds
      {
        id: 'r3',
        title: 'The Sibley Guide to Birds',
        type: 'guidebook',
        category: 'birds',
        author: 'David Allen Sibley',
        description: 'Comprehensive guide to North American birds with over 6,600 detailed illustrations showing different plumages and subspecies.',
        thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=725&q=80',
        url: '#',
        fileSize: '32.4 MB',
        fileFormat: 'PDF',
        pages: 624,
        publishedDate: '2021-11-05',
        rating: 4.9,
        reviewCount: 856,
        popular: true,
        new: false
      }, {
        id: 'r4',
        title: 'Birds of Southeast Asia: Field Guide',
        type: 'guidebook',
        category: 'birds',
        author: 'Craig Robson',
        description: 'Definitive guide to the birds of Southeast Asia, covering over 1,300 species with detailed illustrations and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1591608971358-f93643d31f43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        url: '#',
        fileSize: '28.7 MB',
        fileFormat: 'PDF',
        pages: 544,
        publishedDate: '2022-05-18',
        rating: 4.6,
        reviewCount: 295,
        popular: false,
        new: true
      },
      // Field Guides - Herps (Reptiles & Amphibians)
      {
        id: 'r5',
        title: 'A Field Guide to Reptiles & Amphibians of Eastern/Central North America',
        type: 'guidebook',
        category: 'herps',
        author: 'Roger Conant & Joseph T. Collins',
        description: 'Comprehensive guide to reptiles and amphibians of Eastern and Central North America with detailed illustrations and range maps.',
        thumbnail: 'https://images.unsplash.com/photo-1581178811376-1c34a5123377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '22.3 MB',
        fileFormat: 'PDF',
        pages: 616,
        publishedDate: '2022-03-12',
        rating: 4.7,
        reviewCount: 189,
        popular: false,
        new: true
      }, {
        id: 'r6',
        title: 'Reptiles and Amphibians of Australia',
        type: 'guidebook',
        category: 'herps',
        author: 'Harold G. Cogger',
        description: 'Definitive guide to Australian reptiles and amphibians, featuring over 1,000 species with color photographs and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        url: '#',
        fileSize: '34.6 MB',
        fileFormat: 'PDF',
        pages: 1056,
        publishedDate: '2021-08-05',
        rating: 4.8,
        reviewCount: 142,
        popular: true,
        new: false
      },
      // Field Guides - Flora
      {
        id: 'r7',
        title: 'Wildflowers of North America: Field Guide',
        type: 'guidebook',
        category: 'flora',
        author: 'National Wildlife Federation',
        description: 'Comprehensive field guide to wildflowers of North America with over 2,200 photographs of flowers organized by color and family.',
        thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '26.8 MB',
        fileFormat: 'PDF',
        pages: 576,
        publishedDate: '2023-02-28',
        rating: 4.6,
        reviewCount: 215,
        popular: false,
        new: true
      }, {
        id: 'r8',
        title: 'Trees of Eastern North America: Field Guide',
        type: 'guidebook',
        category: 'flora',
        author: 'Gil Nelson, Christopher J. Earle & Richard Spellenberg',
        description: 'Definitive guide to trees of Eastern North America, featuring 825 species with detailed illustrations and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80',
        url: '#',
        fileSize: '30.2 MB',
        fileFormat: 'PDF',
        pages: 720,
        publishedDate: '2022-04-15',
        rating: 4.8,
        reviewCount: 178,
        popular: true,
        new: false
      },
      // Scientific Journals
      {
        id: 'r9',
        title: 'Conservation Biology: Biodiversity Loss in Tropical Forests',
        type: 'journal',
        category: 'conservation',
        author: 'Various Authors',
        description: 'Special issue focusing on biodiversity loss in tropical forests, including research articles on conservation strategies and policy recommendations.',
        thumbnail: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '15.7 MB',
        fileFormat: 'PDF',
        pages: 248,
        publishedDate: '2023-03-10',
        rating: 4.7,
        reviewCount: 86,
        popular: false,
        new: true
      }, {
        id: 'r10',
        title: 'Journal of Mammalogy: Recent Discoveries',
        type: 'journal',
        category: 'mammals',
        author: 'American Society of Mammalogists',
        description: 'Latest issue featuring research articles on mammal biology, ecology, systematics, and conservation.',
        thumbnail: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
        url: '#',
        fileSize: '18.3 MB',
        fileFormat: 'PDF',
        pages: 196,
        publishedDate: '2023-01-25',
        rating: 4.5,
        reviewCount: 62,
        popular: false,
        new: true
      }, {
        id: 'r11',
        title: 'Ornithological Science: Avian Migration Patterns',
        type: 'journal',
        category: 'birds',
        author: 'Ornithological Society of Japan',
        description: 'Special issue on avian migration patterns, featuring research on climate change impacts, tracking technologies, and conservation implications.',
        thumbnail: 'https://images.unsplash.com/photo-1549608276-5786777e6587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '14.6 MB',
        fileFormat: 'PDF',
        pages: 168,
        publishedDate: '2022-11-12',
        rating: 4.6,
        reviewCount: 74,
        popular: true,
        new: false
      },
      // Research Articles
      {
        id: 'r12',
        title: 'Climate Change Impacts on Global Biodiversity',
        type: 'article',
        category: 'conservation',
        author: 'Sarah Johnson, PhD & Team',
        description: 'Comprehensive research article examining the current and projected impacts of climate change on global biodiversity across various ecosystems.',
        thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        readTime: '25 min',
        publishedDate: '2023-02-18',
        rating: 4.9,
        reviewCount: 128,
        popular: true,
        new: true
      }, {
        id: 'r13',
        title: 'Endangered Species Recovery: Success Stories and Challenges',
        type: 'article',
        category: 'conservation',
        author: 'David Wilson & Maria Rodriguez',
        description: 'Analysis of successful endangered species recovery programs, highlighting key strategies, challenges, and policy implications.',
        thumbnail: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        readTime: '18 min',
        publishedDate: '2022-10-05',
        rating: 4.7,
        reviewCount: 95,
        popular: true,
        new: false
      },
      // Textbooks
      {
        id: 'r14',
        title: 'Wildlife Ecology and Conservation: Principles and Applications',
        type: 'textbook',
        category: 'conservation',
        author: 'Michael J. Thompson & Emily Carter',
        description: 'Comprehensive textbook covering fundamental principles of wildlife ecology and conservation biology with case studies from around the world.',
        thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=868&q=80',
        url: '#',
        fileSize: '42.3 MB',
        fileFormat: 'PDF',
        pages: 824,
        publishedDate: '2022-08-15',
        rating: 4.8,
        reviewCount: 156,
        popular: true,
        new: false
      }, {
        id: 'r15',
        title: 'Marine Biology: An Ecological Approach',
        type: 'textbook',
        category: 'marine',
        author: 'James W. Nybakken & Steven K. Webster',
        description: 'Comprehensive textbook on marine biology focusing on ecological principles and marine ecosystems worldwide.',
        thumbnail: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '38.6 MB',
        fileFormat: 'PDF',
        pages: 768,
        publishedDate: '2021-12-10',
        rating: 4.7,
        reviewCount: 142,
        popular: false,
        new: false
      },
      // Field Research Reports
      {
        id: 'r16',
        title: 'Amazonian Biodiversity Survey: 2022 Field Report',
        type: 'report',
        category: 'conservation',
        author: 'Amazon Research Consortium',
        description: 'Comprehensive field report documenting biodiversity surveys conducted in the Amazon rainforest during 2022, including new species discoveries.',
        thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=868&q=80',
        url: '#',
        fileSize: '28.4 MB',
        fileFormat: 'PDF',
        pages: 186,
        publishedDate: '2023-01-30',
        rating: 4.6,
        reviewCount: 78,
        popular: false,
        new: true
      }, {
        id: 'r17',
        title: 'African Savanna Wildlife Census: 2022',
        type: 'report',
        category: 'mammals',
        author: 'African Wildlife Foundation',
        description: 'Annual wildlife census report for African savanna ecosystems, documenting population trends for key mammal species across protected areas.',
        thumbnail: 'https://images.unsplash.com/photo-1547970511-0e9f43d222ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '24.8 MB',
        fileFormat: 'PDF',
        pages: 142,
        publishedDate: '2022-12-15',
        rating: 4.5,
        reviewCount: 62,
        popular: true,
        new: true
      },
      // Identification Keys
      {
        id: 'r18',
        title: 'Illustrated Key to Freshwater Fishes of North America',
        type: 'guidebook',
        category: 'fish',
        author: 'Robert J. Goldstein & Harper Williams',
        description: 'Comprehensive identification key for freshwater fishes of North America with detailed illustrations and diagnostic characteristics.',
        thumbnail: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '32.6 MB',
        fileFormat: 'PDF',
        pages: 386,
        publishedDate: '2022-06-20',
        rating: 4.8,
        reviewCount: 104,
        popular: false,
        new: false
      }, {
        id: 'r19',
        title: 'Field Key to Butterflies of North America',
        type: 'guidebook',
        category: 'insects',
        author: 'Jeffrey Glassberg',
        description: 'Comprehensive field key for identifying butterflies of North America with color photographs and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1602583019685-3df6f9742d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '28.2 MB',
        fileFormat: 'PDF',
        pages: 344,
        publishedDate: '2022-05-15',
        rating: 4.7,
        reviewCount: 118,
        popular: true,
        new: false
      },
      // Conservation Action Plans
      {
        id: 'r20',
        title: 'Global Tiger Recovery Program: 2022-2032',
        type: 'report',
        category: 'conservation',
        author: 'Global Tiger Initiative',
        description: 'Ten-year conservation action plan for tiger recovery across 13 range countries, including habitat protection, anti-poaching measures, and community engagement.',
        thumbnail: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '18.4 MB',
        fileFormat: 'PDF',
        pages: 124,
        publishedDate: '2022-07-29',
        rating: 4.9,
        reviewCount: 86,
        popular: true,
        new: true
      },
      // East African Flora and Fauna Resources
      {
        id: 'ea1',
        title: "East African Wildlife: A Visitor's Guide",
        type: 'guidebook',
        category: 'mammals',
        author: 'Philip Briggs',
        description: 'Comprehensive field guide to wildlife in Kenya, Tanzania, Uganda, Rwanda and Burundi with color photographs and detailed information.',
        thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=868&q=80',
        url: '#',
        fileSize: '28.5 MB',
        fileFormat: 'PDF',
        pages: 432,
        publishedDate: '2023-04-12',
        rating: 4.9,
        reviewCount: 157,
        popular: true,
        new: true
      }, {
        id: 'ea2',
        title: 'Birds of East Africa: Kenya, Tanzania, Uganda, Rwanda, Burundi',
        type: 'guidebook',
        category: 'birds',
        author: 'Terry Stevenson & John Fanshawe',
        description: 'The definitive field guide to the birds of East Africa, featuring over 1,300 species with detailed illustrations and distribution maps.',
        thumbnail: 'https://images.unsplash.com/photo-1591608971358-f93643d31f43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        url: '#',
        fileSize: '32.1 MB',
        fileFormat: 'PDF',
        pages: 602,
        publishedDate: '2022-11-20',
        rating: 4.8,
        reviewCount: 203,
        popular: true,
        new: false
      }, {
        id: 'ea3',
        title: 'Field Guide to Reptiles of East Africa',
        type: 'guidebook',
        category: 'herps',
        author: 'Stephen Spawls, Kim Howell, Harald Hinkel & Michele Menegon',
        description: 'Comprehensive guide to all reptiles found in Kenya, Tanzania, Uganda, Rwanda and Burundi with detailed descriptions and color photographs.',
        thumbnail: 'https://images.unsplash.com/photo-1581178811376-1c34a5123377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '26.7 MB',
        fileFormat: 'PDF',
        pages: 576,
        publishedDate: '2022-08-15',
        rating: 4.7,
        reviewCount: 124,
        popular: false,
        new: false
      }, {
        id: 'ea4',
        title: 'Flora of Tropical East Africa',
        type: 'textbook',
        category: 'flora',
        author: 'Royal Botanic Gardens, Kew',
        description: 'Definitive taxonomic account of the plants of Kenya, Tanzania and Uganda, with descriptions, identification keys, and distribution information.',
        thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '45.3 MB',
        fileFormat: 'PDF',
        pages: 1248,
        publishedDate: '2022-05-18',
        rating: 4.9,
        reviewCount: 87,
        popular: false,
        new: false
      }, {
        id: 'ea5',
        title: 'East African Amphibians',
        type: 'guidebook',
        category: 'herps',
        author: 'Alan Channing & Kim M. Howell',
        description: 'Comprehensive guide to amphibians of East Africa with species accounts, distribution maps, and identification keys.',
        thumbnail: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
        url: '#',
        fileSize: '22.8 MB',
        fileFormat: 'PDF',
        pages: 418,
        publishedDate: '2022-09-30',
        rating: 4.6,
        reviewCount: 93,
        popular: false,
        new: false
      }, {
        id: 'ea6',
        title: 'Conservation Biology in East Africa: Challenges and Opportunities',
        type: 'journal',
        category: 'conservation',
        author: 'Various Authors',
        description: 'Special issue focusing on conservation challenges and opportunities in East African ecosystems, with emphasis on community-based approaches.',
        thumbnail: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '18.4 MB',
        fileFormat: 'PDF',
        pages: 224,
        publishedDate: '2023-03-15',
        rating: 4.7,
        reviewCount: 68,
        popular: true,
        new: true
      }, {
        id: 'ea7',
        title: 'Freshwater Fishes of East Africa',
        type: 'guidebook',
        category: 'fish',
        author: 'Ole Seehausen',
        description: 'Comprehensive guide to freshwater fishes of East Africa, focusing on the Great Lakes region with color photographs and distribution information.',
        thumbnail: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '29.6 MB',
        fileFormat: 'PDF',
        pages: 496,
        publishedDate: '2022-07-22',
        rating: 4.8,
        reviewCount: 112,
        popular: true,
        new: false
      }, {
        id: 'ea8',
        title: 'Butterflies of East Africa',
        type: 'guidebook',
        category: 'insects',
        author: 'Steve Collins & Torben B. Larsen',
        description: 'Field guide to butterflies of East Africa with detailed illustrations, distribution maps, and identification keys.',
        thumbnail: 'https://images.unsplash.com/photo-1602583019685-3df6f9742d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '24.3 MB',
        fileFormat: 'PDF',
        pages: 384,
        publishedDate: '2022-06-10',
        rating: 4.7,
        reviewCount: 95,
        popular: false,
        new: false
      }, {
        id: 'ea9',
        title: 'East African Ecosystems and Their Conservation',
        type: 'textbook',
        category: 'conservation',
        author: 'Timothy R. McClanahan & Timothy P. Young',
        description: 'Comprehensive textbook on East African ecosystems, covering ecology, biodiversity, conservation challenges, and management strategies.',
        thumbnail: 'https://images.unsplash.com/photo-1547970511-0e9f43d222ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
        url: '#',
        fileSize: '38.2 MB',
        fileFormat: 'PDF',
        pages: 672,
        publishedDate: '2022-04-05',
        rating: 4.9,
        reviewCount: 76,
        popular: true,
        new: false
      }, {
        id: 'ea10',
        title: 'Marine Fishes of East Africa and the Western Indian Ocean',
        type: 'guidebook',
        category: 'marine',
        author: 'Philip C. Heemstra & Elaine Heemstra',
        description: 'Comprehensive guide to marine fishes of East Africa and the Western Indian Ocean with detailed illustrations and species accounts.',
        thumbnail: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        url: '#',
        fileSize: '34.7 MB',
        fileFormat: 'PDF',
        pages: 528,
        publishedDate: '2022-10-12',
        rating: 4.8,
        reviewCount: 83,
        popular: false,
        new: false
      }];
      // Include existing resources from previous state
      const allResources = [...mockWildlifeResources];
  setResources(allResources as Resource[]);
  setFilteredResources(allResources as Resource[]);
      // Simulate saved resources
      setSavedResources(['r2', 'r7', 'r9', 'ea1', 'ea6']);
      setLoading(false);
    };
    fetchResources();
  }, []);
  // Filter and sort resources based on search term, filter, category, and sort order
  useEffect(() => {
    if (!resources.length) return;
    let filtered = [...resources];
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => resource.title.toLowerCase().includes(searchLower) || resource.description.toLowerCase().includes(searchLower) || resource.author.toLowerCase().includes(searchLower) || resource.category.toLowerCase().includes(searchLower));
    }
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(resource => resource.type === filter);
    }
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === activeCategory);
    }
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);
      if (sortOrder === 'newest') {
        return dateB.getTime() - dateA.getTime();
      } else if (sortOrder === 'oldest') {
        return dateA.getTime() - dateB.getTime();
      } else if (sortOrder === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
    setFilteredResources(filtered);
  }, [resources, searchTerm, filter, activeCategory, sortOrder]);
  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      // Create preview for PDF or image files
      if (file.type === 'application/pdf') {
        setUploadedFilePreview('https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          setUploadedFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Default preview for other file types
        setUploadedFilePreview('https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
      }
      // Auto-fill resource data based on filename
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setResourceData({
        ...resourceData,
        title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      });
      setUploadStep(2);
    }
  };
  // Handle resource data input change
  const handleResourceDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setResourceData({
      ...resourceData,
      [name]: value
    });
  };
  // Submit resource upload
  const handleResourceUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus('uploading');
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        setUploadProgress(progress);
        // Simulate processing time
        setTimeout(() => {
          setUploadStatus('success');
          // Add the new resource to the list
          const newResource: Resource = {
            id: `user-${Date.now()}`,
            title: resourceData.title,
            type: resourceData.type,
            category: resourceData.category,
            author: resourceData.author || currentUser?.name || 'Anonymous',
            description: resourceData.description || `Uploaded resource: ${resourceData.title}`,
            thumbnail: uploadedFilePreview || 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
            url: '#',
            fileSize: `${(uploadedFile?.size ? uploadedFile.size / (1024 * 1024) : 1).toFixed(1)} MB`,
            fileFormat: uploadedFile?.type.split('/')[1].toUpperCase() || 'PDF',
            publishedDate: new Date().toISOString().split('T')[0],
            rating: 5.0,
            reviewCount: 1,
            new: true,
            uploadedBy: currentUser?.name
          };
          setResources(prev => [newResource, ...prev]);
          // Close modal after a short delay
          setTimeout(() => {
            resetUploadForm();
            setShowUploadModal(false);
          }, 2000);
        }, 1000);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  };
  // Reset upload form
  const resetUploadForm = () => {
    setUploadStep(1);
    setUploadedFile(null);
    setUploadedFilePreview(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setResourceData({
      title: '',
      author: '',
      type: 'article',
      category: 'other',
      description: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // Get resource type icon
  const getResourceTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'guidebook':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'textbook':
        return <BookOpenIcon className="h-5 w-5" />;
      case 'journal':
        return <FileTextIcon className="h-5 w-5" />;
      case 'article':
        return <FileTextIcon className="h-5 w-5" />;
      case 'report':
        return <FileTextIcon className="h-5 w-5" />;
      default:
        return <FileTextIcon className="h-5 w-5" />;
    }
  };
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // View resource details
  const viewResourceDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };
  // Toggle saved resource
  const toggleSaveResource = (resourceId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId));
    } else {
      setSavedResources([...savedResources, resourceId]);
    }
  };
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mammals':
        return <span className="text-amber-600 dark:text-amber-400">🦁</span>;
      case 'birds':
        return <span className="text-sky-600 dark:text-sky-400">🦉</span>;
      case 'herps':
        return <span className="text-green-600 dark:text-green-400">🐸</span>;
      case 'fish':
        return <span className="text-blue-600 dark:text-blue-400">🐠</span>;
      case 'insects':
        return <span className="text-orange-600 dark:text-orange-400">🦋</span>;
      case 'flora':
        return <LeafIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'marine':
        return <span className="text-blue-600 dark:text-blue-400">🐋</span>;
      case 'conservation':
        return <span className="text-emerald-600 dark:text-emerald-400">🌍</span>;
      default:
        return <LeafIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
    }
  };
  // Render resource card
  const renderResourceCard = (resource: Resource) => {
    const isSaved = savedResources.includes(resource.id);
    return <div key={resource.id} className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => viewResourceDetails(resource)}>
        <div className="relative h-40 overflow-hidden">
          <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
          <div className="absolute top-0 right-0 p-2">
            <button onClick={e => toggleSaveResource(resource.id, e)} className={`p-1.5 rounded-full ${isSaved ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-gray-100/80 text-gray-600 dark:bg-gray-800/80 dark:text-gray-300'}`}>
              <BookmarkIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex space-x-2">
            <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded flex items-center">
              {getCategoryIcon(resource.category)}
              <span className="ml-1 capitalize">{resource.category}</span>
            </span>
            {resource.new && <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded">
                New
              </span>}
            {resource.uploadedBy && <span className="px-2 py-1 bg-indigo-500/90 text-white text-xs font-medium rounded">
                User Upload
              </span>}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 line-clamp-1">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                {resource.author}
              </p>
            </div>
            <div className={`p-1.5 rounded-full ${resource.type === 'guidebook' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : resource.type === 'textbook' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' : resource.type === 'journal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' : resource.type === 'report' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'}`}>
              {getResourceTypeIcon(resource.type)}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 line-clamp-2">
            {resource.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`h-4 w-4 ${star <= Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill={star <= Math.floor(resource.rating) ? 'currentColor' : 'none'} />)}
              </div>
              <span className="ml-1 text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                ({resource.rating})
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
              {formatDate(resource.publishedDate)}
            </div>
          </div>
        </div>
      </div>;
  };
  // Render resource details modal
  const renderResourceModal = () => {
    if (!selectedResource) return null;
    const isSaved = savedResources.includes(selectedResource.id);
    return <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="relative">
              <button type="button" onClick={() => setShowResourceModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 z-10">
                <XIcon className="h-5 w-5" />
              </button>
              <div className="h-48 overflow-hidden">
                <img src={selectedResource.thumbnail} alt={selectedResource.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  {selectedResource.title}
                </h3>
                <div className={`p-2 rounded-full ${selectedResource.type === 'guidebook' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : selectedResource.type === 'textbook' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' : selectedResource.type === 'journal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' : selectedResource.type === 'report' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'}`}>
                  {getResourceTypeIcon(selectedResource.type)}
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                <span>By {selectedResource.author}</span>
                <span className="mx-2">•</span>
                <span>
                  Published {formatDate(selectedResource.publishedDate)}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center capitalize">
                  {getCategoryIcon(selectedResource.category)}
                  <span className="ml-1">{selectedResource.category}</span>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                  {selectedResource.description}
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {(selectedResource.type === 'guidebook' || selectedResource.type === 'textbook' || selectedResource.type === 'journal' || selectedResource.type === 'report') && <>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Format
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedResource.fileFormat}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Size
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedResource.fileSize}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Pages
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedResource.pages}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Type
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 capitalize">
                        {selectedResource.type}
                      </p>
                    </div>
                  </>}
                {selectedResource.type === 'article' && <>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Read Time
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                        {selectedResource.readTime || '15 min'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                        Type
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 capitalize">
                        {selectedResource.type}
                      </p>
                    </div>
                  </>}
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`h-5 w-5 ${star <= Math.floor(selectedResource.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill={star <= Math.floor(selectedResource.rating) ? 'currentColor' : 'none'} />)}
                </div>
                <span className="ml-2 text-sm text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200">
                  {selectedResource.rating} ({selectedResource.reviewCount}{' '}
                  reviews)
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm">
                {selectedResource.type === 'article' ? 'Read Article' : 'Download'}
                <DownloadIcon className="ml-2 h-4 w-4" />
              </a>
              <button type="button" onClick={e => toggleSaveResource(selectedResource.id, e)} className={`mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border ${isSaved ? 'border-indigo-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-sky-700 bg-indigo-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-indigo-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-sky-300' : 'border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200'} shadow-sm px-4 py-2 text-base font-medium hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm`}>
                <BookmarkIcon className="mr-2 h-4 w-4" />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <div className="mt-3 sm:mt-0 sm:flex-1 flex justify-start">
                <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
                  <ShareIcon className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  // Render resource upload modal
  const renderUploadModal = () => {
    return <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button type="button" onClick={() => {
              resetUploadForm();
              setShowUploadModal(false);
            }} className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                    Upload Resource
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                      Share your knowledge by uploading educational resources
                      for wildlife and conservation.
                    </p>
                  </div>
                  {/* Step 1: File Upload */}
                  {uploadStep === 1 && <div className="mt-6">
                      <div className="border-2 border-dashed border-gray-300 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-blue-600 jungle:hover:border-green-600 extra-dark:hover:border-gray-600" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          Click to upload or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          PDF, Word, PowerPoint, Excel, Text, or Image files
                        </p>
                      </div>
                    </div>}
                  {/* Step 2: Resource Details */}
                  {uploadStep === 2 && uploadStatus === 'idle' && <form onSubmit={handleResourceUpload} className="mt-6">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="col-span-1">
                          {uploadedFilePreview ? <div className="h-32 rounded-lg overflow-hidden">
                              <img src={uploadedFilePreview} alt="File preview" className="h-full w-full object-cover" />
                            </div> : <div className="h-32 rounded-lg bg-gray-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 flex items-center justify-center">
                              <FileIcon className="h-10 w-10 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
                            </div>}
                          <div className="mt-2 text-xs text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            {uploadedFile?.name}
                            <br />
                            {uploadedFile && (uploadedFile.size / (1024 * 1024)).toFixed(2)}{' '}
                            MB
                          </div>
                        </div>
                        <div className="col-span-2 space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                              Title
                            </label>
                            <input type="text" name="title" id="title" value={resourceData.title} onChange={handleResourceDataChange} required className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
                          </div>
                          <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                              Author
                            </label>
                            <input type="text" name="author" id="author" value={resourceData.author} onChange={handleResourceDataChange} placeholder={currentUser?.name || 'Your name'} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            Type
                          </label>
                          <select name="type" id="type" value={resourceData.type} onChange={handleResourceDataChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            <option value="article">Article</option>
                            <option value="guidebook">Field Guide</option>
                            <option value="textbook">Textbook</option>
                            <option value="journal">Journal</option>
                            <option value="report">Report</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                            Category
                          </label>
                          <select name="category" id="category" value={resourceData.category} onChange={handleResourceDataChange} className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                            <option value="mammals">Mammals</option>
                            <option value="birds">Birds</option>
                            <option value="herps">Reptiles & Amphibians</option>
                            <option value="fish">Fish</option>
                            <option value="insects">Insects</option>
                            <option value="flora">Flora</option>
                            <option value="marine">Marine</option>
                            <option value="conservation">Conservation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          Description
                        </label>
                        <textarea name="description" id="description" rows={3} value={resourceData.description} onChange={handleResourceDataChange} placeholder="Brief description of the resource..." className="mt-1 block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100" />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button type="button" onClick={() => setUploadStep(1)} className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
                          Back
                        </button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
                          Upload Resource
                        </button>
                      </div>
                    </form>}
                  {/* Upload Progress */}
                  {uploadStatus === 'uploading' && <div className="mt-6">
                      <div className="text-center">
                        <Loader2Icon className="mx-auto h-12 w-12 text-indigo-600 dark:text-blue-500 jungle:text-green-500 extra-dark:text-sky-500 animate-spin" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          Uploading...
                        </h3>
                        <div className="mt-4">
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800">
                              <div style={{
                            width: `${uploadProgress}%`
                          }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 dark:bg-blue-500 jungle:bg-green-500 extra-dark:bg-sky-500 transition-all duration-300"></div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                                {uploadProgress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>}
                  {/* Upload Success */}
                  {uploadStatus === 'success' && <div className="mt-6">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                          <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          Upload Successful!
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          Your resource has been added to the collection.
                        </p>
                      </div>
                    </div>}
                  {/* Upload Error */}
                  {uploadStatus === 'error' && <div className="mt-6">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                          <AlertCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                          Upload Failed
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                          There was an error uploading your resource. Please try
                          again.
                        </p>
                        <div className="mt-4">
                          <button type="button" onClick={() => setUploadStatus('idle')} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
            Wildlife Resources
          </h1>
          <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
            Explore our comprehensive collection of wildlife resources including
            field guides, research papers, and conservation reports
          </p>
        </div>
        {/* Upload button */}
        <div className="mt-4 md:mt-0">
          <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500">
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload Resource
          </button>
        </div>
      </div>
      {/* Search and filters */}
      <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400" />
            </div>
            <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 placeholder-gray-500 dark:placeholder-blue-400 jungle:placeholder-green-400 extra-dark:placeholder-gray-400 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm" placeholder="Search wildlife resources..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-auto">
              <label htmlFor="resource-filter" className="sr-only">
                Filter by Type
              </label>
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                <select id="resource-filter" value={filter} onChange={e => setFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  <option value="all">All Types</option>
                  <option value="guidebook">Field Guides</option>
                  <option value="textbook">Textbooks</option>
                  <option value="journal">Journals</option>
                  <option value="article">Articles</option>
                  <option value="report">Reports</option>
                </select>
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <label htmlFor="sort-order" className="sr-only">
                Sort By
              </label>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 mr-2" />
                <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Category tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveCategory('all')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'all' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            All Categories
          </button>
          <button onClick={() => setActiveCategory('mammals')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'mammals' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Mammals
          </button>
          <button onClick={() => setActiveCategory('birds')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'birds' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Birds
          </button>
          <button onClick={() => setActiveCategory('herps')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'herps' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Reptiles & Amphibians
          </button>
          <button onClick={() => setActiveCategory('fish')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'fish' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Fish
          </button>
          <button onClick={() => setActiveCategory('flora')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'flora' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Flora
          </button>
          <button onClick={() => setActiveCategory('conservation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeCategory === 'conservation' ? 'border-indigo-500 dark:border-blue-500 jungle:border-green-500 extra-dark:border-sky-500 text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400' : 'border-transparent text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:text-gray-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-blue-700 jungle:hover:border-green-700 extra-dark:hover:border-gray-700'}`}>
            Conservation
          </button>
        </nav>
      </div>
      {/* East African Resources Section */}
      {activeCategory === 'all' && filter === 'all' && !searchTerm && <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-4">
            East African Wildlife Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(resource => resource.id.startsWith('ea')).slice(0, 3).map(resource => renderResourceCard(resource))}
          </div>
        </div>}
      {/* New resources */}
      {activeCategory === 'all' && filter === 'all' && !searchTerm && <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-4">
            Latest Additions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(resource => resource.new).slice(0, 3).map(resource => renderResourceCard(resource))}
          </div>
        </div>}
      {/* All resources */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mb-4">
          {searchTerm ? 'Search Results' : filter !== 'all' ? `${filter.charAt(0).toUpperCase() + filter.slice(1)}s` : activeCategory !== 'all' ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Resources` : 'All Wildlife Resources'}
        </h2>
        {loading ? <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div> : filteredResources.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => renderResourceCard(resource))}
          </div> : <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md p-8 text-center">
            <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
              No resources found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
              {searchTerm ? `No resources matching "${searchTerm}"` : 'No resources matching the current filters'}
            </p>
            <div className="mt-6">
              <button onClick={() => {
            setSearchTerm('');
            setFilter('all');
            setActiveCategory('all');
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-sky-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-sky-500">
                Clear Filters
              </button>
            </div>
          </div>}
      </div>
      {/* Resource details modal */}
      {showResourceModal && renderResourceModal()}
      {/* Upload modal */}
      {showUploadModal && renderUploadModal()}
    </div>;
};
export default ResourcesPage;