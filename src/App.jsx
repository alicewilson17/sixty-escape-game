import NavBar from "./Components/NavBar";
import LeaderBoard from "./Pages/LeaderBoard";
import Login from "./Pages/Login";
import MissionHome from "./Pages/MissionHome";
import Challenges from "./Pages/Challenges";
import {Route, Routes} from 'react-router-dom'
import { useState, useEffect } from "react";
import SingleChallenge from "./Pages/SingleChallenge";


function App() {
  const [isGameInProgress, setIsGameInProgress] = useState(false)

  //state for storing logged-in team data, get it from localStorage if it exists
  const [teamData, setTeamData] = useState(() => {
    const savedTeamData = localStorage.getItem('teamData')
    return savedTeamData ? JSON.parse(savedTeamData) : null
  })

   // Whenever teamData is updated, save it to localStorage
   useEffect(() => {
    if (teamData) {
      localStorage.setItem('teamData', JSON.stringify(teamData));
    }
  }, [teamData]);

  return (
    <div>
      
      <Routes>
        <Route path="/" element={!teamData ? (<Login setTeamData={setTeamData}/>) : <MissionHome teamData={teamData} setTeamData={setTeamData} setIsGameInProgress={setIsGameInProgress}/>} />
        <Route path="/challenges" element={<Challenges teamData={teamData} isGameInProgress={isGameInProgress}/>} />
        <Route path="/leaderboard" element={<LeaderBoard teamData={teamData}/>} />
        <Route path="/challenges/:station_id" element={<SingleChallenge teamData={teamData}/>} />
      </Routes>
    </div>
  );
}

export default App;