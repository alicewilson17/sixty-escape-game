import React from "react";
import NavBar from "../Components/NavBar";
import Countdown from "../Components/Countdown";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

function MissionHome({ teamData, setTeamData, setIsGameInProgress }) {
  const startTime = new Date("October 4, 2024 10:00:00");
  const endTime = new Date("October 4, 2024 11:00:00");

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
      <NavBar />
      <div className="mission-home">
        <div className="mission-header">
          <h1>Welcome, {teamData.team_name}</h1>
        </div>
        <Countdown
          startTime={startTime}
          endTime={endTime}
          setIsGameInProgress={setIsGameInProgress}
        />
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
