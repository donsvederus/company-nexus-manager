
import { useState, useEffect } from "react";

export function useTimeTracking(startTime?: string, endTime?: string, previousDuration: number = 0) {
  const [elapsed, setElapsed] = useState<string>("00:00:00");
  const [isTracking, setIsTracking] = useState<boolean>(!!startTime && !endTime);
  const [accumulatedMinutes, setAccumulatedMinutes] = useState<number>(previousDuration || 0);
  
  useEffect(() => {
    let timer: number;
    
    if (isTracking && startTime && !endTime) {
      // When tracking is active, update the timer every second
      timer = window.setInterval(() => {
        const start = new Date(startTime);
        const now = new Date();
        const currentSessionSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
        const currentSessionMinutes = currentSessionSeconds / 60;
        
        const totalMinutes = accumulatedMinutes + currentSessionMinutes;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const seconds = Math.floor((currentSessionSeconds % 60));
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        setElapsed(formattedTime);
      }, 1000);
    } else if (startTime && endTime) {
      // When tracking is stopped, calculate the final time once
      const totalMinutes = accumulatedMinutes;
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      setElapsed(formattedTime);
    } else if (previousDuration > 0) {
      // Just display the previous duration if available
      const hours = Math.floor(previousDuration / 60);
      const minutes = Math.floor(previousDuration % 60);
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      setElapsed(formattedTime);
    } else {
      // Set a default time of 00:00:00 when no time is tracked
      setElapsed("00:00:00");
    }
    
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isTracking, startTime, endTime, accumulatedMinutes, previousDuration]);
  
  useEffect(() => {
    setIsTracking(!!startTime && !endTime);
    setAccumulatedMinutes(previousDuration || 0);
  }, [startTime, endTime, previousDuration]);

  return { elapsed, isTracking, accumulatedMinutes };
}
