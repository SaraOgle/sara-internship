import { useState, useEffect } from 'react';

const useCountdown = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiryDate) return;

    const calculateTime = () => {
      const time = expiryDate - Date.now();

      if (time <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      setTimeLeft({
        hours: Math.floor((time / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((time / 1000 / 60) % 60),
        seconds: Math.floor((time / 1000) % 60),
        expired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return timeLeft;
};

export default useCountdown;