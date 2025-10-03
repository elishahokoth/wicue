import { useEffect, useState } from 'react';
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="fixed bottom-4 right-4 text-xs font-mono bg-white/70 dark:bg-blue-950/70 jungle:bg-green-900/70 extra-dark:bg-gray-900/70 text-gray-800 dark:text-blue-200 jungle:text-green-200 extra-dark:text-gray-200 px-1.5 py-0.5 rounded-md shadow-md z-40 scale-90">
      <div>{formatTime(time)}</div>
      <div>{formatDate(time)}</div>
    </div>;
};
export default DigitalClock;