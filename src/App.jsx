import NavBar from "./Components/NavBar";
import LeaderBoard from "./Pages/LeaderBoard";
import Login from "./Pages/Login";
import MissionHome from "./Pages/MissionHome";
import Challenges from "./Pages/Challenges";
import {Route, Routes} from 'react-router-dom'


function App() {
  return (
    <div>
      <NavBar/>
      <Login />
      <Routes>
        <Route path="/" element={<MissionHome />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </div>
  );
}

export default App;