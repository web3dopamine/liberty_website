import React, { useEffect } from "react";

const CountdownTimer = ({ target = 1768435200000, onTick = () => {} }) => {
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();

      if (onTick) {
        onTick(newTimeLeft);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [target, onTick]);

  return null;
};

export default React.memo(CountdownTimer);
