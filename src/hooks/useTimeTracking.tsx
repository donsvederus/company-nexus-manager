
import { useState, useEffect } from "react";

export function useTimeTracking(startTime?: string, endTime?: string, previousDuration: number = 0) {
  const [elapsed, setElapsed] = useState<string>("");
  const [isTracking, setIsTracking] = useState<boolean>(!!startTime && !endTime);
  const [accumulatedMinutes, setAccumulatedMinutes] = useState<number>(previousDuration || 0);
  
  useEffect(() => {
    let timer: number;
    
    if (isTracking && startTime && !endTime) {
      // When tracking is active, update the timer every second
      timer = window.setInterval(() => {
        const start = new Date(startTime);
        const now = new Date();
        const currentSessionMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);
        const totalMinutes = (previousDuration || 0) + currentSessionMinutes;
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        setElapsed(formattedTime);
      }, 1000);
    } else if (startTime && endTime) {
      // When tracking is stopped, calculate the final time once
      const totalMinutes = previousDuration || 0;
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      setElapsed(formattedTime);
    } else if (previousDuration > 0) {
      // Just display the previous duration if available
      const hours = Math.floor(previousDuration / 60);
      const minutes = previousDuration % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      setElapsed(formattedTime);
    }
    
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isTracking, startTime, endTime, previousDuration]);
  
  useEffect(() => {
    setIsTracking(!!startTime && !endTime);
    setAccumulatedMinutes(previousDuration || 0);
  }, [startTime, endTime, previousDuration]);

  return { elapsed, isTracking, accumulatedMinutes };
}
