import React, { useEffect, useState, useRef } from 'react';

export default function GitHubCalendarWrapper() {
  const [CalendarComponent, setCalendarComponent] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, currentStreak: 0, longestStreak: 0 });
  const processedRef = useRef(false);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        // @ts-ignore
        const mod = await import('react-github-calendar');
        // @ts-ignore
        const Calendar = mod.default || mod.GitHubCalendar || mod;
        setCalendarComponent(() => Calendar);
      } catch (e) {
        console.error("Failed to load GitHubCalendar", e);
      }
    };
    loadCalendar();
  }, []);

  const calculateStats = (data: any[]) => {
    if (processedRef.current) return data;
    
    let total = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Sort to be safe, though usually sorted
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Total & Longest Streak
    sortedData.forEach(day => {
      total += day.count;
      if (day.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    // Current Streak
    // Iterate backwards
    let i = sortedData.length - 1;
    // Check if today has contribution
    if (sortedData[i] && sortedData[i].count > 0) {
      currentStreak++;
      i--;
    } else {
      // If today is 0, check yesterday
      // (If today is 0, we start checking from yesterday)
      // Actually, if today is 0, streak might be 0 unless correct logic is used. 
      // Usually "current streak" allows today to be 0 if yesterday was active.
      // But let's stick to strict: consecutive days ending at last available data point (today).
      // If today is 0, streak is 0? Or do we skip today?
      // Let's assume if today is 0, we just check yesterday.
      if (sortedData.length > 0 && sortedData[sortedData.length - 1].count === 0) {
         i--;
      }
    }
    
    while (i >= 0) {
      if (sortedData[i].count > 0) {
        currentStreak++;
        i--;
      } else {
        break;
      }
    }

    // Only update if changed to avoid loops, though processedRef handles single pass mostly
    setStats({ total, currentStreak, longestStreak });
    processedRef.current = true;
    
    return data;
  };

  const customTheme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  if (!CalendarComponent) {
    return (
      <div className="flex justify-center items-center h-[160px] w-full animate-pulse">
        <div className="text-gray-500 text-sm">Loading contribution graph...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-700">
      <div className="w-full overflow-x-auto flex justify-center mb-4">
        <div style={{ minWidth: '700px' }}>
          <CalendarComponent 
            username="gafnaa" 
            colorScheme="dark"
            theme={customTheme}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            transformData={calculateStats}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center text-sm w-full max-w-[700px]">
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span className="text-gray-400 text-xs uppercase font-semibold">Total</span>
          </div>
          <span className="text-white font-bold text-lg">{stats.total}</span>
          <span className="text-gray-500 text-xs">Last Year</span>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3a9 9 0 0 0 .9 2.8z"></path></svg>
            <span className="text-gray-400 text-xs uppercase font-semibold">Current Streak</span>
          </div>
          <span className="text-white font-bold text-lg">{stats.currentStreak} days</span>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            <span className="text-gray-400 text-xs uppercase font-semibold">Longest Streak</span>
          </div>
          <span className="text-white font-bold text-lg">{stats.longestStreak} days</span>
        </div>
      </div>
    </div>
  );
}
