import { count } from "firebase/firestore";
import React, { useEffect, useState } from "react";

function Countdown({ startTime, endTime, setIsGameInProgress }) {
  const [countdown, setCountdown] = useState(null);
  //want countdown to either first load as 0 if game has finished, endtime-start time if game hasnt started, or endtime-current time if game in progress.

  function calculateCountdown() {
    const currentTime = new Date();

    let counter = 0;
    if (startTime < currentTime && currentTime < endTime) {
      counter = endTime - currentTime; //if game in progress, return time left until end of game
    } else {
      counter = 0; //if game has finished, return 0
    }
    return counter;
  }


  useEffect(() => {
    setCountdown(calculateCountdown())
    const interval = setInterval(() => {
      const newCountdown = calculateCountdown();
      setCountdown(newCountdown);
      //set the isGameInProgress state based on the new countdown
      if (newCountdown > 0 && newCountdown < endTime - startTime) {
        setIsGameInProgress(true);
      } else {
        setIsGameInProgress(false);
      }
    }, 1000); //recalculate the countdown every second
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const timeDiff = new Date(countdown);
  const hours = timeDiff.getUTCHours();
  const mins = timeDiff.getUTCMinutes();
  const secs = timeDiff.getUTCSeconds();
  const timeString = `${hours < 10 ? 0 : ""}${hours}:${
    mins < 10 ? 0 : ""
  }${mins}:${secs < 10 ? 0 : ""}${secs}`;

  return (
    <div>
      <h3>Time remaining</h3>
      <p className="countdown">{timeString}</p>
      {countdown === 0 && (
        <p>The mission is not currently in progress. Please report to HQ for instructions.</p>
      )}
    </div>
  );
}

export default Countdown;
