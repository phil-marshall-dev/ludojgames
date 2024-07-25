import React, { useEffect, useState } from 'react';

// Define the props type
interface PlayerTimeProps {
  moveStartTimeStamp: number; // Timestamp when the move started
  timeOnClockAtStartOfMove: number; // Time on the clock when the move started in milliseconds
  playersTurn: boolean; // Indicates if it's the player's turn
}

const PlayerTime: React.FC<PlayerTimeProps> = ({ moveStartTimeStamp, timeOnClockAtStartOfMove, playersTurn }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (playersTurn) {
      const updateRemainingTime = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - moveStartTimeStamp;
        const newRemainingTime = timeOnClockAtStartOfMove - elapsedTime;

        setRemainingTime(Math.max(newRemainingTime, 0)); // Ensure time does not go below 0
      };

      updateRemainingTime(); // Initial update

      const intervalId = setInterval(updateRemainingTime, 1000); // Update every second

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    } else {
      // If it's not the player's turn, just display the remaining time without countdown
      const initialRemainingTime = timeOnClockAtStartOfMove - (Date.now() - moveStartTimeStamp);
      setRemainingTime(Math.max(initialRemainingTime, 0));
    }
  }, [moveStartTimeStamp, timeOnClockAtStartOfMove, playersTurn]);

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div>
      {formatTime(remainingTime)}
    </div>
  );
};

export default PlayerTime;
