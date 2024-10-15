import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import Countdown from "../Components/Countdown";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function MissionHome({ teamData, setTeamData, setIsGameInProgress}) {
const [eventData, setEventData] = useState(null)
const [durationMinutes, setDurationMinutes] = useState(120)
const isAdmin = teamData?.team_name === "admin";
const eventId = "event_1"


  //fetch event data on component mount
  useEffect(() => {
    const fetchEventData = async() => {
const eventRef = doc(db, "events", eventId)
const eventSnap = await getDoc(eventRef)
if(eventSnap.exists()) {
  setEventData(eventSnap.data())
} else {
  console.log("Event data not found.")
}
    }
    fetchEventData()

  }, [])

  async function handleStartGame() {
    try {
const startTime = new Date()
const durationMilliseconds = durationMinutes * 60 * 1000
const endTime = new Date(startTime.getTime() + durationMilliseconds)

const eventRef = doc(db, "events", eventId)
await setDoc(eventRef, {
  startTime: startTime.toISOString(),
  endTime: endTime.toISOString(),
  duration: durationMinutes
},
{merge:true})

setEventData({
  startTime: startTime,
  endTime: endTime,
  isGameInProgress: true
})
console.log("Event started successfully!")
    }
    catch(error) {
      console.error("Error starting the game:", error)
    }
  }

  async function handleSignOut() {
    try {
      await auth.signOut();
      setTeamData(null);
      console.log("Signed out successfully.");
    } catch (error) {
      console.log("Error signing out. Please try again.");
    }
  }

  return (
    <>

      <div className="mission-home">
        <div className="mission-header">
          <h1>Welcome, {teamData.team_name}</h1>
        </div>
       {eventData ? <Countdown
          startTime={new Date(eventData.startTime)}
          endTime={new Date(eventData.endTime)}
          setIsGameInProgress={setIsGameInProgress}
        /> : <p>The mission is not currently in progress. Please report to HQ for instructions.</p>}
          {isAdmin && (
        <div className="admin-controls">
          <p> Set duration of game (minutes):</p>
           <div className="admin-controls-form">
            <input
              type="number"
              value={durationMinutes || ""}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            />
      
          <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}
        <p className="sign-out">
          Need to switch teams?{" "}
          <button className="signout-btn" onClick={handleSignOut}>
            Click here
          </button>
        </p>
      </div>
    </>
  );
}

export default MissionHome;
