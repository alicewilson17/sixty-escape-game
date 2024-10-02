import { count } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

function Countdown({startTime, endTime}) {

//want countdown to either first load as 0 if game has finished, endtime-start time if game hasnt started, or endtime-current time if game in progress.


function calculateCountdown() {
    const currentTime = new Date(Date.now())
    
    let counter = 0;
    if ((startTime < currentTime) && (currentTime < endTime)) {
        counter = endTime-currentTime
    }
    else if ((startTime > currentTime)) {
        counter = endTime-startTime
    }
    else {
        counter = 0
    }
    return counter
}

const [countdown, setCountdown] = useState(calculateCountdown())


useEffect(() => {
    const interval = setInterval(() => {
        setCountdown(calculateCountdown())
    }, 1000)
    return () => clearInterval(interval)
}, [countdown])

const timeDiff = new Date(countdown)
const hours = timeDiff.getUTCHours()
const mins = timeDiff.getUTCMinutes()
const secs = timeDiff.getUTCSeconds()
const timeString = `${hours < 10 ? 0 : ""}${hours}:${mins < 10 ? 0 : ""}${mins}:${secs < 10 ? 0 : ""}${secs}`



  return (
    <div>Countdown
        <div>{timeString}</div>
        {countdown === 0 && <div>Time's up! The mission has finished. Please return to HQ.</div>}
        {countdown === endTime-startTime && <div>The mission hasn't started yet. Please check back later.</div>}
    </div>

  )
}

export default Countdown