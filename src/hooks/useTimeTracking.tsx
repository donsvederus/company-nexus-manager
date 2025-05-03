
import { useState, useEffect } from "react";
import { formatDuration, intervalToDuration } from "date-fns";

export function useTimeTracking(startTime?: string, endTime?: string, previousDuration: number = 0) {
  const [elapsed, setElapsed] = useState<string>("");
  const [isTracking, setIsTracking] = useState<boolean>(!!startTime && !endTime);
  const [accumulatedMinutes, setAccumulatedMinutes] = useState<number>(previousDuration);
  
  useEffect(() => {
    let timer: number;
    
    if (isTracking && startTime && !endTime) {
      timer = window.setInterval(() => {
        const start = new Date(startTime);
        const now = new Date();
        const currentSessionMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);
        const totalMinutes = accumulatedMinutes + currentSessionMinutes;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        setElapsed(formattedTime);
      }, 1000);
    } else if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const currentSessionMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);
      const totalMinutes = accumulatedMinutes + currentSessionMinutes;
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      setElapsed(formattedTime);
    }
    
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isTracking, startTime, endTime, accumulatedMinutes]);
  
  useEffect(() => {
    setIsTracking(!!startTime && !endTime);
  }, [startTime, endTime]);

  return { elapsed, isTracking, accumulatedMinutes };
}
