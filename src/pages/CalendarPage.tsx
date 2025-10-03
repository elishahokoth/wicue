import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, GlobeIcon, ListIcon, GridIcon, AlertCircleIcon, Calendar as CalendarIcon2, CheckCircleIcon, Clock3Icon } from 'lucide-react';
// Mock data for different calendar types
const calendarTypes = [{
  id: 'gregorian',
  name: 'Gregorian Calendar',
  region: 'Global'
}, {
  id: 'islamic',
  name: 'Islamic Calendar',
  region: 'Middle East'
}, {
  id: 'chinese',
  name: 'Chinese Calendar',
  region: 'China/East Asia'
}, {
  id: 'hindu',
  name: 'Hindu Calendar',
  region: 'India'
}, {
  id: 'hebrew',
  name: 'Hebrew Calendar',
  region: 'Israel'
}];
// Mock holidays data
const holidays = {
  gregorian: [{
    date: '2023-12-25',
    name: 'Christmas Day',
    region: 'Global'
  }, {
    date: '2024-01-01',
    name: "New Year's Day",
    region: 'Global'
  }, {
    date: '2024-02-14',
    name: "Valentine's Day",
    region: 'Global'
  }, {
    date: '2024-03-17',
    name: "St. Patrick's Day",
    region: 'Ireland/Global'
  }, {
    date: '2024-04-22',
    name: 'Earth Day',
    region: 'Global'
  }, {
    date: '2024-05-27',
    name: 'Memorial Day',
    region: 'US'
  }, {
    date: '2024-07-04',
    name: 'Independence Day',
    region: 'US'
  }],
  islamic: [{
    date: '2024-03-10',
    name: 'Ramadan Start',
    region: 'Islamic'
  }, {
    date: '2024-04-09',
    name: 'Eid al-Fitr',
    region: 'Islamic'
  }, {
    date: '2024-06-16',
    name: 'Eid al-Adha',
    region: 'Islamic'
  }],
  chinese: [{
    date: '2024-02-10',
    name: 'Chinese New Year',
    region: 'China/East Asia'
  }, {
    date: '2024-04-04',
    name: 'Qingming Festival',
    region: 'China'
  }, {
    date: '2024-06-10',
    name: 'Dragon Boat Festival',
    region: 'China'
  }],
  hindu: [{
    date: '2024-03-25',
    name: 'Holi',
    region: 'India'
  }, {
    date: '2024-10-31',
    name: 'Diwali',
    region: 'India'
  }],
  hebrew: [{
    date: '2024-04-22',
    name: 'Passover',
    region: 'Jewish'
  }, {
    date: '2024-10-02',
    name: 'Rosh Hashanah',
    region: 'Jewish'
  }]
};
// Mock course schedule data
const courseSchedules = [{
  courseId: 1,
  title: 'Introduction to Computer Science',
  startDate: '2024-01-15',
  endDate: '2024-05-15',
  sessions: [{
    day: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'CS-101'
  }, {
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'CS-101'
  }],
  color: 'bg-blue-500'
}, {
  courseId: 2,
  title: 'Data Structures and Algorithms',
  startDate: '2024-01-16',
  endDate: '2024-05-16',
  sessions: [{
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'CS-201'
  }, {
    day: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'CS-201'
  }],
  color: 'bg-green-500'
}, {
  courseId: 3,
  title: 'Database Systems',
  startDate: '2024-01-17',
  endDate: '2024-05-17',
  sessions: [{
    day: 'Monday',
    startTime: '14:00',
    endTime: '16:00',
    room: 'CS-301'
  }, {
    day: 'Friday',
    startTime: '10:00',
    endTime: '12:00',
    room: 'CS-301'
  }],
  color: 'bg-purple-500'
}];
// Days of the week
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Helper function to get days in month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
// Helper function to get first day of month
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};
const CalendarPage = () => {
  useTheme();
  useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarType, setSelectedCalendarType] = useState('gregorian');
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day', 'timetable'
  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  // Week navigation
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  // Day navigation
  const prevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  // Format date for comparison
  const formatDateForComparison = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  // Check if a date has a holiday
  const getHolidayForDate = (date: Date) => {
    const formattedDate = formatDateForComparison(date);
    return (holidays as Record<string, { date: string; name: string; region: string }[]>)[selectedCalendarType]?.find((h: { date: string }) => h.date === formattedDate);
  };
  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // Start from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  // Get course sessions for a specific day
  const getCourseSessionsForDay = (dayName: string) => {
    return courseSchedules.filter(course => course.sessions.some((session: any) => session.day === dayName)).map(course => ({
      ...course,
      sessions: course.sessions.filter((session: any) => session.day === dayName)
    }));
  };
  // Render calendar based on view mode
  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'timetable':
        return renderTimetableView();
      default:
        return renderMonthView();
    }
  };
  // Render month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    // Create calendar grid
    const calendarDays = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 p-1"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const formattedDate = formatDateForComparison(date);
      const isToday = formatDateForComparison(new Date()) === formattedDate;
      const holiday = getHolidayForDate(date);
      // Check if there are course sessions for this day
      const dayOfWeek = daysOfWeek[date.getDay()];
      const courseSessions = getCourseSessionsForDay(dayOfWeek);
      calendarDays.push(<div key={`day-${day}`} className={`h-24 border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 p-1 ${isToday ? 'bg-emerald-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-800/30' : ''}`}>
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${isToday ? 'text-emerald-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : ''}`}>
              {day}
            </span>
            {holiday && <span className="text-xs bg-red-100 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 text-red-600 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 px-1 rounded">
                {holiday.name}
              </span>}
          </div>
          {/* Course sessions */}
          <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
            {courseSessions.map((course, idx) => <div key={`course-${day}-${idx}`} className={`text-xs text-white p-1 rounded truncate ${course.color}`}>
                {course.title.length > 15 ? course.title.substring(0, 15) + '...' : course.title}
              </div>)}
          </div>
        </div>);
    }
    return <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {daysOfWeek.map(day => <div key={day} className="text-center py-2 font-medium text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
            {day.substring(0, 3)}
          </div>)}
        {/* Calendar days */}
        {calendarDays}
      </div>;
  };
  // Render week view
  const renderWeekView = () => {
    const weekDates = getWeekDates();
    return <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {weekDates.map((date, index) => {
        const formattedDate = formatDateForComparison(date);
        const isToday = formatDateForComparison(new Date()) === formattedDate;
        return <div key={index} className={`text-center py-2 ${isToday ? 'bg-emerald-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-800/30 rounded-t' : ''}`}>
              <div className="font-medium text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                {daysOfWeek[date.getDay()].substring(0, 3)}
              </div>
              <div className={`text-lg ${isToday ? 'text-emerald-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 font-bold' : ''}`}>
                {date.getDate()}
              </div>
            </div>;
      })}
        {/* Events for each day */}
        {weekDates.map((date, index) => {
        const formattedDate = formatDateForComparison(date);
        const isToday = formatDateForComparison(new Date()) === formattedDate;
        const holiday = getHolidayForDate(date);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const courseSessions = getCourseSessionsForDay(dayOfWeek);
        return <div key={`events-${index}`} className={`h-64 border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 p-2 overflow-y-auto ${isToday ? 'bg-emerald-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-800/30' : ''}`}>
              {holiday && <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 text-red-600 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 rounded text-sm">
                  <AlertCircleIcon className="h-4 w-4 inline-block mr-1" />
                  {holiday.name}
                </div>}
              {courseSessions.map((course, idx) => <div key={`course-${index}-${idx}`} className={`mb-2 p-2 ${course.color} text-white rounded shadow-sm`}>
                  <div className="font-medium">{course.title}</div>
                  {course.sessions.map((session, sessionIdx) => <div key={`session-${index}-${idx}-${sessionIdx}`} className="text-xs mt-1">
                      <ClockIcon className="h-3 w-3 inline-block mr-1" />
                      {session.startTime} - {session.endTime}
                      <div className="ml-4">Room: {session.room}</div>
                    </div>)}
                </div>)}
              {!holiday && courseSessions.length === 0 && <div className="text-sm text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500 italic text-center mt-4">
                  No events scheduled
                </div>}
            </div>;
      })}
      </div>;
  };
  // Render day view
  const renderDayView = () => {
    const formattedDate = formatDateForComparison(currentDate);
    const isToday = formatDateForComparison(new Date()) === formattedDate;
    const holiday = getHolidayForDate(currentDate);
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const courseSessions = getCourseSessionsForDay(dayOfWeek);
    // Create time slots for the day (8AM to 8PM)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const timeString = `${formattedHour}:00 ${amPm}`;
      // Find sessions that occur during this time slot
  const sessionsInTimeSlot: any[] = [];
      courseSessions.forEach(course => {
        course.sessions.forEach(session => {
          const sessionStartHour = parseInt(session.startTime.split(':')[0]);
          const sessionEndHour = parseInt(session.endTime.split(':')[0]);
          if (hour >= sessionStartHour && hour < sessionEndHour) {
            sessionsInTimeSlot.push({
              ...course,
              session
            });
          }
        });
      });
      timeSlots.push({
        time: timeString,
        hour,
        sessions: sessionsInTimeSlot
      });
    }
    return <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow">
        <div className={`p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 ${isToday ? 'bg-emerald-50 dark:bg-blue-900/30 jungle:bg-green-900/30 extra-dark:bg-gray-800/30' : ''}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
            {currentDate.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          </h2>
          {holiday && <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 jungle:bg-red-900/30 extra-dark:bg-red-900/30 text-red-600 dark:text-red-300 jungle:text-red-300 extra-dark:text-red-300 rounded">
              <AlertCircleIcon className="h-4 w-4 inline-block mr-1" />
              Holiday: {holiday.name}
            </div>}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
          {timeSlots.map((slot, index) => <div key={index} className="flex p-4">
              <div className="w-20 flex-shrink-0 text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                {slot.time}
              </div>
              <div className="flex-grow">
                {slot.sessions.length > 0 ? <div className="space-y-2">
                    {slot.sessions.map((item, idx) => <div key={idx} className={`p-3 rounded shadow-sm ${item.color} text-white`}>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm mt-1">
                          <ClockIcon className="h-3 w-3 inline-block mr-1" />
                          {item.session.startTime} - {item.session.endTime}
                        </div>
                        <div className="text-sm">Room: {item.session.room}</div>
                      </div>)}
                  </div> : <div className="h-6 border-l-2 border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 ml-2"></div>}
              </div>
            </div>)}
        </div>
      </div>;
  };
  // Render timetable view
  const renderTimetableView = () => {
    // Create time slots for the day (8AM to 8PM)
    const timeSlots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      timeSlots.push(`${formattedHour}:00 ${amPm}`);
    }
    return <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider">
                Time
              </th>
              {daysOfWeek.map(day => <th key={day} className="px-4 py-3 bg-gray-50 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 uppercase tracking-wider">
                  {day}
                </th>)}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 divide-y divide-gray-200 dark:divide-blue-800 jungle:divide-green-800 extra-dark:divide-gray-700">
            {timeSlots.map((time, timeIndex) => <tr key={timeIndex} className={timeIndex % 2 === 0 ? 'bg-gray-50 dark:bg-blue-900/20 jungle:bg-green-800/20 extra-dark:bg-gray-800/20' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  {time}
                </td>
                {daysOfWeek.map((day, dayIndex) => {
              const hour = parseInt(time.split(':')[0]) + (time.includes('PM') && time.split(':')[0] !== '12' ? 12 : 0);
              const courseSessions = getCourseSessionsForDay(day);
              // Find sessions that occur during this time slot
              const sessionsInTimeSlot: any[] = [];
              courseSessions.forEach(course => {
                course.sessions.forEach(session => {
                  const sessionStartHour = parseInt(session.startTime.split(':')[0]);
                  const sessionEndHour = parseInt(session.endTime.split(':')[0]);
                  if (hour >= sessionStartHour && hour < sessionEndHour) {
                    sessionsInTimeSlot.push({
                      ...course,
                      session
                    });
                  }
                });
              });
              return <td key={dayIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                      {sessionsInTimeSlot.length > 0 ? <div className="space-y-2">
                          {sessionsInTimeSlot.map((item, idx) => <div key={idx} className={`p-2 rounded ${item.color} text-white text-xs`}>
                              <div className="font-medium">{item.title}</div>
                              <div className="mt-1">
                                Room: {item.session.room}
                              </div>
                            </div>)}
                        </div> : null}
                    </td>;
            })}
              </tr>)}
          </tbody>
        </table>
      </div>;
  };
  // Calculate course progress and completion dates
  const calculateCourseProgress = () => {
    const today = new Date();
    return courseSchedules.map(course => {
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      // Calculate total duration in days
  const totalDuration = Math.floor((Number(endDate) - Number(startDate)) / (1000 * 60 * 60 * 24));
  // Calculate elapsed duration in days
  const elapsedDuration = Math.floor((Number(today) - Number(startDate)) / (1000 * 60 * 60 * 24));
  // Calculate progress percentage
  let progress = Math.floor(elapsedDuration / totalDuration * 100);
  // Ensure progress is between 0 and 100
  progress = Math.max(0, Math.min(100, progress));
  // Calculate days remaining
  const daysRemaining = Math.max(0, Math.floor((Number(endDate) - Number(today)) / (1000 * 60 * 60 * 24)));
      return {
        ...course,
        progress,
        daysRemaining,
        isCompleted: progress === 100
      };
    });
  };
  const courseProgressData = calculateCourseProgress();
  return <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
          Calendar
        </h1>
        <p className="text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
          Manage your schedule, view holidays, and track course timelines
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
              <div className="flex items-center mb-4 sm:mb-0">
                <button onClick={() => {
                if (viewMode === 'month') prevMonth();else if (viewMode === 'week') prevWeek();else if (viewMode === 'day') prevDay();
              }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100 mx-4">
                  {viewMode === 'month' ? currentDate.toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric'
                }) : viewMode === 'week' ? `Week of ${getWeekDates()[0].toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })} - ${getWeekDates()[6].toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}` : currentDate.toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                </h2>
                <button onClick={() => {
                if (viewMode === 'month') nextMonth();else if (viewMode === 'week') nextWeek();else if (viewMode === 'day') nextDay();
              }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-blue-900 jungle:hover:bg-green-800 extra-dark:hover:bg-gray-800 text-gray-600 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="ml-2 px-3 py-1 text-sm bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 rounded-md hover:bg-emerald-200 dark:hover:bg-blue-800 jungle:hover:bg-green-700 extra-dark:hover:bg-gray-700">
                  Today
                </button>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => setViewMode('month')} className={`p-2 rounded-md text-sm ${viewMode === 'month' ? 'bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : 'text-gray-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50'}`}>
                  <CalendarIcon className="h-5 w-5 sm:hidden" />
                  <span className="hidden sm:inline">Month</span>
                </button>
                <button onClick={() => setViewMode('week')} className={`p-2 rounded-md text-sm ${viewMode === 'week' ? 'bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : 'text-gray-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50'}`}>
                  <ListIcon className="h-5 w-5 sm:hidden" />
                  <span className="hidden sm:inline">Week</span>
                </button>
                <button onClick={() => setViewMode('day')} className={`p-2 rounded-md text-sm ${viewMode === 'day' ? 'bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : 'text-gray-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50'}`}>
                  <ClockIcon className="h-5 w-5 sm:hidden" />
                  <span className="hidden sm:inline">Day</span>
                </button>
                <button onClick={() => setViewMode('timetable')} className={`p-2 rounded-md text-sm ${viewMode === 'timetable' ? 'bg-emerald-100 dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-emerald-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300' : 'text-gray-600 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-blue-900/50 jungle:hover:bg-green-800/50 extra-dark:hover:bg-gray-800/50'}`}>
                  <GridIcon className="h-5 w-5 sm:hidden" />
                  <span className="hidden sm:inline">Timetable</span>
                </button>
              </div>
            </div>
            <div className="p-4">{renderCalendarContent()}</div>
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Calendar Type
              </h3>
            </div>
            <div className="p-4">
              <label htmlFor="calendar-type" className="block text-sm font-medium text-gray-700 dark:text-blue-300 jungle:text-green-300 extra-dark:text-gray-300 mb-2">
                Select Calendar
              </label>
              <div className="relative">
                <select id="calendar-type" value={selectedCalendarType} onChange={e => setSelectedCalendarType(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-blue-700 jungle:border-green-700 extra-dark:border-gray-700 focus:outline-none focus:ring-emerald-500 dark:focus:ring-blue-500 jungle:focus:ring-green-500 extra-dark:focus:ring-gray-500 focus:border-emerald-500 dark:focus:border-blue-500 jungle:focus:border-green-500 extra-dark:focus:border-gray-500 sm:text-sm rounded-md bg-white dark:bg-blue-900 jungle:bg-green-800 extra-dark:bg-gray-800 text-gray-900 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                  {calendarTypes.map(type => <option key={type.id} value={type.id}>
                      {type.name} ({type.region})
                    </option>)}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <GlobeIcon className="h-4 w-4 text-gray-400 dark:text-blue-500 jungle:text-green-500 extra-dark:text-gray-500" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                View holidays and events based on different calendar systems
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-blue-950 jungle:bg-green-900 extra-dark:bg-gray-900 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                Course Progress
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {courseProgressData.map((course, index) => <div key={index} className="border border-gray-200 dark:border-blue-800 jungle:border-green-800 extra-dark:border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 dark:text-blue-100 jungle:text-green-100 extra-dark:text-gray-100">
                      {course.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${course.isCompleted ? 'bg-green-100 dark:bg-green-900/30 jungle:bg-green-900/30 extra-dark:bg-green-900/30 text-green-800 dark:text-green-300 jungle:text-green-300 extra-dark:text-green-300' : 'bg-blue-100 dark:bg-blue-900/30 jungle:bg-blue-900/30 extra-dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 jungle:text-blue-300 extra-dark:text-blue-300'}`}>
                      {course.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-blue-800 jungle:bg-green-800 extra-dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-emerald-600 dark:bg-blue-500 jungle:bg-green-500 extra-dark:bg-gray-500 h-2 rounded-full" style={{
                  width: `${course.progress}%`
                }}></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-blue-400 jungle:text-green-400 extra-dark:text-gray-400">
                    <div className="flex items-center mt-1">
                      <CalendarIcon2 className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(course.startDate).toLocaleDateString()} -{' '}
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock3Icon className="h-4 w-4 mr-1" />
                      <span>
                        {course.isCompleted ? 'Course completed' : `${course.daysRemaining} days remaining`}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      <span>{course.progress}% complete</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default CalendarPage;