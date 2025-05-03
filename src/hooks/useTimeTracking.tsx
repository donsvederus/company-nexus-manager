
import { useState, useEffect } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

export function useTimeTracking(startTime?: string, endTime?: string) {
  const [elapsed, setElapsed] = useState<string>("");
  const [isTracking, setIsTracking] = useState<boolean>(!!startTime && !endTime);
  
  useEffect(() => {
    let timer: number;
    
    if (isTracking && startTime && !endTime) {
      timer = window.setInterval(() => {
        const start = new Date(startTime);
        const now = new Date();
        const duration = intervalToDuration({ start, end: now });
        setElapsed(formatDuration(duration));
      }, 1000);
    } else if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const duration = intervalToDuration({ start, end });
      setElapsed(formatDuration(duration));
    }
    
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isTracking, startTime, endTime]);
  
  useEffect(() => {
    setIsTracking(!!startTime && !endTime);
  }, [startTime, endTime]);

  return { elapsed, isTracking };
}
