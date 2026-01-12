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
    return <div className="text-gray-500 text-sm">Loading contribution graph...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
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
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1">
          <span className="text-gray-400 text-xs uppercase font-semibold mb-1">Total Contributions</span>
          <span className="text-white font-bold text-lg">{stats.total}</span>
          <span className="text-gray-500 text-xs">Last Year</span>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1">
          <span className="text-gray-400 text-xs uppercase font-semibold mb-1">Current Streak</span>
          <span className="text-white font-bold text-lg">{stats.currentStreak} days</span>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-md px-4 py-2 flex flex-col items-center min-w-[150px] flex-1">
          <span className="text-gray-400 text-xs uppercase font-semibold mb-1">Longest Streak</span>
          <span className="text-white font-bold text-lg">{stats.longestStreak} days</span>
        </div>
      </div>
    </div>
  );
}
