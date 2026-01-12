import React, { useEffect, useState } from 'react';

export default function GitHubCalendarWrapper() {
  const [CalendarComponent, setCalendarComponent] = useState<any>(null);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        // @ts-ignore
        const mod = await import('react-github-calendar');
        // @ts-ignore
        setCalendarComponent(() => mod.default || mod);
      } catch (e) {
        console.error("Failed to load GitHubCalendar", e);
      }
    };
    loadCalendar();
  }, []);

  const customTheme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  if (!CalendarComponent) {
    return <div className="text-gray-500 text-sm">Loading contribution graph...</div>;
  }

  return (
    <div className="flex justify-center w-full overflow-x-auto">
      <div style={{ minWidth: '700px' }}>
        <CalendarComponent 
          username="gafnaa" 
          colorScheme="dark"
          theme={customTheme}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
        />
      </div>
    </div>
  );
}
