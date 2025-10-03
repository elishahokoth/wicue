import React, { useState } from 'react';
import { Upload, X, File, FileText, Check, AlertCircle } from 'lucide-react';
type CitationFormat = 'apa' | 'mla' | 'chicago' | 'harvard' | 'none';
type ResourceUploadFormProps = {
  onUpload: (formData: FormData) => Promise<void>;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
};
const ResourceUploadForm: React.FC<ResourceUploadFormProps> = ({
  onUpload,
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.jpg', '.png', '.mp4', '.mp3'],
  maxFileSize = 50 // Default 50MB
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('none');
  const [citationInfo, setCitationInfo] = useState({
    author: '',
    year: '',
    title: '',
    publisher: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    url: ''
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      // Check file types and sizes
      const invalidFiles = fileList.filter(file => {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const isValidType = allowedFileTypes.includes(fileExtension) || allowedFileTypes.includes('*');
        const isValidSize = file.size <= maxFileSize * 1024 * 1024;
        return !isValidType || !isValidSize;
      });
      if (invalidFiles.length > 0) {
        setUploadError(`Some files are not valid. Please check file types and sizes (max ${maxFileSize}MB).`);
        return;
      }
      setFiles(prev => [...prev, ...fileList]);
      setUploadError(null);
    }
  };
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };
  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };
  const handleCitationInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setCitationInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const generateAPA = () => {
    const {
      author,
      year,
      title,
      publisher,
      journal,
      volume,
      issue,
      pages,
      doi,
      url
    } = citationInfo;
    if (journal) {
      // Journal article
      return `${author}. (${year}). ${title}. ${journal}, ${volume}${issue ? `(${issue})` : ''}, ${pages}. ${doi ? `https://doi.org/${doi}` : url}`;
    } else {
      // Book or other source
      return `${author}. (${year}). ${title}. ${publisher}. ${url}`;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setUploadError('Please select at least one file to upload.');
      return;
    }
    if (!title.trim()) {
      setUploadError('Please provide a title for your resource.');
      return;
    }
    try {
      setIsUploading(true);
      setUploadError(null);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));
      if (citationFormat !== 'none') {
        let citation = '';
        if (citationFormat === 'apa') {
          citation = generateAPA();
        }
        // Add other citation format generators as needed
        formData.append('citation', citation);
        formData.append('citationFormat', citationFormat);
        formData.append('citationInfo', JSON.stringify(citationInfo));
      }
      await onUpload(formData);
      // Reset form on success
      setFiles([]);
      setTitle('');
      setDescription('');
      setTags([]);
      setCitationFormat('none');
      setCitationInfo({
        author: '',
        year: '',
        title: '',
        publisher: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        url: ''
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    } catch (error) {
      setUploadError('Failed to upload resources. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 darksacramento:bg-green-950 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100 mb-4">
        Upload Resources
      </h2>
      {uploadSuccess && <div className="mb-4 bg-green-50 dark:bg-green-900/30 jungle:bg-green-900/30 extra-dark:bg-green-900/30 darksacramento:bg-green-900/30 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700 dark:text-green-300 jungle:text-green-300 extra-dark:text-green-300 darksacramento:text-green-300">
              Resources uploaded successfully!
            </p>
          </div>
        </div>}
      {uploadError && <div className="mb-4 bg-red-50 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 darksacramento:bg-red-900/30 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 darksacramento:text-red-300">
              {uploadError}
            </p>
          </div>
        </div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
            Upload Files
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400" />
              <div className="flex text-sm text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 rounded-md font-medium text-indigo-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-sky-400 darksacramento:text-green-400 hover:text-indigo-500 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-sky-300 darksacramento:hover:text-green-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-blue-500 jungle:focus-within:ring-green-500 extra-dark:focus-within:ring-sky-500 darksacramento:focus-within:ring-green-500 px-2 py-1">
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400">
                {allowedFileTypes.join(', ')} up to {maxFileSize}MB
              </p>
            </div>
          </div>
        </div>
        {files.length > 0 && <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
              Selected Files ({files.length})
            </h3>
            <ul className="divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700 darksacramento:divide-green-800">
              {files.map((file, index) => <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">
                    <X className="h-5 w-5" />
                  </button>
                </li>)}
            </ul>
          </div>}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
            Title
          </label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" required />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
            Description
          </label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
        </div>
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
            Tags
          </label>
          <div className="flex items-center">
            <input type="text" id="tags" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" placeholder="Add tags and press Enter" />
            <button type="button" onClick={handleAddTag} className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-gray-700 darksacramento:bg-green-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-gray-600 darksacramento:hover:bg-green-600">
              Add
            </button>
          </div>
          {tags.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-800 text-indigo-800 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-indigo-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 darksacramento:text-green-400 hover:text-indigo-700 dark:hover:text-blue-300 jungle:hover:text-green-300 extra-dark:hover:text-gray-300 darksacramento:hover:text-green-300">
                    &times;
                  </button>
                </span>)}
            </div>}
        </div>
        <div className="mb-6">
          <label htmlFor="citation-format" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-2">
            Citation Format
          </label>
          <select id="citation-format" value={citationFormat} onChange={e => setCitationFormat(e.target.value as CitationFormat)} className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100">
            <option value="none">None</option>
            <option value="apa">APA Format</option>
            <option value="mla">MLA Format</option>
            <option value="chicago">Chicago Format</option>
            <option value="harvard">Harvard Format</option>
          </select>
        </div>
        {citationFormat !== 'none' && <div className="mb-6 p-4 border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 darksacramento:border-green-800 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-3">
              {citationFormat.toUpperCase()} Citation Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  Author(s)
                </label>
                <input type="text" id="author" name="author" value={citationInfo.author} onChange={handleCitationInfoChange} placeholder="Last name, First initial. (e.g., Smith, J.)" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div>
                <label htmlFor="year" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  Year
                </label>
                <input type="text" id="year" name="year" value={citationInfo.year} onChange={handleCitationInfoChange} placeholder="Publication year (e.g., 2023)" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="citation-title" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  Title
                </label>
                <input type="text" id="citation-title" name="title" value={citationInfo.title} onChange={handleCitationInfoChange} placeholder="Title of the article, book, or resource" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div>
                <label htmlFor="journal" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  Journal/Periodical
                </label>
                <input type="text" id="journal" name="journal" value={citationInfo.journal} onChange={handleCitationInfoChange} placeholder="Journal or periodical name (if applicable)" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div>
                <label htmlFor="publisher" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  Publisher
                </label>
                <input type="text" id="publisher" name="publisher" value={citationInfo.publisher} onChange={handleCitationInfoChange} placeholder="Publisher name (for books, reports, etc.)" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="volume" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                    Volume
                  </label>
                  <input type="text" id="volume" name="volume" value={citationInfo.volume} onChange={handleCitationInfoChange} placeholder="Vol." className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
                </div>
                <div>
                  <label htmlFor="issue" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                    Issue
                  </label>
                  <input type="text" id="issue" name="issue" value={citationInfo.issue} onChange={handleCitationInfoChange} placeholder="No." className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
                </div>
                <div>
                  <label htmlFor="pages" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                    Pages
                  </label>
                  <input type="text" id="pages" name="pages" value={citationInfo.pages} onChange={handleCitationInfoChange} placeholder="pp-pp" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
                </div>
              </div>
              <div>
                <label htmlFor="doi" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  DOI
                </label>
                <input type="text" id="doi" name="doi" value={citationInfo.doi} onChange={handleCitationInfoChange} placeholder="Digital Object Identifier" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
              <div>
                <label htmlFor="url" className="block text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                  URL
                </label>
                <input type="text" id="url" name="url" value={citationInfo.url} onChange={handleCitationInfoChange} placeholder="Website URL (if applicable)" className="block w-full border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 darksacramento:border-green-700 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 darksacramento:focus:ring-green-500 focus:border-indigo-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 darksacramento:focus:border-green-500 sm:text-sm bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 darksacramento:bg-green-900 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 darksacramento:text-green-100" />
              </div>
            </div>
            {citationFormat === 'apa' && citationInfo.author && citationInfo.year && citationInfo.title && <div className="mt-4 p-3 bg-gray-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-900/30 darksacramento:bg-green-900/30 rounded-md">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 darksacramento:text-green-300 mb-1">
                    Generated APA Citation:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 darksacramento:text-green-200">
                    {generateAPA()}
                  </p>
                </div>}
          </div>}
        <div className="flex justify-end">
          <button type="submit" disabled={isUploading} className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUploading ? 'bg-indigo-400 dark:bg-blue-600 jungle:bg-green-600 extra-dark:bg-gray-600 darksacramento:bg-green-600 cursor-not-allowed' : 'bg-indigo-600 dark:bg-blue-700 jungle:bg-green-700 extra-dark:bg-gray-700 darksacramento:bg-green-700 hover:bg-indigo-700 dark:hover:bg-blue-600 jungle:hover:bg-green-600 extra-dark:hover:bg-gray-600 darksacramento:hover:bg-green-600'}`}>
            {isUploading ? <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </> : <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resources
              </>}
          </button>
        </div>
      </form>
    </div>;
};
export default ResourceUploadForm;