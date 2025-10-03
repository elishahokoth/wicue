import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp, Download, Filter, Users, Clock, Award, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';
// Sample data
const engagementData = [{
  name: 'Week 1',
  views: 120,
  completions: 80,
  interactions: 95
}, {
  name: 'Week 2',
  views: 150,
  completions: 90,
  interactions: 120
}, {
  name: 'Week 3',
  views: 180,
  completions: 100,
  interactions: 150
}, {
  name: 'Week 4',
  views: 170,
  completions: 95,
  interactions: 140
}, {
  name: 'Week 5',
  views: 190,
  completions: 110,
  interactions: 160
}, {
  name: 'Week 6',
  views: 210,
  completions: 130,
  interactions: 180
}];
const performanceData = [{
  name: 'Quiz 1',
  average: 72,
  highest: 98,
  lowest: 45
}, {
  name: 'Quiz 2',
  average: 75,
  highest: 100,
  lowest: 50
}, {
  name: 'Assignment 1',
  average: 82,
  highest: 95,
  lowest: 60
}, {
  name: 'Quiz 3',
  average: 78,
  highest: 97,
  lowest: 55
}, {
  name: 'Assignment 2',
  average: 85,
  highest: 98,
  lowest: 65
}, {
  name: 'Final Exam',
  average: 80,
  highest: 100,
  lowest: 58
}];
const completionData = [{
  name: 'Completed',
  value: 68,
  color: '#4F46E5'
}, {
  name: 'In Progress',
  value: 22,
  color: '#FCD34D'
}, {
  name: 'Not Started',
  value: 10,
  color: '#F87171'
}];
const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'engagement' | 'performance' | 'completion'>('engagement');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showFilters, setShowFilters] = useState(false);
  return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Advanced Analytics
        </h2>
        <div className="flex space-x-2">
          <div className="relative">
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
            {showFilters && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </div>
                  <div className="px-4 py-2">
                    <select className="w-full border border-gray-300 rounded-md text-sm text-black">
                      <option>All Courses</option>
                      <option>Introduction to Programming</option>
                      <option>Advanced Mathematics</option>
                      <option>Digital Marketing</option>
                    </select>
                  </div>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Group
                  </div>
                  <div className="px-4 py-2">
                    <select className="w-full border border-gray-300 rounded-md text-sm text-black">
                      <option>All Students</option>
                      <option>Group A</option>
                      <option>Group B</option>
                      <option>International Students</option>
                    </select>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>}
          </div>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)} className="border border-gray-300 rounded-md text-sm text-black px-3 py-1.5">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`py-2 px-4 text-sm font-medium ${activeTab === 'engagement' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('engagement')}>
          Engagement
        </button>
        <button className={`py-2 px-4 text-sm font-medium ${activeTab === 'performance' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('performance')}>
          Performance
        </button>
        <button className={`py-2 px-4 text-sm font-medium ${activeTab === 'completion' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('completion')}>
          Completion
        </button>
      </div>
      <div className="mb-6">
        {activeTab === 'engagement' && <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Students</p>
                    <p className="text-lg font-semibold text-gray-900">142</p>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +12% from last month
                  </span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Avg. Time per Session
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      26 min
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +8% from last month
                  </span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Resource Views</p>
                    <p className="text-lg font-semibold text-gray-900">2,384</p>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +15% from last month
                  </span>
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">At-Risk Students</p>
                    <p className="text-lg font-semibold text-gray-900">18</p>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">
                    +5% from last month
                  </span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" name="Content Views" fill="#4F46E5" />
                  <Bar dataKey="completions" name="Completions" fill="#10B981" />
                  <Bar dataKey="interactions" name="Interactions" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>}
        {activeTab === 'performance' && <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average Score</p>
                    <p className="text-lg font-semibold text-gray-900">78.5%</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Highest Score</p>
                    <p className="text-lg font-semibold text-gray-900">98%</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pass Rate</p>
                    <p className="text-lg font-semibold text-gray-900">86%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="average" name="Average Score" stroke="#4F46E5" activeDot={{
                r: 8
              }} strokeWidth={2} />
                  <Line type="monotone" dataKey="highest" name="Highest Score" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="lowest" name="Lowest Score" stroke="#F87171" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>}
        {activeTab === 'completion' && <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Award className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completion Rate</p>
                    <p className="text-lg font-semibold text-gray-900">68%</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Avg. Completion Time
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      4.2 weeks
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certificates Issued</p>
                    <p className="text-lg font-semibold text-gray-900">87</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={completionData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                      {completionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 pl-0 md:pl-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Completion Analysis
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Top Completed Modules
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Introduction to the Course
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          98%
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Basic Concepts
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          92%
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Practical Examples
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          85%
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Lowest Completed Modules
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Advanced Techniques
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          45%
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Final Project
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          52%
                        </span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Case Studies
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          58%
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>}
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Recommendations
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-600">
              Engagement drops in Week 4. Consider adding more interactive
              content to maintain student interest.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-600">
              18 students are at risk of not completing the course. Recommended
              action: Send personalized check-in emails.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2">
              <Award className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-600">
              Quiz 2 had the highest scores. Consider using similar question
              formats in future assessments.
            </p>
          </li>
        </ul>
      </div>
    </div>;
};
export default AdvancedAnalytics;