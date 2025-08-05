import { useState, useEffect } from 'react';

export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

export function useLocalTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const hasMounted = useClientOnly();

  useEffect(() => {
    if (!hasMounted) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [hasMounted]);

  const formatTime = (date: Date) => {
    if (!hasMounted) return '--:--';
    
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    if (!hasMounted) return 'Loading...';
    
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return {
    currentTime,
    formatTime,
    formatDate,
    hasMounted
  };
}
