import React from "react";
import NavBar from "../Components/NavBar";
import Countdown from "../Components/Countdown";

function MissionHome({ teamData }) {
  const startTime = new Date("October 2, 2024 11:00:00");
  const endTime = new Date("October 2, 2024 13:00:00");
  return (
    <>
      <NavBar />
      <div>Welcome, {teamData.team_name}</div>
      <Countdown startTime={startTime} endTime={endTime} />
    </>
  );
}

export default MissionHome;
