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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocusIn = (event) => {
      const inputField = event.target;
    if (inputField.tagName === "INPUT" || inputField.tagName === "TEXTAREA") {
      inputField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
      setIsKeyboardOpen(true); // Hide navbar when keyboard opens
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false); // Show navbar when keyboard closes
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

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
      {/* only render the NavBar if a used is logged in and the keyboard is not open */}
      <NavBar className={teamData && !isKeyboardOpen ? 'visible' : 'hidden'} />
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